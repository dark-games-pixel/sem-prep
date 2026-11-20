// Backend: keeps per-module rating stats up to date whenever a review is created, edited or deleted.
// Requires the Firebase Blaze plan. The site still works without it (the browser computes averages itself).
const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
initializeApp();

exports.updateModuleStats = onDocumentWritten({ document: "reviews/{rid}", region: "asia-south1" }, async (event) => {
  const after = event.data.after.exists ? event.data.after.data() : null;
  const before = event.data.before.exists ? event.data.before.data() : null;
  const moduleId = (after || before || {}).moduleId;
  if (!["m1", "m2", "m3", "m4", "m5"].includes(moduleId)) return;
  const db = getFirestore();
  const snap = await db.collection("reviews").where("moduleId", "==", moduleId).get();
  let sum = 0; const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  snap.forEach(d => { const r = d.get("rating"); if (r >= 1 && r <= 5) { sum += r; dist[r]++; } });
  const count = snap.size;
  await db.doc(`moduleStats/${moduleId}`).set({ count, sum, avg: count ? sum / count : 0, dist, updatedAt: FieldValue.serverTimestamp() });
});
