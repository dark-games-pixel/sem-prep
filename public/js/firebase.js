// Firebase layer: Google Auth gate + Firestore (progress, quiz attempts, module reviews).
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, addDoc, deleteDoc, collection, query, where, orderBy, limit, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const gate = document.getElementById("gate");
const gateMsg = document.getElementById("gate-msg");
if (!firebaseConfig || !firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith("PASTE")) {
  gateMsg.innerHTML = "Firebase is not configured yet. Paste your web-app config into <code>public/js/firebase-config.js</code> (see README).";
}
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

document.getElementById("google-btn").addEventListener("click", async () => {
  gateMsg.textContent = "Opening Google sign-in…";
  try { await signInWithPopup(auth, provider); }
  catch (e) {
    if (e.code === "auth/popup-blocked" || e.code === "auth/operation-not-supported-in-this-environment") return signInWithRedirect(auth, provider);
    gateMsg.textContent = e.code === "auth/unauthorized-domain" ? "This domain is not authorised in Firebase → Authentication → Settings → Authorized domains." : "Sign-in failed: " + (e.message || e.code);
  }
});

const MODULES = ["m1", "m2", "m3", "m4", "m5"];
let profile = null;

window.DB = {
  user: () => auth.currentUser,
  profile: () => profile,
  signOut: () => signOut(auth),
  async setDone(moduleId, value) {
    profile.done = { ...(profile.done || {}), [moduleId]: !!value };
    await setDoc(doc(db, "users", auth.currentUser.uid), { done: profile.done, lastSeen: serverTimestamp() }, { merge: true });
  },
  async saveQuiz(module, score, total) {
    const pct = Math.round(score / total * 100);
    await addDoc(collection(db, "quizAttempts"), { uid: auth.currentUser.uid, module, score, total, pct, at: serverTimestamp() });
    const upd = { attempts: (profile.attempts || 0) + 1, lastSeen: serverTimestamp() };
    if (module === 0 && total >= 100 && pct > (profile.best || 0)) { upd.best = pct; profile.best = pct; }
    profile.attempts = upd.attempts;
    await setDoc(doc(db, "users", auth.currentUser.uid), upd, { merge: true });
    return pct;
  },
  async myAttempts() {
    const q = query(collection(db, "quizAttempts"), where("uid", "==", auth.currentUser.uid), orderBy("at", "desc"), limit(10));
    return (await getDocs(q)).docs.map(d => d.data());
  },
  async myReview(moduleId) {
    const s = await getDoc(doc(db, "reviews", `${moduleId}_${auth.currentUser.uid}`));
    return s.exists() ? s.data() : null;
  },
  async saveReview(moduleId, rating, text, helpful) {
    if (!MODULES.includes(moduleId)) throw new Error("bad module");
    const u = auth.currentUser; const ref = doc(db, "reviews", `${moduleId}_${u.uid}`);
    const old = await getDoc(ref);
    await setDoc(ref, { moduleId, uid: u.uid, name: (u.displayName || "Student").slice(0, 60), photo: u.photoURL || "", rating, text: text.slice(0, 600), helpful: helpful.slice(0, 5),
      createdAt: old.exists() ? old.data().createdAt : serverTimestamp(), updatedAt: serverTimestamp() });
  },
  async deleteReview(moduleId) { await deleteDoc(doc(db, "reviews", `${moduleId}_${auth.currentUser.uid}`)); },
  async reviews(moduleId) {
    const q = query(collection(db, "reviews"), where("moduleId", "==", moduleId), orderBy("updatedAt", "desc"), limit(50));
    const list = (await getDocs(q)).docs.map(d => d.data());
    let stats = null;
    try { const s = await getDoc(doc(db, "moduleStats", moduleId)); if (s.exists()) stats = s.data(); } catch (e) {}
    if (!stats) { const n = list.length; stats = { count: n, avg: n ? list.reduce((a, r) => a + r.rating, 0) / n : 0 }; }
    return { list, stats };
  }
};

onAuthStateChanged(auth, async user => {
  if (!user) { document.body.classList.remove("authed"); gate.hidden = false; if (!gateMsg.innerHTML.includes("not configured")) gateMsg.textContent = ""; return; }
  gateMsg.textContent = "Loading your progress…";
  const ref = doc(db, "users", user.uid);
  try {
    const snap = await getDoc(ref);
    profile = snap.exists() ? snap.data() : { done: {}, best: 0, attempts: 0 };
    await setDoc(ref, { name: user.displayName || "", email: user.email || "", photo: user.photoURL || "", lastSeen: serverTimestamp(), ...(snap.exists() ? {} : { createdAt: serverTimestamp(), done: {}, best: 0, attempts: 0 }) }, { merge: true });
  } catch (e) {
    console.error(e); profile = { done: {}, best: 0, attempts: 0 };
    gateMsg.textContent = "Signed in, but Firestore is not reachable (check rules/deploy). Progress will not be saved.";
  }
  gate.hidden = true; document.body.classList.add("authed");
  window.startApp && window.startApp();
});
