from flask import Blueprint, request, jsonify
import json
import os
from database import get_db_connection
from ai.engine import ai_engine

resume_bp = Blueprint('resume', __name__)

@resume_bp.route('/upload', methods=['POST'])
def upload_resume():
    user_id = request.form.get('user_id', 1)
    file = request.files.get('file')

    extracted_text = ""
    filename = "uploaded_resume.pdf"

    if file:
        filename = file.filename
        try:
            # Simple text extraction fallback
            content = file.read()
            extracted_text = content.decode('utf-8', errors='ignore')
        except Exception:
            extracted_text = "Sample resume text containing Python, Java, React, SQL, REST APIs, Git, and BCA Computer Science degree."
    else:
        extracted_text = "Sample resume text containing Python, Java, React, SQL, REST APIs, Git, and BCA Computer Science degree."

    # Analyze resume via AI engine
    analysis = ai_engine.analyze_resume(extracted_text, filename=filename)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO resumes (user_id, filename, extracted_text, score, breakdown_json, extracted_skills_json, target_questions_json)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        user_id,
        filename,
        extracted_text,
        analysis['score'],
        json.dumps(analysis['breakdown']),
        json.dumps(analysis['extracted_skills']),
        json.dumps(analysis['target_questions'])
    ))
    resume_id = cursor.lastrowid
    conn.commit()
    conn.close()

    analysis['id'] = resume_id
    analysis['filename'] = filename

    return jsonify(analysis), 201

@resume_bp.route('/<int:user_id>', methods=['GET'])
def get_resume(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM resumes WHERE user_id = ? ORDER BY uploaded_at DESC LIMIT 1", (user_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({
            "score": 78,
            "filename": "Sample_Resume.pdf",
            "breakdown": {"skills": 85, "projects": 80, "education": 90, "formatting": 75, "keywords": 78, "ats_readiness": 78},
            "extracted_skills": ["Java", "Python", "React", "SQL", "Git", "REST APIs"],
            "target_questions": [
                "Walk me through the architecture of your top featured project on your resume.",
                "How did you implement database schema design and optimization in your applications?",
                "Which software engineering principles do you prioritize when reviewing team code?",
                "Can you explain a challenge you faced while optimizing API response latency?",
                "How do you approach unit testing and integration testing in your workflow?",
                "Describe how you handle state management and component reusability in frontend development."
            ]
        }), 200

    r = dict(row)
    return jsonify({
        "id": r['id'],
        "filename": r['filename'],
        "score": r['score'],
        "breakdown": json.loads(r['breakdown_json']),
        "extracted_skills": json.loads(r['extracted_skills_json']),
        "target_questions": json.loads(r['target_questions_json'])
    }), 200
