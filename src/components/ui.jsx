export function Button({ children, variant = "primary", style, ...props }) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "10px 16px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    border: "1px solid transparent",
    cursor: "pointer",
    transition: "transform 0.1s, opacity 0.15s",
  };
  const variants = {
    primary: { background: "var(--pink-deep)", color: "#fff" },
    outline: { background: "transparent", color: "var(--pink-deep)", border: "1px solid var(--pink)" },
    ghost: { background: "transparent", color: "var(--ink-soft)", padding: "6px 8px", fontWeight: 500 },
    danger: { background: "transparent", color: "var(--danger)", padding: "6px 8px", fontWeight: 500 },
  };
  return (
    <button style={{ ...base, ...variants[variant], ...style }} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, style }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 18,
        padding: "18px 20px",
        boxShadow: "var(--shadow)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export const inputStyle = {
  width: "100%",
  padding: "10px 13px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  fontSize: 14,
  color: "var(--ink)",
  background: "#FFFCFB",
  boxSizing: "border-box",
  outline: "none",
};

export const labelStyle = {
  display: "block",
  fontSize: 12,
  color: "var(--ink-soft)",
  marginBottom: 6,
  fontWeight: 600,
};
