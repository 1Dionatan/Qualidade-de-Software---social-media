import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          background: "var(--primary)",
          color: "white",
          border: "none",
        };
      case "secondary":
        return {
          background: "var(--secondary)",
          color: "white",
          border: "none",
        };
      case "outline":
        return {
          background: "transparent",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
        };
      default:
        return {};
    }
  };

  const getHoverColor = () => {
    switch (variant) {
      case "primary":
        return "var(--primary-hover)";
      case "secondary":
        return "var(--secondary-hover)";
      case "outline":
        return "var(--card-hover)";
      default:
        return "";
    }
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      style={{
        ...getVariantStyles(),
        padding: "0.75rem 1.5rem",
        borderRadius: "0.375rem",
        cursor: disabled || isLoading ? "not-allowed" : "pointer",
        fontWeight: "500",
        fontSize: "1rem",
        transition: "all 0.2s",
        opacity: disabled || isLoading ? 0.7 : 1,
        ...props.style,
      }}
      onMouseOver={(e) => {
        if (!disabled && !isLoading && variant !== "outline") {
          e.currentTarget.style.background = getHoverColor();
        } else if (!disabled && !isLoading && variant === "outline") {
          e.currentTarget.style.background = getHoverColor();
        }
      }}
      onMouseOut={(e) => {
        const background = getVariantStyles().background ?? "";
        if (variant !== "outline" && background) {
          e.currentTarget.style.background = background;
        } else {
          e.currentTarget.style.background = "transparent";
        }
      }}
    >
      {isLoading ? "Carregando..." : children}
    </button>
  );
}
