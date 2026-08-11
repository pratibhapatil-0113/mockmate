import urllib.request
import json
import urllib.parse
import sys

# Ensure UTF-8 output formatting
sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://127.0.0.1:5000/api"

def test_endpoint(name, path, method="GET", data=None):
    try:
        url = f"{BASE_URL}{path}"
        req = urllib.request.Request(url, method=method)
        if data:
            req.add_header('Content-Type', 'application/json')
            body = json.dumps(data).encode('utf-8')
        else:
            body = None
            
        with urllib.request.urlopen(req, data=body) as response:
            res_body = response.read().decode('utf-8')
            res_json = json.loads(res_body)
            print(f"SUCCESS: [{name}] {method} {path} -> Status {response.status}")
            return res_json
    except Exception as e:
        print(f"FAILED: [{name}] {method} {path} -> Error ({e})")
        return None

print("--- TESTING ALL MOCKMATE BACKEND FEATURES ---")
test_endpoint("Health Check", "/health")
test_endpoint("Register User", "/auth/register", "POST", {"name": "Test Candidate", "email": "test_user2@mockmate.io", "password": "password123", "target_role": "Software Developer"})
test_endpoint("Login User", "/auth/login", "POST", {"email": "test_user2@mockmate.io", "password": "password123"})
int_data = test_endpoint("Start Interview", "/interview/start", "POST", {"user_id": 1, "role": "Software Developer", "type": "Technical", "difficulty": "Medium", "language": "English"})

if int_data and "questions" in int_data:
    q_id = int_data["questions"][0]["id"]
    test_endpoint("Submit Answer", "/interview/answer", "POST", {"interview_id": int_data["interview_id"], "question_id": q_id, "answer": "Polymorphism in Java allows methods to perform different tasks based on object overriding."})
    test_endpoint("Evaluate Interview", f"/interview/evaluate/{int_data['interview_id']}", "POST")
    test_endpoint("Fetch History", "/interview/history/1")

test_endpoint("Fetch Resume Data", "/resume/1")
test_endpoint("Fetch Coding Problems", "/coding/problems")
test_endpoint("Run Coding Solution", "/coding/run", "POST", {"user_id": 1, "problem_id": 1, "code": "def reverse_string(s):\n    return s[::-1]\n", "language": "python"})
test_endpoint("Fetch Aptitude Tests", "/aptitude/tests")
test_endpoint("Submit Aptitude Quiz", "/aptitude/submit", "POST", {"user_id": 1, "test_id": 1, "answers": {"1": 3, "2": 1}})
test_endpoint("Start Group Discussion", "/gd/start", "POST", {"topic": "Is AI replacing developers?"})
test_endpoint("User GD Turn", "/gd/speak", "POST", {"topic": "Is AI replacing developers?", "speech": "AI automates boilerplate code but lacks human domain intuition."})
test_endpoint("Question Bank Library", "/questions/bank?category=Java")
test_endpoint("User Progress Stats", "/progress/stats/1")
test_endpoint("Fetch Report", "/report/1")
print("--- ALL BACKEND FEATURE VERIFICATIONS COMPLETE ---")
