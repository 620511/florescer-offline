import { useState } from "react";
import { Plus, Trash2, Check, Calendar } from "lucide-react";
import { Button, Card, inputStyle, labelStyle } from "./ui.jsx";

const todayKey = (d = new Date()) => d.toISOString().slice(0, 10);
const fmtDate = (iso) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

function ConsultaForm({ onSave, onCancel, initial }) {
  const [data, setData] = useState(initial?.data || todayKey());
  const [hora, setHora] = useState(initial?.hora?.slice(0, 5) || "09:00");
  const [medico, setMedico] = useState(initial?.medico || "");
  const [especialidade, setEspecialidade] = useState(initial?.especialidade || "");
  const [local, setLocal] = useState(initial?.local || "");
  const [notas, setNotas] = useState(initial?.notas || "");
  const [erro, setErro] = useState("");

  const salvar = () => {
    if (!medico.trim() && !especialidade.trim()) {
      setErro("Informe pelo menos o médico ou a especialidade.");
      return;
    }
    setErro("");
    onSave({
      id: initial?.id,
      data,
      hora,
      medico: medico.trim(),
      especialidade: especialidade.trim(),
      local: local.trim(),
      notas: notas.trim(),
    });
  };

  return (
    <Card style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Data</label>
            <input type="date" value={data} onChange={(e) => setData(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Hora</label>
            <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Médico(a)</label>
          <input value={medico} onChange={(e) => setMedico(e.target.value)} style={inputStyle} placeholder="Dra. Ana Souza" />
        </div>
        <div>
          <label style={labelStyle}>Especialidade</label>
          <input value={especialidade} onChange={(e) => setEspecialidade(e.target.value)} style={inputStyle} placeholder="Cardiologia" />
        </div>
        <div>
          <label style={labelStyle}>Local / clínica</label>
          <input value={local} onChange={(e) => setLocal(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Observações</label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            style={{ ...inputStyle, minHeight: 64, resize: "vertical" }}
          />
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

export default function Consultations({ consultations, onSave, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const hojeKey = todayKey();
  const ordenadas = [...consultations].sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
  const proxima = ordenadas.find((c) => c.data >= hojeKey);

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
          <Plus size={15} /> Adicionar consulta
        </Button>
      )}
      {showForm && (
        <ConsultaForm
          initial={editing}
          onSave={(c) => {
            onSave(c);
            setShowForm(false);
            setEditing(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
      {proxima && !showForm && (
        <Card
          style={{
            marginBottom: 14,
            border: "1px solid var(--pink)",
            background: "linear-gradient(135deg, var(--pink-pale), var(--lilac))",
          }}
        >
          <div style={{ fontSize: 11.5, color: "var(--pink-deep)", fontWeight: 700, letterSpacing: 0.4, marginBottom: 4 }}>
            PRÓXIMA CONSULTA
          </div>
          <div style={{ fontWeight: 600, fontSize: 16, fontFamily: "Playfair Display, serif" }}>
            {proxima.especialidade || proxima.medico}
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
            {fmtDate(proxima.data)} às {proxima.hora?.slice(0, 5)}
            {proxima.local ? ` · ${proxima.local}` : ""}
          </div>
        </Card>
      )}
      {ordenadas.length === 0 && !showForm && (
        <Card style={{ textAlign: "center", color: "var(--ink-soft)" }}>
          Nenhuma consulta cadastrada ainda.
        </Card>
      )}
      {ordenadas.map((c) => {
        const passada = c.data < hojeKey;
        return (
          <Card key={c.id} style={{ marginBottom: 12, opacity: passada ? 0.55 : 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 3 }}>
                  <Calendar size={13} />
                  {fmtDate(c.data)} · {c.hora?.slice(0, 5)}
                </div>
                <div style={{ fontWeight: 600, fontSize: 15.5, fontFamily: "Playfair Display, serif" }}>
                  {c.medico || c.especialidade}
                </div>
                {c.medico && c.especialidade && (
                  <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>{c.especialidade}</div>
                )}
                {c.local && <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>{c.local}</div>}
                {c.notas && (
                  <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4, fontStyle: "italic" }}>
                    {c.notas}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 2 }}>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditing(c);
                    setShowForm(true);
                  }}
                >
                  Editar
                </Button>
                {confirmDelete === c.id ? (
                  <Button
                    variant="danger"
                    onClick={() => {
                      onDelete(c.id);
                      setConfirmDelete(null);
                    }}
                  >
                    Confirmar
                  </Button>
                ) : (
                  <Button variant="danger" onClick={() => setConfirmDelete(c.id)}>
                    <Trash2 size={15} />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
