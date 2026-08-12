import requests
import json

BASE = 'http://127.0.0.1:5000'

def pretty(resp):
    try:
        return json.dumps(resp.json(), indent=2)
    except Exception:
        return resp.text

email = 'e2e_test_user@example.com'
password = 'E2Epass123'

print('--- Register ---')
res = requests.post(f'{BASE}/api/auth/register', json={
    'name': 'E2E Tester',
    'email': email,
    'password': password,
    'target_role': 'Backend Developer'
})
print('Status:', res.status_code)
print(pretty(res))

user_id = None
if res.status_code == 201:
    user_id = res.json().get('user', {}).get('id')
else:
    # try to login to get user id if already exists
    print('\nAttempting login to obtain user id...')
    l = requests.post(f'{BASE}/api/auth/login', json={'email': email, 'password': password})
    print('Login status:', l.status_code)
    print(pretty(l))
    if l.status_code == 200:
        user_id = l.json().get('user', {}).get('id')

if not user_id:
    print('\nCould not determine user id; exiting.')
    exit(1)

print(f'\nUser id: {user_id}')

print('\n--- Onboarding ---')
onb = requests.post(f'{BASE}/api/auth/onboarding', json={
    'user_id': user_id,
    'target_role': 'Senior Backend Engineer',
    'skills': ['Python','Flask','SQL'],
    'experience_level': 'Mid-Level Engineer (2-5 yrs)',
    'language': 'English'
})
print('Status:', onb.status_code)
print(pretty(onb))

print('\n--- Update profile (PUT) ---')
upd = requests.put(f'{BASE}/api/auth/profile/{user_id}', json={'name': 'E2E Tester Updated', 'language': 'English'})
print('Status:', upd.status_code)
print(pretty(upd))

print('\n--- Fetch profile (GET) ---')
g = requests.get(f'{BASE}/api/auth/profile/{user_id}')
print('Status:', g.status_code)
print(pretty(g))

print('\nE2E test completed.')
