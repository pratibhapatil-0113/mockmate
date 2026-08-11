from flask import Blueprint, request, jsonify
import json
from database import get_db_connection

aptitude_bp = Blueprint('aptitude', __name__)

@aptitude_bp.route('/tests', methods=['GET'])
def get_aptitude_tests():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, category, duration_mins, questions_json FROM aptitude_tests")
    rows = cursor.fetchall()
    conn.close()

    tests = []
    for r in rows:
        t = dict(r)
        t['questions'] = json.loads(t['questions_json'])
        tests.append(t)

    return jsonify({"tests": tests}), 200

@aptitude_bp.route('/submit', methods=['POST'])
def submit_aptitude_test():
    data = request.get_json() or {}
    user_id = data.get('user_id', 1)
    test_id = data.get('test_id')
    user_answers = data.get('answers', {}) # {"1": 3, "2": 1}

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM aptitude_tests WHERE id = ?", (test_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return jsonify({'error': 'Test not found'}), 404

    test = dict(row)
    questions = json.loads(test['questions_json'])

    correct_count = 0
    total_count = len(questions)

    for q in questions:
        q_id = str(q['id'])
        if q_id in user_answers and user_answers[q_id] == q['answer']:
            correct_count += 1

    percentage = round((correct_count / total_count) * 100, 1) if total_count > 0 else 0.0

    # Award XP
    cursor.execute("UPDATE users SET xp = xp + 25 WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()

    return jsonify({
        "test_id": test_id,
        "correct_count": correct_count,
        "total_count": total_count,
        "percentage": percentage
    }), 200
