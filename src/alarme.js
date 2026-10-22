// Tenta abrir o app Relógio do Android com o alarme já preenchido.
// Se o celular não abrir o Relógio, chama aoFalhar() para mostrar o passo a passo manual.

export function parseHorario(texto) {
  const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(String(texto).trim());
  if (!m) return null;
  return { hora: Number(m[1]), minuto: Number(m[2]) };
}

export function abrirAlarme({ horario, nome }, aoFalhar) {
  const t = parseHorario(horario);
  if (!t) {
    aoFalhar();
    return;
  }

  const mensagem = encodeURIComponent(nome);
  const url =
    "intent:#Intent;action=android.intent.action.SET_ALARM;" +
    `i.android.intent.extra.alarm.HOUR=${t.hora};` +
    `i.android.intent.extra.alarm.MINUTES=${t.minuto};` +
    `S.android.intent.extra.alarm.MESSAGE=${mensagem};` +
    "B.android.intent.extra.alarm.SKIP_UI=false;end";

  // Se o Relógio abrir, o Florescer vai para segundo plano (página "hidden").
  let abriu = false;
  const aoMudar = () => {
    if (document.visibilityState === "hidden") abriu = true;
  };
  document.addEventListener("visibilitychange", aoMudar);

  window.location.href = url;

  setTimeout(() => {
    document.removeEventListener("visibilitychange", aoMudar);
    if (!abriu) aoFalhar();
  }, 1800);
}
