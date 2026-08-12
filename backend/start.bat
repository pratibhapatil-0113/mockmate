@echo off
cd /d %~dp0
if exist venv\Scripts\activate.bat (
  call venv\Scripts\activate.bat
) else (
  echo Virtual environment not found. Run "pip install -r requirements.txt" first.
  exit /b 1
)
python app.py
