# VisionCode — Android starter project

A starter Android app that lets a user upload a screenshot/image or a short video, sends it to a private backend for AI analysis, and displays generated HTML/CSS/JavaScript in a live preview.

## What is included
- Native Android shell (Kotlin + WebView)
- Responsive dark-mode interface
- Image and video upload
- Live website preview
- HTML/CSS/JS output tabs and copy buttons
- FastAPI backend scaffold
- Video frame sampling with FFmpeg
- ZIP export of generated website files

## Important: API key and hosting
The Android app must **not** contain an AI provider API key. Run the backend on a server you control and set `OPENAI_API_KEY` there. The app calls your backend URL.

The backend uses an OpenAI-compatible Chat Completions endpoint by default. You can change `OPENAI_MODEL` and `OPENAI_BASE_URL` in the server environment if needed.

## Run the backend
Requirements: Python 3.10+, FFmpeg installed and available on PATH.

```bash
cd backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux:
source .venv/bin/activate
pip install -r requirements.txt
```

Set environment variables:
```bash
# macOS/Linux
export OPENAI_API_KEY="your_api_key"
export OPENAI_MODEL="gpt-4.1-mini"
export APP_CORS_ORIGINS="*"
uvicorn main:app --host 0.0.0.0 --port 8000
```

For production, restrict CORS, add authentication/rate limits, HTTPS, upload limits, and a privacy policy. Do not expose this development server directly to the public internet.

## Connect Android to backend
Edit `app/src/main/assets/config.js` and set `API_BASE_URL` to your backend's HTTPS address, for example:
```js
window.APP_CONFIG = { API_BASE_URL: "https://your-domain.example" };
```

For local Android emulator testing, use `http://10.0.2.2:8000`. A physical phone needs your computer/server LAN IP or a public HTTPS domain.

## Build the APK
1. Open this folder in Android Studio.
2. Let Gradle sync and install the Android SDK if prompted.
3. Set the backend URL in `config.js`.
4. Choose **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
5. Android Studio will show the generated APK location.

This environment provides the complete starter source project, but does not have the Android SDK/Gradle build toolchain installed, so it cannot produce a verified APK binary here.

## Current prototype limits
- Video is sampled at up to 6 frames; it does not recreate every frame or guarantee pixel-perfect conversion.
- Generated code is a best-effort visual approximation. Complex interactions, backend logic, and responsive behavior may need manual refinement.
- Generated HTML is previewed in a sandboxed iframe. Treat AI-generated code as untrusted.
