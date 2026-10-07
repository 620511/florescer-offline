import { Check, Clock } from "lucide-react";
import { Card } from "./ui.jsx";

const todayKey = (d = new Date()) => d.toISOString().slice(0, 10);

export default function Today({ medications, logs, onToggle }) {
  const hoje = new Date();
  const diaSemana = hoje.getDay();
  const hojeKey = todayKey(hoje);

  const medsHoje = medications.filter((m) => m.dias[diaSemana]);

  const foiTomado = (medId, horario) =>
    !!logs.find((l) => l.medication_id === medId && l.data === hojeKey && l.horario === horario)?.tomado;

  if (medsHoje.length === 0) {
    return (
      <Card style={{ textAlign: "center", color: "var(--ink-soft)" }}>
        Nenhum medicamento programado para hoje.
      </Card>
    );
  }

  return (
    <div>
      {medsHoje.map((m) => (
        <Card key={m.id} style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 15.5, fontFamily: "Playfair Display, serif" }}>{m.nome}</div>
          {m.dosagem && (
            <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 10 }}>{m.dosagem}</div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
            {m.horarios.map((h) => {
              const tomado = foiTomado(m.id, h);
              return (
                <button
                  key={h}
                  onClick={() => onToggle(m.id, hojeKey, h, !tomado)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 14px",
                    borderRadius: 20,
                    border: `1px solid ${tomado ? "var(--pink)" : "var(--border)"}`,
                    background: tomado ? "var(--pink-pale)" : "#fff",
                    color: tomado ? "var(--pink-deep)" : "var(--ink-soft)",
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {tomado ? <Check size={14} /> : <Clock size={14} />}
                  {h}
                </button>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}
