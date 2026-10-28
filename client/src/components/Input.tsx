import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "500",
            color: "var(--foreground)",
          }}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          width: "100%",
          padding: "0.75rem",
          background: "var(--input-bg)",
          border: `1px solid ${error ? "var(--error)" : "var(--border)"}`,
          borderRadius: "0.375rem",
          color: "var(--foreground)",
          fontSize: "1rem",
          outline: "none",
          transition: "border-color 0.2s",
          ...props.style,
        }}
      />
      {error && (
        <p
          style={{
            marginTop: "0.25rem",
            fontSize: "0.875rem",
            color: "var(--error)",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
