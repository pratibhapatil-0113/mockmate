from flask import Blueprint, request, jsonify
from database import get_db_connection

questions_bp = Blueprint('questions', __name__)

@questions_bp.route('/bank', methods=['GET'])
def get_question_bank():
    role = request.args.get('role')
    category = request.args.get('category')
    topic = request.args.get('topic')
    difficulty = request.args.get('difficulty')
    search = request.args.get('search', '').strip().lower()

    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM question_bank WHERE 1=1"
    params = []

    if role:
        query += " AND job_role = ?"
        params.append(role)
    if category:
        query += " AND category = ?"
        params.append(category)
    if topic:
        query += " AND topic = ?"
        params.append(topic)
    if difficulty:
        query += " AND difficulty = ?"
        params.append(difficulty)
    if search:
        query += " AND (question LIKE ? OR answer_guide LIKE ?)"
        params.append(f"%{search}%")
        params.append(f"%{search}%")

    cursor.execute(query, params)
    questions = [dict(r) for r in cursor.fetchall()]
    conn.close()

    return jsonify({"questions": questions}), 200

@questions_bp.route('/bookmark/<int:question_id>', methods=['POST'])
def toggle_bookmark(question_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT bookmarked FROM question_bank WHERE id = ?", (question_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return jsonify({'error': 'Question not found'}), 404

    new_val = 0 if row['bookmarked'] == 1 else 1
    cursor.execute("UPDATE question_bank SET bookmarked = ? WHERE id = ?", (new_val, question_id))
    conn.commit()
    conn.close()

    return jsonify({"question_id": question_id, "bookmarked": new_val}), 200
