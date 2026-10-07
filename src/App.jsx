import { useEffect, useState } from "react";
import Today from "./components/Today.jsx";
import Medications from "./components/Medications.jsx";
import Consultations from "./components/Consultations.jsx";
import { Clock, Pill, Stethoscope, Flower2 } from "lucide-react";

const KEYS = {
  medications: "florescer_medications",
  logs: "florescer_logs",
  consultations: "florescer_consultations",
};

function lerLocal(chave, padrao) {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? JSON.parse(bruto) : padrao;
  } catch {
    return padrao;
  }
}

function salvarLocal(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch (e) {
    console.error("Não foi possível salvar", chave, e);
  }
}

function gerarId() {
  return (crypto.randomUUID && crypto.randomUUID()) || String(Date.now()) + Math.random();
}

export default function App() {
  const [tab, setTab] = useState("hoje");
  const [medications, setMedications] = useState(() => lerLocal(KEYS.medications, []));
  const [logs, setLogs] = useState(() => lerLocal(KEYS.logs, []));
  const [consultations, setConsultations] = useState(() => lerLocal(KEYS.consultations, []));

  useEffect(() => salvarLocal(KEYS.medications, medications), [medications]);
  useEffect(() => salvarLocal(KEYS.logs, logs), [logs]);
  useEffect(() => salvarLocal(KEYS.consultations, consultations), [consultations]);

  function salvarMedicamento(m) {
    setMedications((prev) => {
      if (m.id) {
        return prev.map((x) => (x.id === m.id ? { ...x, ...m } : x));
      }
      return [...prev, { ...m, id: gerarId() }];
    });
  }

  function excluirMedicamento(id) {
    setMedications((prev) => prev.filter((m) => m.id !== id));
    setLogs((prev) => prev.filter((l) => l.medication_id !== id));
  }

  function alternarTomado(medicationId, data, horario, tomado) {
    setLogs((prev) => {
      const semEsse = prev.filter(
        (l) => !(l.medication_id === medicationId && l.data === data && l.horario === horario)
      );
      return [...semEsse, { medication_id: medicationId, data, horario, tomado }];
    });
  }

  function salvarConsulta(c) {
    setConsultations((prev) => {
      if (c.id) {
        return prev.map((x) => (x.id === c.id ? { ...x, ...c } : x));
      }
      return [...prev, { ...c, id: gerarId() }];
    });
  }

  function excluirConsulta(id) {
    setConsultations((prev) => prev.filter((c) => c.id !== id));
  }

  const hoje = new Date();

  return (
    <div style={{ minHeight: "100vh", padding: "24px 16px 48px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <header style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Flower2 size={20} color="var(--pink-deep)" />
            <h1 style={{ fontSize: 24, margin: 0, color: "var(--pink-deep)" }}>Florescer</h1>
          </div>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: "4px 0 0" }}>
            {hoje.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </header>

        <nav
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 20,
            background: "var(--surface)",
            padding: 5,
            borderRadius: 16,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow)",
          }}
        >
          {[
            { id: "hoje", label: "Hoje", icon: Clock },
            { id: "medicamentos", label: "Remédios", icon: Pill },
            { id: "consultas", label: "Consultas", icon: Stethoscope },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                padding: "9px 4px",
                borderRadius: 12,
                border: "none",
                background: tab === t.id ? "var(--pink-deep)" : "transparent",
                color: tab === t.id ? "#fff" : "var(--ink-soft)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "hoje" && <Today medications={medications} logs={logs} onToggle={alternarTomado} />}
        {tab === "medicamentos" && (
          <Medications medications={medications} onSave={salvarMedicamento} onDelete={excluirMedicamento} />
        )}
        {tab === "consultas" && (
          <Consultations consultations={consultations} onSave={salvarConsulta} onDelete={excluirConsulta} />
        )}
      </div>
    </div>
  );
}
