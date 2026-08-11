import sqlite3
import os
import json
import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "database", "mockmate.db")

def get_db_connection():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        target_role TEXT DEFAULT 'Software Engineer',
        skills TEXT DEFAULT '[]',
        experience_level TEXT DEFAULT 'Fresher',
        language TEXT DEFAULT 'English',
        streak INTEGER DEFAULT 1,
        xp INTEGER DEFAULT 150,
        interview_readiness INTEGER DEFAULT 82,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Interviews Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS interviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        role TEXT NOT NULL,
        type TEXT NOT NULL, -- Technical, Behavioral, Coding, Resume, HR
        difficulty TEXT DEFAULT 'Medium',
        overall_score REAL DEFAULT 0.0,
        summary TEXT,
        language TEXT DEFAULT 'English',
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    ''')

    # Questions Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        interview_id INTEGER NOT NULL,
        question_text TEXT NOT NULL,
        category TEXT DEFAULT 'Technical', -- Technical, Behavioral, Coding, HR
        user_answer TEXT,
        score REAL DEFAULT 0.0,
        correctness REAL DEFAULT 0.0,
        relevance REAL DEFAULT 0.0,
        completeness REAL DEFAULT 0.0,
        communication REAL DEFAULT 0.0,
        confidence REAL DEFAULT 0.0,
        strong_points TEXT,
        improve TEXT,
        missing TEXT,
        model_answer TEXT,
        follow_up_prompt TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(interview_id) REFERENCES interviews(id)
    )
    ''')

    # Resumes Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS resumes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        filename TEXT NOT NULL,
        file_path TEXT,
        extracted_text TEXT,
        score INTEGER DEFAULT 78,
        breakdown_json TEXT,
        extracted_skills_json TEXT,
        target_questions_json TEXT,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    ''')

    # Coding Problems Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS coding_problems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        difficulty TEXT DEFAULT 'Easy', -- Easy, Medium, Hard
        category TEXT DEFAULT 'Data Structures',
        starter_code_json TEXT NOT NULL, -- {"python": "...", "javascript": "...", "java": "..."}
        test_cases_json TEXT NOT NULL -- [{"input": "...", "output": "..."}]
    )
    ''')

    # Coding Submissions Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS coding_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        problem_id INTEGER NOT NULL,
        code TEXT NOT NULL,
        language TEXT NOT NULL,
        status TEXT NOT NULL, -- Passed, Failed
        passed_count INTEGER DEFAULT 0,
        total_count INTEGER DEFAULT 0,
        runtime_ms INTEGER DEFAULT 45,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(problem_id) REFERENCES coding_problems(id)
    )
    ''')

    # Achievements Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        badge_id TEXT NOT NULL,
        badge_name TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT NOT NULL,
        earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    ''')

    # Aptitude Tests Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS aptitude_tests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL, -- Quantitative, Logical Reasoning, Verbal, Data Interpretation
        duration_mins INTEGER DEFAULT 15,
        questions_json TEXT NOT NULL
    )
    ''')

    # Question Bank Library Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS question_bank (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_role TEXT NOT NULL,
        category TEXT NOT NULL,
        topic TEXT NOT NULL,
        difficulty TEXT DEFAULT 'Medium',
        question TEXT NOT NULL,
        answer_guide TEXT NOT NULL,
        is_frequent INTEGER DEFAULT 1,
        bookmarked INTEGER DEFAULT 0
    )
    ''')

    conn.commit()
    seed_initial_data(conn)
    conn.close()

def seed_initial_data(conn):
    cursor = conn.cursor()

    # Check if seed data exists
    cursor.execute("SELECT COUNT(*) FROM coding_problems")
    if cursor.fetchone()[0] == 0:
        # Seed Coding Problems
        problems = [
            (
                "Reverse a String",
                "Write a function that takes a string as input and returns the string reversed without using built-in reverse functions.",
                "Easy",
                "Strings",
                json.dumps({
                    "python": "def reverse_string(s):\n    # Write your solution here\n    result = ''\n    for char in s:\n        result = char + result\n    return result\n",
                    "javascript": "function reverseString(s) {\n  // Write your solution here\n  let result = '';\n  for (let i = s.length - 1; i >= 0; i--) {\n    result += s[i];\n  }\n  return result;\n}\n",
                    "java": "public class Solution {\n    public static String reverseString(String s) {\n        StringBuilder sb = new StringBuilder(s);\n        return sb.reverse().toString();\n    }\n}\n",
                    "cpp": "#include <string>\n#include <algorithm>\nstd::string reverseString(std::string s) {\n    std::reverse(s.begin(), s.end());\n    return s;\n}\n",
                    "c": "#include <string.h>\nvoid reverseString(char* s) {\n    int n = strlen(s);\n    for(int i=0; i<n/2; i++){\n        char t = s[i]; s[i] = s[n-1-i]; s[n-1-i] = t;\n    }\n}\n"
                }),
                json.dumps([
                    {"input": "'hello'", "output": "'olleh'"},
                    {"input": "'MockMate'", "output": "'etaMockM'"},
                    {"input": "'a'", "output": "'a'"}
                ])
            ),
            (
                "Two Sum",
                "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
                "Easy",
                "Arrays & Hash Maps",
                json.dumps({
                    "python": "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []\n",
                    "javascript": "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}\n",
                    "java": "import java.util.HashMap;\npublic class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        HashMap<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int diff = target - nums[i];\n            if (map.containsKey(diff)) return new int[]{map.get(diff), i};\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}\n",
                    "cpp": "#include <vector>\n#include <unordered_map>\nstd::vector<int> twoSum(std::vector<int>& nums, int target) {\n    std::unordered_map<int, int> m;\n    for(int i=0; i<nums.size(); i++) {\n        if(m.count(target - nums[i])) return {m[target - nums[i]], i};\n        m[nums[i]] = i;\n    }\n    return {};\n}\n",
                    "c": "// C Implementation for Two Sum\n"
                }),
                json.dumps([
                    {"input": "nums = [2,7,11,15], target = 9", "output": "[0, 1]"},
                    {"input": "nums = [3,2,4], target = 6", "output": "[1, 2]"},
                    {"input": "nums = [3,3], target = 6", "output": "[0, 1]"}
                ])
            ),
            (
                "Valid Parentheses",
                "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
                "Medium",
                "Stacks & Strings",
                json.dumps({
                    "python": "def is_valid(s):\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack\n",
                    "javascript": "function isValid(s) {\n  const stack = [];\n  const pairs = { ')': '(', '}': '{', ']': '[' };\n  for (let c of s) {\n    if (pairs[c]) {\n      if (stack.pop() !== pairs[c]) return false;\n    } else {\n      stack.push(c);\n    }\n  }\n  return stack.length === 0;\n}\n",
                    "java": "// Java Solution\n",
                    "cpp": "// C++ Solution\n",
                    "c": "// C Solution\n"
                }),
                json.dumps([
                    {"input": "'()'", "output": "True"},
                    {"input": "'()[]{}'", "output": "True"},
                    {"input": "'(]' ", "output": "False"}
                ])
            )
        ]
        cursor.executemany(
            "INSERT INTO coding_problems (title, description, difficulty, category, starter_code_json, test_cases_json) VALUES (?, ?, ?, ?, ?, ?)",
            problems
        )

    # Check Aptitude Tests
    cursor.execute("SELECT COUNT(*) FROM aptitude_tests")
    if cursor.fetchone()[0] == 0:
        tests = [
            (
                "Quantitative Aptitude Challenge",
                "Quantitative",
                15,
                json.dumps([
                    {
                        "id": 1,
                        "question": "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
                        "options": ["120 metres", "180 metres", "324 metres", "150 metres"],
                        "answer": 3
                    },
                    {
                        "id": 2,
                        "question": "The cost price of 20 articles is the same as the selling price of x articles. If the profit is 25%, then the value of x is:",
                        "options": ["15", "16", "18", "25"],
                        "answer": 1
                    },
                    {
                        "id": 3,
                        "question": "A man buys a watch for Rs. 1950 in cash and sells it for Rs. 2200 at a credit of 1 year. If the rate of interest is 10% per annum, the man has:",
                        "options": ["a gain of Rs. 55", "a gain of Rs. 50", "a loss of Rs. 30", "no gain, no loss"],
                        "answer": 1
                    }
                ])
            ),
            (
                "Logical Reasoning Sprint",
                "Logical Reasoning",
                15,
                json.dumps([
                    {
                        "id": 1,
                        "question": "SCD, TEF, UGH, ____, WKL. Which pattern completes the series?",
                        "options": ["CMN", "UJI", "VIJ", "IJT"],
                        "answer": 2
                    },
                    {
                        "id": 2,
                        "question": "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?",
                        "options": ["(1/3)", "(1/8)", "(2/8)", "(1/16)"],
                        "answer": 1
                    }
                ])
            ),
            (
                "Verbal Ability Mastery",
                "Verbal",
                10,
                json.dumps([
                    {
                        "id": 1,
                        "question": "Choose the synonym for 'PERSIMMON':",
                        "options": ["Edible fruit", "Sharp blade", "Vocal song", "Ancient coin"],
                        "answer": 0
                    },
                    {
                        "id": 2,
                        "question": "Find the correctly spelt word:",
                        "options": ["Recommandation", "Recommendation", "Recomendation", "Reccomendation"],
                        "answer": 1
                    }
                ])
            ),
            (
                "Data Interpretation Practice",
                "Data Interpretation",
                15,
                json.dumps([
                    {
                        "id": 1,
                        "question": "If company revenue grew by 15% in Q1 and 20% in Q2 on a base of $100,000, what is total Q2 revenue?",
                        "options": ["$135,000", "$138,000", "$140,000", "$120,000"],
                        "answer": 1
                    }
                ])
            )
        ]
        cursor.executemany(
            "INSERT INTO aptitude_tests (title, category, duration_mins, questions_json) VALUES (?, ?, ?, ?)",
            tests
        )

    # Seed Question Bank
    cursor.execute("SELECT COUNT(*) FROM question_bank")
    if cursor.fetchone()[0] == 0:
        q_bank = [
            ("Software Developer", "Java", "OOP", "Easy", "What is Inheritance in Java?", "Inheritance is a mechanism wherein one class acquires the properties and behaviors of a parent class using the extends keyword.", 1, 0),
            ("Software Developer", "Java", "OOP", "Medium", "Explain polymorphism in Java with practical examples.", "Polymorphism allows objects to take many forms. Compile-time polymorphism is achieved via method overloading, and runtime polymorphism via method overriding.", 1, 1),
            ("Software Developer", "Java", "Collections", "Medium", "What is the difference between HashMap and ConcurrentHashMap?", "HashMap is non-thread-safe and allows one null key. ConcurrentHashMap uses segment locks/CAS operations for thread safety without locking the entire table.", 1, 0),
            ("Software Developer", "Java", "Multithreading", "Hard", "How does Java Memory Model (JMM) handle volatile variables?", "Volatile guarantees visibility of changes to variables across threads and prevents instruction reordering around reads/writes via memory barriers.", 1, 0),
            ("Full Stack Engineer", "Web", "Frontend", "Medium", "Explain Virtual DOM in React.", "Virtual DOM is a lightweight JS representation of real DOM. React computes diffs using a reconciliation algorithm to batch real DOM updates efficiently.", 1, 1),
            ("Data Scientist", "Python", "Data Analysis", "Medium", "Explain the difference between join and merge in Pandas.", "merge is a top-level function that joins DataFrames on column or index criteria. join is an instance method that joins primarily on index keys.", 1, 0),
            ("Software Developer", "System Design", "Architecture", "Hard", "How do you handle database sharding vs replication?", "Replication duplicates data for high availability and read scalability. Sharding partitions data horizontally across nodes for write scalability.", 1, 0)
        ]
        cursor.executemany(
            "INSERT INTO question_bank (job_role, category, topic, difficulty, question, answer_guide, is_frequent, bookmarked) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            q_bank
        )

    conn.commit()

if __name__ == "__main__":
    init_db()
    print("MockMate Database Initialized Successfully!")
