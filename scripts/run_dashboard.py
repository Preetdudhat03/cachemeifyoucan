import os
import subprocess
import sys
import time

def main():
    """
    Launches the FastAPI backend and Next.js frontend concurrently for OptionSight AI.
    """
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    backend_dir = os.path.join(project_root, 'backend')
    frontend_dir = os.path.join(project_root, 'frontend')
    
    os.chdir(project_root)
    
    print("🚀 Starting OptionSight AI Platform...")
    
    # 1. Start FastAPI Backend
    print("--> Starting Python API Backend (FastAPI on port 8000)...")
    backend_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.main:app", "--reload", "--reload-dir", "backend", "--reload-dir", "src", "--port", "8000"],
        cwd=project_root
    )
    
    # Give backend a moment to initialize
    time.sleep(2)
    
    # 2. Start Next.js Frontend
    print("--> Starting Next.js Web Frontend (Port 3000)...")
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=frontend_dir,
        shell=True # needed for npm on windows
    )
    
    try:
        # Keep main process alive
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\nStopping OptionSight AI...")
        backend_process.terminate()
        frontend_process.terminate()
        sys.exit(0)

if __name__ == "__main__":
    main()
