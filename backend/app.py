import os
from flask import Flask, jsonify
from flask_cors import CORS

from database import init_db
from routes.auth import auth_bp
from routes.interview import interview_bp
from routes.resume import resume_bp
from routes.coding import coding_bp
from routes.aptitude import aptitude_bp
from routes.gd import gd_bp
from routes.questions import questions_bp
from routes.progress import progress_bp
from routes.report import report_bp

app = Flask(__name__)
CORS(app)

# Ensure database and uploads exist
os.makedirs(os.path.join(os.path.dirname(__file__), "..", "database"), exist_ok=True)
os.makedirs(os.path.join(os.path.dirname(__file__), "uploads"), exist_ok=True)
init_db()

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(interview_bp, url_prefix='/api/interview')
app.register_blueprint(resume_bp, url_prefix='/api/resume')
app.register_blueprint(coding_bp, url_prefix='/api/coding')
app.register_blueprint(aptitude_bp, url_prefix='/api/aptitude')
app.register_blueprint(gd_bp, url_prefix='/api/gd')
app.register_blueprint(questions_bp, url_prefix='/api/questions')
app.register_blueprint(progress_bp, url_prefix='/api/progress')
app.register_blueprint(report_bp, url_prefix='/api/report')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
        "app": "MockMate AI Cockpit API",
        "version": "1.0"
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
