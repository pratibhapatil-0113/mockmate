from flask import Blueprint, request, jsonify
import json
from database import get_db_connection
from ai.engine import ai_engine

interview_bp = Blueprint('interview', __name__)

@interview_bp.route('/start', methods=['POST'])
def start_interview():
    data = request.get_json() or {}
    user_id = data.get('user_id', 1)
    role = data.get('role', 'Software Developer')
    interview_type = data.get('type', 'Technical') # Technical, Behavioral, Coding, Resume, HR
    difficulty = data.get('difficulty', 'Medium')
    language = data.get('language', 'English')

    conn = get_db_connection()
    cursor = conn.cursor()

    # Create interview session
    cursor.execute(
        "INSERT INTO interviews (user_id, role, type, difficulty, language) VALUES (?, ?, ?, ?, ?)",
        (user_id, role, interview_type, difficulty, language)
    )
    interview_id = cursor.lastrowid
    conn.commit()

    # Fetch initial questions from AI Engine
    questions = ai_engine.get_initial_questions(role=role, interview_type=interview_type, difficulty=difficulty, language=language)

    saved_questions = []
    for q in questions:
        q_text = q.get('question', '')
        q_cat = q.get('category', interview_type)
        cursor.execute(
            "INSERT INTO questions (interview_id, question_text, category) VALUES (?, ?, ?)",
            (interview_id, q_text, q_cat)
        )
        q_id = cursor.lastrowid
        saved_questions.append({
            "id": q_id,
            "category": q_cat,
            "question_text": q_text,
            "user_answer": "",
            "follow_up": None
        })

    conn.commit()
    conn.close()

    return jsonify({
        "interview_id": interview_id,
        "role": role,
        "type": interview_type,
        "difficulty": difficulty,
        "language": language,
        "questions": saved_questions
    }), 201

@interview_bp.route('/answer', methods=['POST'])
def submit_answer():
    data = request.get_json() or {}
    interview_id = data.get('interview_id')
    question_id = data.get('question_id')
    user_answer = data.get('answer', '')

    if not question_id:
        return jsonify({'error': 'question_id is required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT q.*, i.role, i.language FROM questions q JOIN interviews i ON q.interview_id = i.id WHERE q.id = ?", (question_id,))
    q_row = cursor.fetchone()
    if not q_row:
        conn.close()
        return jsonify({'error': 'Question not found'}), 404

    q_data = dict(q_row)
    role = q_data['role']
    language = q_data['language']
    question_text = q_data['question_text']

    # AI Evaluation for this answer
    eval_res = ai_engine.evaluate_answer(
        question=question_text,
        user_answer=user_answer,
        category=q_data['category'],
        role=role,
        language=language
    )

    # Generate dynamic follow-up if candidate provided an answer
    follow_up = None
    if user_answer and len(user_answer.strip()) > 5:
        follow_up = ai_engine.generate_followup(question=question_text, user_answer=user_answer, role=role)

    # Update question record
    cursor.execute('''
        UPDATE questions SET 
            user_answer = ?,
            score = ?,
            correctness = ?,
            relevance = ?,
            completeness = ?,
            communication = ?,
            confidence = ?,
            strong_points = ?,
            improve = ?,
            missing = ?,
            model_answer = ?,
            follow_up_prompt = ?
        WHERE id = ?
    ''', (
        user_answer,
        eval_res.get('overall_score', 8.0),
        eval_res.get('correctness', 8.0),
        eval_res.get('relevance', 8.0),
        eval_res.get('completeness', 8.0),
        eval_res.get('communication', 8.0),
        eval_res.get('confidence', 8.0),
        eval_res.get('strong_points', ''),
        eval_res.get('improve', ''),
        eval_res.get('missing', ''),
        eval_res.get('model_answer', ''),
        follow_up,
        question_id
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "question_id": question_id,
        "evaluation": eval_res,
        "follow_up": follow_up
    }), 200

@interview_bp.route('/evaluate/<int:interview_id>', methods=['POST', 'GET'])
def evaluate_interview(interview_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM interviews WHERE id = ?", (interview_id,))
    interview_row = cursor.fetchone()
    if not interview_row:
        conn.close()
        return jsonify({'error': 'Interview not found'}), 404

    cursor.execute("SELECT * FROM questions WHERE interview_id = ?", (interview_id,))
    questions = [dict(r) for r in cursor.fetchall()]

    if not questions:
        conn.close()
        return jsonify({'error': 'No questions found for interview'}), 400

    total_score = sum(q['score'] for q in questions)
    avg_score = round(total_score / len(questions), 1)

    summary = f"Completed {interview_row['type']} simulation for {interview_row['role']}. Average performance score is {avg_score}/10."

    cursor.execute(
        "UPDATE interviews SET overall_score = ?, summary = ? WHERE id = ?",
        (avg_score, summary, interview_id)
    )
    conn.commit()

    # Check for achievements
    user_id = interview_row['user_id']
    cursor.execute("SELECT COUNT(*) FROM interviews WHERE user_id = ?", (user_id,))
    int_count = cursor.fetchone()[0]

    if int_count == 1:
        cursor.execute(
            "INSERT OR IGNORE INTO achievements (user_id, badge_id, badge_name, description, icon) VALUES (?, ?, ?, ?, ?)",
            (user_id, "first_interview", "First Interview", "Completed your very first AI interview simulation!", "🏆")
        )
    if avg_score >= 9.0:
        cursor.execute(
            "INSERT OR IGNORE INTO achievements (user_id, badge_id, badge_name, description, icon) VALUES (?, ?, ?, ?, ?)",
            (user_id, "score_90", "Score 90+", "Achieved an overall score of 9.0+ in a simulation!", "🎯")
        )

    # Increment streak & XP
    cursor.execute("UPDATE users SET xp = xp + 50, streak = streak + 1 WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()

    return jsonify({
        "interview_id": interview_id,
        "overall_score": avg_score,
        "summary": summary,
        "questions": questions
    }), 200

@interview_bp.route('/history/<int:user_id>', methods=['GET'])
def get_history(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM interviews WHERE user_id = ? ORDER BY date DESC", (user_id,))
    interviews = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify({"interviews": interviews}), 200
