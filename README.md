# OptionSight AI - Options Market Analytics Platform

**OptionSight AI** is a complete AI-powered Options Market Analytics Platform that transforms raw derivatives market data into interactive analytics dashboards, intelligent insights, and anomaly detection tools.

## Modern Architecture

*   **`backend/` (FastAPI + Python)**: The high-performance API server. It houses all the core data logic, statistical calculations (Put-Call Ratio, S/R levels), and the `scikit-learn` Isolation Forest anomaly detection model.
*   **`frontend/` (Next.js + React)**: The beautiful, responsive UI built with Tailwind CSS. It asynchronously polls the backend to generate lightning-fast real-time React visual components using `recharts` and `lucide-react`.
*   **`src/`**: Shared core analytics modules leveraged by the backend API.
*   **`data/`**: Stores input datasets.

## Technologies Used

*   **FastAPI & Python** (High-performance API Backend)
*   **Next.js, React, TypeScript** (Modern Web Frontend)
*   **Tailwind CSS** (Styling framework)
*   **Pandas & NumPy** (Data processing)
*   **Scikit-learn** (Anomaly detection using Isolation Forest)
*   **Recharts** (Interactive client-side web charts)

## Initial Setup & Dependencies

1. Clone this repository.
2. Install the Python backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Generate the sample initial data for the backend to ingest:
   ```bash
   python scripts/generate_sample_data.py
   ```
4. Install the Node.js frontend dependencies:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

## Running the Web Platform

You can start the full web platform utilizing our unified runner script. This script boots up both the FastAPI python backend (Port `8000`) and the Next.js react frontend (Port `3000`) concurrently.

```bash
python scripts/run_dashboard.py
```

Once running, navigate your web browser to **`http://localhost:3000`** to view your real-time Options Market Analytics Platform!

## Deployment

For instructions on how to host this project on Render.com, please refer to the [Render Deployment Guide](./deployment_guide.md).
