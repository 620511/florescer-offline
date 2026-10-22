import { useState } from "react";
import { Plus, Trash2, Check, AlarmClock } from "lucide-react";
import { Button, Card, inputStyle, labelStyle } from "./ui.jsx";
import { abrirAlarme, parseHorario } from "../alarme.js";

const DIA_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];

function MedForm({ onSave, onCancel, initial }) {
  const [nome, setNome] = useState(initial?.nome || "");
  const [dosagem, setDosagem] = useState(initial?.dosagem || "");
  const [horarios, setHorarios] = useState(initial?.horarios?.join(", ") || "");
  const [dias, setDias] = useState(initial?.dias || [true, true, true, true, true, true, true]);
  const [erro, setErro] = useState("");

  const toggleDia = (i) => {
    const next = [...dias];
    next[i] = !next[i];
    setDias(next);
  };

  const salvar = () => {
    if (!nome.trim()) {
      setErro("Digite o nome do medicamento.");
      return;
    }
    const horariosArr = horarios.split(",").map((h) => h.trim()).filter(Boolean);
    if (horariosArr.length === 0) {
      setErro("Informe pelo menos um horário.");
      return;
    }
    setErro("");
    onSave({
      id: initial?.id,
      nome: nome.trim(),
      dosagem: dosagem.trim(),
      horarios: horariosArr,
      dias,
    });
  };

  return (
    <Card style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label style={labelStyle}>Nome do medicamento</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} style={inputStyle} placeholder="Ex: Losartana" />
        </div>
        <div>
          <label style={labelStyle}>Dosagem</label>
          <input value={dosagem} onChange={(e) => setDosagem(e.target.value)} style={inputStyle} placeholder="Ex: 50mg" />
        </div>
        <div>
          <label style={labelStyle}>Horários (separados por vírgula)</label>
          <input value={horarios} onChange={(e) => setHorarios(e.target.value)} style={inputStyle} placeholder="Ex: 08:00, 20:00" />
        </div>
        <div>
          <label style={labelStyle}>Dias da semana</label>
          <div style={{ display: "flex", gap: 6 }}>
            {DIA_LABELS.map((l, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleDia(i)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: `1px solid ${dias[i] ? "var(--pink)" : "var(--border)"}`,
                  background: dias[i] ? "var(--pink-pale)" : "transparent",
                  color: dias[i] ? "var(--pink-deep)" : "var(--ink-soft)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        {erro && <p style={{ color: "var(--danger)", fontSize: 13, margin: 0 }}>{erro}</p>}
        <div style={{ display: "flex", gap: 8 }}>
          <Button onClick={salvar}>
            <Check size={15} /> Salvar
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function Medications({ medications, onSave, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [aviso, setAviso] = useState(null);

  return (
    <div>
      {!showForm && (
        <Button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          style={{ marginBottom: 14 }}
        >
          <Plus size={15} /> Adicionar medicamento
        </Button>
      )}
      {showForm && (
        <MedForm
          initial={editing}
          onSave={(m) => {
            onSave(m);
            setShowForm(false);
            setEditing(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
      {medications.length === 0 && !showForm && (
        <Card style={{ textAlign: "center", color: "var(--ink-soft)" }}>
          Nenhum medicamento cadastrado ainda.
        </Card>
      )}
      {medications.map((m) => (
        <Card key={m.id} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15.5, fontFamily: "Playfair Display, serif" }}>{m.nome}</div>
              <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                {m.dosagem} · {m.horarios.join(", ")}
              </div>
              <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                {DIA_LABELS.map((l, i) => (
                  <span
                    key={i}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      fontSize: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: m.dias[i] ? "var(--pink-pale)" : "transparent",
                      color: m.dias[i] ? "var(--pink-deep)" : "#D9C4CC",
                      border: m.dias[i] ? "none" : "1px solid var(--border)",
                    }}
                  >
                    {l}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
                {m.horarios.map((h) =>
                  parseHorario(h) ? (
                    <button
                      key={h}
                      onClick={() => {
                        setAviso(null);
                        abrirAlarme({ horario: h, nome: m.nome }, () =>
                          setAviso({ medId: m.id, horario: h, nome: m.nome })
                        );
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "6px 11px",
                        borderRadius: 18,
                        border: "1px solid var(--pink)",
                        background: "transparent",
                        color: "var(--pink-deep)",
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      <AlarmClock size={13} /> Criar alarme {h}
                    </button>
                  ) : null
                )}
              </div>
              {aviso && aviso.medId === m.id && (
                <div
                  style={{
                    marginTop: 12,
                    padding: 12,
                    borderRadius: 12,
                    background: "var(--pink-pale)",
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: "var(--ink)",
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>
                    Não consegui abrir o Relógio sozinho. Faça assim:
                  </div>
                  <div>1. Abra o app <b>Relógio</b> do celular.</div>
                  <div>2. Toque na aba <b>Alarme</b> e depois no <b>+</b>.</div>
                  <div>3. Escolha a hora <b>{aviso.horario}</b>.</div>
                  <div>4. Marque todos os dias e toque em <b>Salvar</b>.</div>
                  <div style={{ marginTop: 8 }}>
                    Ou diga: <i>"Ok Google, criar alarme todos os dias às {aviso.horario} chamado {aviso.nome}"</i>
                  </div>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 2 }}>
              <Button
                variant="ghost"
                onClick={() => {
                  setEditing(m);
                  setShowForm(true);
                }}
              >
                Editar
              </Button>
              {confirmDelete === m.id ? (
                <Button
                  variant="danger"
                  onClick={() => {
                    onDelete(m.id);
                    setConfirmDelete(null);
                  }}
                >
                  Confirmar
                </Button>
              ) : (
                <Button variant="danger" onClick={() => setConfirmDelete(m.id)}>
                  <Trash2 size={15} />
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
