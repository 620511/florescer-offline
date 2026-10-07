import { useEffect, useRef, useState } from "react";
import Today from "./components/Today.jsx";
import Medications from "./components/Medications.jsx";
import Consultations from "./components/Consultations.jsx";
import { Button, Card } from "./components/ui.jsx";
import { Clock, Pill, Stethoscope, Flower2, ShieldCheck, Download, Upload } from "lucide-react";

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
  const [mostrarBackup, setMostrarBackup] = useState(false);
  const [pendente, setPendente] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const inputArquivo = useRef(null);

  useEffect(() => salvarLocal(KEYS.medications, medications), [medications]);
  useEffect(() => salvarLocal(KEYS.logs, logs), [logs]);
  useEffect(() => salvarLocal(KEYS.consultations, consultations), [consultations]);

  // Pede ao Android para NÃO apagar os dados do app automaticamente
  useEffect(() => {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(() => {});
    }
  }, []);

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

  function baixarBackup() {
    const dados = {
      app: "florescer",
      versao: 1,
      exportadoEm: new Date().toISOString(),
      medications,
      logs,
      consultations,
    };
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `florescer-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMensagem("Backup salvo na pasta Downloads do celular.");
  }

  function lerArquivoBackup(e) {
    const arquivo = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = () => {
      try {
        const dados = JSON.parse(leitor.result);
        if (
          dados.app !== "florescer" ||
          !Array.isArray(dados.medications) ||
          !Array.isArray(dados.logs) ||
          !Array.isArray(dados.consultations)
        ) {
          throw new Error("formato inválido");
        }
        setPendente(dados);
        setMensagem("");
      } catch {
        setPendente(null);
        setMensagem("Esse arquivo não é um backup do Florescer.");
      }
    };
    leitor.readAsText(arquivo);
  }

  function confirmarRestauracao() {
    setMedications(pendente.medications);
    setLogs(pendente.logs);
    setConsultations(pendente.consultations);
    setPendente(null);
    setMensagem("Backup restaurado com sucesso.");
  }

  const hoje = new Date();

  return (
    <div style={{ minHeight: "100vh", padding: "24px 16px 48px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <header
          style={{
            marginBottom: 22,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Flower2 size={20} color="var(--pink-deep)" />
              <h1 style={{ fontSize: 24, margin: 0, color: "var(--pink-deep)" }}>Florescer</h1>
            </div>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: "4px 0 0" }}>
              {hoje.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <button
            onClick={() => {
              setMostrarBackup((v) => !v);
              setMensagem("");
              setPendente(null);
            }}
            title="Backup dos dados"
            style={{
              border: "1px solid var(--border)",
              background: mostrarBackup ? "var(--pink-pale)" : "var(--surface)",
              color: "var(--pink-deep)",
              cursor: "pointer",
              padding: 9,
              borderRadius: 12,
              display: "flex",
            }}
          >
            <ShieldCheck size={18} />
          </button>
        </header>

        {mostrarBackup && (
          <Card style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 600, fontSize: 15.5, fontFamily: "Playfair Display, serif" }}>
              Backup dos dados
            </div>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: "6px 0 14px", lineHeight: 1.5 }}>
              Seus dados ficam só neste celular. Salve um backup de vez em quando: se trocar de
              aparelho ou limpar os dados do navegador, é só restaurar o arquivo.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Button onClick={baixarBackup}>
                <Download size={15} /> Salvar backup
              </Button>
              <Button variant="outline" onClick={() => inputArquivo.current && inputArquivo.current.click()}>
                <Upload size={15} /> Restaurar backup
              </Button>
              <input
                ref={inputArquivo}
                type="file"
                accept=".json,application/json"
                onChange={lerArquivoBackup}
                style={{ display: "none" }}
              />
            </div>
            {pendente && (
              <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: "var(--pink-pale)" }}>
                <div style={{ fontSize: 13.5, marginBottom: 10 }}>
                  Este backup tem {pendente.medications.length} medicamento(s) e{" "}
                  {pendente.consultations.length} consulta(s). Substituir os dados atuais?
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button onClick={confirmarRestauracao}>Sim, restaurar</Button>
                  <Button variant="outline" onClick={() => setPendente(null)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
            {mensagem && (
              <p style={{ fontSize: 13, color: "var(--lilac-deep)", margin: "12px 0 0" }}>{mensagem}</p>
            )}
          </Card>
        )}

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
