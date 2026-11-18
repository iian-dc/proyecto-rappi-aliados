// Cloud Function - DoloYa Notificaciones Opcion A
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const {getMessaging} = require("firebase-admin/messaging");

initializeApp();
const db = getFirestore();

exports.enviarNotificacionDoloYa = onDocumentCreated("notificaciones_envios/{envioId}", async (event) => {
  const data = event.data.data();
  const envioRef = event.data.ref;
  if (data.estado !== "pendiente") return null;
  const ids = data.ids || [];
  if (ids.length === 0) {
    await envioRef.update({estado: "sin_clientes"});
    return null;
  }
  const tokens = [];
  for (let i = 0; i < ids.length; i += 10) {
    const lote = ids.slice(i, i + 10);
    const snap = await db.collection("notificaciones_clientes").where("__name__", "in", lote).get();
    snap.forEach((d) => {
      const t = d.data().fcmToken || d.data().tokenNotificacion;
      if (t) tokens.push(t);
    });
  }
  if (tokens.length === 0) {
    await envioRef.update({estado: "sin_tokens", tokensEncontrados: 0});
    return null;
  }
  const message = {
    notification: {
      title: data.titulo || "DoloYa",
      body: data.mensaje || "",
      image: data.imagen || undefined,
    },
    tokens: [...new Set(tokens)],
  };
  const resp = await getMessaging().sendEachForMulticast(message);
  await envioRef.update({estado: "enviado", tokensEncontrados: tokens.length, enviados: resp.successCount, fallidos: resp.failureCount});
  return null;
});
