# Semester 7 prep — Firebase app (AM702C Web Technology + AM701 Neural Networks & Deep Learning)

Frontend: **Firebase Hosting** (static site in `public/`).
Backend: **Firebase Authentication (Google)** + **Cloud Firestore** (progress, quiz history, module reviews, protected by `firestore.rules`) + optional **Cloud Function** (`functions/`) that keeps review averages per module.

Only signed-in users (Google) see the course. The free PDF (`public/AM701_50_Predicted_Questions_with_Answers.pdf`) is linked in the header, home page and Predicted page.

## One-time setup (≈10 minutes)
1. Install tools: `npm i -g firebase-tools` then `firebase login`.
2. Firebase console → **Add project** (e.g. `am701-nndl`).
3. **Build → Authentication → Get started → Sign-in method → Google → Enable** (choose a support email).
4. **Build → Firestore Database → Create database** → Production mode → region `asia-south1` (Mumbai).
5. **Project settings → General → Your apps → Web (</>)** → register app → copy the `firebaseConfig` values into `public/js/firebase-config.js`.
6. Put your project ID in `.firebaserc` (replace `PASTE_PROJECT_ID`).

## Deploy
```bash
cd am701-firebase
firebase deploy --only hosting,firestore        # site + security rules + indexes (works on the free Spark plan)
# optional backend function (needs the Blaze pay-as-you-go plan; free tier covers this easily):
cd functions && npm install && cd .. && firebase deploy --only functions
```
Your site: `https://<project-id>.web.app`. If you add a custom domain, also add it under **Authentication → Settings → Authorized domains**.

Firestore indexes take a few minutes to build after the first deploy; reviews and quiz history load once they are ready.

## Add the YouTube videos
Edit `public/data/extra.js` → `VIDEOS.p01 … p10` → paste each unlisted link into `yt: ""`, then `firebase deploy --only hosting`.

## Data model
| Collection | Doc id | Who can read / write |
|---|---|---|
| `users` | uid | only that user (name, email, photo, `done` map, `best`, `attempts`) |
| `quizAttempts` | auto | user creates own; reads own; immutable |
| `reviews` | `<moduleId>_<uid>` | any signed-in user reads; owner creates/edits/deletes; rating 1–5, text ≤ 600 |
| `moduleStats` | moduleId | signed-in read; written only by the Cloud Function |

## Note on access control
Google sign-in gates the whole interface, and all saved data is protected by Firestore rules. The static course files themselves are still served by Hosting, so someone who knows an exact file URL could download it directly (the PDF is meant to be free anyway). For fully private content you would serve it from Firestore/Storage behind rules.


## Subjects
The app opens on a **subject chooser** (`#/`). Each subject has its own nav and content:

| Subject | Routes | Data |
|---|---|---|
| AM701 Neural Networks | `#/nn`, `#/m1`..`#/m5`, `#/videos`, `#/quiz` | `public/data/*`, `public/js/app.js` |
| AM702C Web Technology | `#/wt`, `#/wt/m1`..`#/wt/m4`, `#/wt/videos`, `#/wt/exam`, `#/wt/quiz`, `#/wt/revise` | `public/webtech/*` (`js/wt.js`, `js/widgets.js` p5.js animations, `wt.css`) |

Web Technology progress is stored in the browser (localStorage); AM701 keeps using Firestore. No Firestore rule change is needed.

## Web Technology: what is where
- Notes (Hinglish, beginner): `public/webtech/data/m1..m4.js`. Quiz: `data/mcq.js` (138 MCQs). Videos list + YouTube links: `data/videos.js`.
- Teacher's suggestion answers (23) and the black-and-white PDF come from one source: `webtech_build/answers_a.py`, `answers_b.py`. Rebuild with `python3 webtech_build/build_pdf.py` (writes the PDF, `data/answers.js`, copies figures). Diagrams: `python3 webtech_build/make_figs.py`.
- Video lessons: scripts in `webtech_build/video/lessons/wNN.js` (scene data, narration in Devanagari + English terms).
  ```bash
  cd webtech_build
  python3 make_video.py all w09 w10 ...     # Sarvam Bulbul v3 voice (cached per line), Chrome frames, CodeMaster audio mix, MP4
  python3 gen_videos.py && python3 posters.py   # refresh data/videos.js and posters
  ```
  MP4s land in `webtech_videos/` (not deployed). Upload to YouTube (unlisted), paste each link into `yt: ""` in `data/videos.js`, then `firebase deploy --only hosting`.
  The voice needs `SARVAM_API_KEY` with credits (read from the CodeMaster `backend/.env`; override the repo path with `CODEMASTER_REPO`).
