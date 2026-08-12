# MockMate

This workspace contains the MockMate AI Cockpit application.

## Structure

- `backend/` — Flask backend API and SQLite database integration.
- `frontend/` — React + Vite frontend application.
- `database/` — persisted local SQLite database file used by the backend.

## Backend Setup

1. Open PowerShell and go to the backend folder:
   ```powershell
   cd e:\mockmate\backend
   ```
2. Activate the Python environment:
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```
3. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
4. Initialize the database:
   ```powershell
   python database.py
   ```
5. Start the backend server:
   ```powershell
   python app.py
   ```

### Shortcut

You can also use the provided helper scripts:
- `backend\start.ps1`
- `backend\start.bat`

## Frontend Setup

1. Open PowerShell and go to the frontend folder:
   ```powershell
   cd e:\mockmate\frontend
   ```
2. Install Node dependencies:
   ```powershell
   npm install
   ```
3. Start development server:
   ```powershell
   npm run dev
   ```

The frontend proxies `/api` requests to `http://127.0.0.1:5000` during local development.

## Local Development Notes

- The backend stores its SQLite database at `database/mockmate.db`.
- The frontend uses `frontend/src/config.js`; it defaults to local API paths in development.
- Set `VITE_API_BASE_URL` for remote deployments if needed.

## Run with Docker (development)

You can run both services in containers for a consistent dev environment. From the workspace root:

```bash
docker compose build
docker compose up
```

This will:
- Build two images (`backend` and `frontend`).
- Mount the local source directories into the containers (hot-reload supported).
- Expose the backend on port `5000` and the frontend on port `5173`.

Notes:
- The backend's SQLite data directory `./database` is mounted into the backend container so DB changes persist on the host.
- The frontend in container will reach the backend at `http://backend:5000` (set `VITE_API_BASE_URL` if you want a different target).
