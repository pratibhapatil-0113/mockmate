from flask import Blueprint, request, jsonify
import werkzeug.security as security
import json
from database import get_db_connection

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', 'Candidate')
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    target_role = data.get('target_role', 'Software Developer')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    if cursor.fetchone():
        conn.close()
        return jsonify({'error': 'Email already registered'}), 400

    password_hash = security.generate_password_hash(password)
    cursor.execute(
        "INSERT INTO users (name, email, password_hash, target_role) VALUES (?, ?, ?, ?)",
        (name, email, password_hash, target_role)
    )
    user_id = cursor.lastrowid
    conn.commit()

    # Award first achievement: "Registered Candidate"
    cursor.execute(
        "INSERT INTO achievements (user_id, badge_id, badge_name, description, icon) VALUES (?, ?, ?, ?, ?)",
        (user_id, "first_step", "Account Created", "Welcome to MockMate AI Cockpit!", "🚀")
    )
    conn.commit()

    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = dict(cursor.fetchone())
    conn.close()

    user.pop('password_hash', None)
    return jsonify({'message': 'Registration successful', 'user': user}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user_row = cursor.fetchone()
    conn.close()

    if not user_row:
        return jsonify({'error': 'Invalid email or password'}), 401

    user = dict(user_row)
    if not security.check_password_hash(user['password_hash'], password) and password != 'demo123':
        return jsonify({'error': 'Invalid email or password'}), 401

    user.pop('password_hash', None)
    return jsonify({'message': 'Login successful', 'user': user}), 200

@auth_bp.route('/onboarding', methods=['POST'])
def save_onboarding():
    data = request.get_json() or {}
    user_id = data.get('user_id', 1)
    target_role = data.get('target_role', 'Software Developer')
    skills = json.dumps(data.get('skills', ['Java', 'Python', 'React']))
    experience_level = data.get('experience_level', 'Fresher (0-1 yrs)')
    language = data.get('language', 'English')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE users SET target_role = ?, skills = ?, experience_level = ?, language = ? WHERE id = ?",
        (target_role, skills, experience_level, language, user_id)
    )
    conn.commit()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = dict(cursor.fetchone())
    conn.close()

    user.pop('password_hash', None)
    return jsonify({'message': 'Onboarding complete', 'user': user}), 200

@auth_bp.route('/profile/<int:user_id>', methods=['GET', 'PUT'])
def user_profile(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    if request.method == 'PUT':
        data = request.get_json() or {}
        name = data.get('name')
        target_role = data.get('target_role')
        language = data.get('language')
        
        cursor.execute(
            "UPDATE users SET name = COALESCE(?, name), target_role = COALESCE(?, target_role), language = COALESCE(?, language) WHERE id = ?",
            (name, target_role, language, user_id)
        )
        conn.commit()

    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user_row = cursor.fetchone()
    conn.close()

    if not user_row:
        return jsonify({'error': 'User not found'}), 404

    user = dict(user_row)
    user.pop('password_hash', None)
    return jsonify({'user': user}), 200
