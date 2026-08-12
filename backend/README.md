# MockMate Backend

This backend provides the Flask API for MockMate and stores data in a local SQLite database.

## Local setup

1. Open PowerShell and navigate to the backend folder:
   ```powershell
   cd e:\mockmate\backend
   ```
2. Activate the Python virtual environment:
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```
3. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
4. Initialize or recreate the database:
   ```powershell
   python database.py
   ```
5. Start the backend server:
   ```powershell
   python app.py
   ```
6. Verify the health endpoint:
   ```powershell
   curl http://127.0.0.1:5000/api/health
   ```

## Database

- The SQLite database file is stored at `../database/mockmate.db` relative to the backend folder.
- The backend creates the database and schema automatically on startup if needed.
- To reset the local data, remove `../database/mockmate.db` and restart the backend.

## Environment variables

- `GEMINI_API_KEY` — optional API key for higher-quality AI responses.
- `PORT` — optional port override for the backend server (default is `5000`).

## Frontend local development

From the frontend folder:
```powershell
cd ..\frontend
npm install
npm run dev
```

The frontend is configured to proxy `/api` requests to the backend during development.
