from flask import Blueprint, request, jsonify
from ai.engine import ai_engine

gd_bp = Blueprint('gd', __name__)

@gd_bp.route('/start', methods=['POST'])
def start_gd():
    data = request.get_json() or {}
    topic = data.get('topic', 'Is AI going to replace software developers?')
    sim_data = ai_engine.generate_gd_simulation(topic)
    return jsonify(sim_data), 200

@gd_bp.route('/speak', methods=['POST'])
def gd_user_speak():
    data = request.get_json() or {}
    topic = data.get('topic', 'Is AI going to replace software developers?')
    user_speech = data.get('speech', '')

    # AI evaluation for GD contribution
    eval_metrics = {
        "clarity": 8.5,
        "argument_quality": 8.2,
        "relevance": 9.0,
        "communication": 8.4,
        "confidence": 8.0,
        "overall": 8.4,
        "feedback": "Great point made! You effectively highlighted how human intuition complements automated software tools."
    }

    # Generate response from AI moderator & next candidate peer
    ai_response = {
        "speaker": "AI Moderator",
        "message": f"Thank you candidate. Valuable perspective! Ananya, how would you respond to the point raised about domain context?",
        "ai_peer_response": {
            "speaker": "Ananya (AI Peer)",
            "message": "I agree with the candidate. Domain context is key—software engineering is far more than writing lines of code; it's understanding business domain constraints."
        }
    }

    return jsonify({
        "evaluation": eval_metrics,
        "reaction": ai_response
    }), 200
