$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir
$activateScript = Join-Path $ScriptDir 'venv\Scripts\Activate.ps1'
if (Test-Path $activateScript) {
    & $activateScript
} else {
    Write-Error 'Virtual environment not found. Run "pip install -r requirements.txt" first.'
    exit 1
}
python .\app.py
