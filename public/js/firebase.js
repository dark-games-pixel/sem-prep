// Firebase layer: Google Auth gate + Firestore (progress, quiz attempts, module reviews).
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, addDoc, deleteDoc, collection, query, where, orderBy, limit, getDocs, serverTimestamp, increment } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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
export const ADMIN_EMAILS = ["ha9329187@gmail.com"];
const today = () => new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10); // IST date
const isAdmin = () => !!auth.currentUser && ADMIN_EMAILS.includes((auth.currentUser.email || "").toLowerCase());

// ---- usage tracking: 1 "minute" is counted only while the tab is visible and the user was active recently ----
let lastActivity = Date.now(), beat = null;
["pointerdown", "keydown", "scroll", "touchstart"].forEach(e => addEventListener(e, () => { lastActivity = Date.now(); }, { passive: true }));
function startHeartbeat() {
  if (beat) return;
  beat = setInterval(async () => {
    if (!auth.currentUser || document.visibilityState !== "visible" || Date.now() - lastActivity > 3 * 60e3) return;
    const uid = auth.currentUser.uid, d = today();
    try {
      await setDoc(doc(db, "users", uid), { minutes: increment(1), lastSeen: serverTimestamp() }, { merge: true });
      await setDoc(doc(db, "daily", `${d}_${uid}`), { uid, date: d, minutes: increment(1), at: serverTimestamp() }, { merge: true });
    } catch (e) { /* offline: ignore */ }
  }, 60e3);
}
let profile = null;

window.DB = {
  isAdmin,
  user: () => auth.currentUser,
  async viewModule(moduleId) {
    if (!MODULES.includes(moduleId)) return;
    try { await setDoc(doc(db, "users", auth.currentUser.uid), { moduleViews: { [moduleId]: increment(1) }, lastSeen: serverTimestamp() }, { merge: true }); } catch (e) {}
  },
  async adminData() {
    if (!isAdmin()) throw new Error("Not an admin");
    const since = new Date(Date.now() - 30 * 864e5 + 5.5 * 3600e3).toISOString().slice(0, 10);
    const [u, q, r, d] = await Promise.all([
      getDocs(collection(db, "users")), getDocs(query(collection(db, "quizAttempts"), orderBy("at", "desc"), limit(3000))),
      getDocs(collection(db, "reviews")), getDocs(query(collection(db, "daily"), where("date", ">=", since)))]);
    const rows = s => s.docs.map(x => ({ id: x.id, ...x.data() }));
    return { users: rows(u), attempts: rows(q), reviews: rows(r), daily: rows(d) };
  },
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
    await setDoc(ref, { name: user.displayName || "", email: user.email || "", photo: user.photoURL || "", lastSeen: serverTimestamp(), visits: increment(1), ...(snap.exists() ? {} : { createdAt: serverTimestamp(), done: {}, best: 0, attempts: 0, minutes: 0 }) }, { merge: true });
    await setDoc(doc(db, "daily", `${today()}_${user.uid}`), { uid: user.uid, date: today(), minutes: increment(0), at: serverTimestamp() }, { merge: true });
    startHeartbeat();
  } catch (e) {
    console.error(e); profile = { done: {}, best: 0, attempts: 0 };
    gateMsg.textContent = "Signed in, but Firestore is not reachable (check rules/deploy). Progress will not be saved.";
  }
  gate.hidden = true; document.body.classList.add("authed");
  window.startApp && window.startApp();
});
