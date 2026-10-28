import React from "react";

interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function TextButton({ children, ...props }: TextButtonProps) {
  return (
    <button
      {...props}
      style={{
        background: "none",
        border: "none",
        color: "var(--primary)",
        cursor: "pointer",
        textDecoration: "underline",
        fontSize: "inherit",
        ...props.style,
      }}
    >
      {children}
    </button>
  );
}

