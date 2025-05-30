import React from "react";
import { useTheme } from "styled-components";

const Button = ({ children, style, ...props }) => {
  const theme = useTheme();
  return (
    <button
      style={{
        background: theme.colors.primary,
        color: "#fff",
        border: "none",
        borderRadius: 8,
        padding: "12px 24px",
        fontWeight: 600,
        fontSize: 16,
        cursor: "pointer",
        marginBottom: 8,
        transition: "background 0.2s",
        ...style
      }}
      onMouseOver={e => e.currentTarget.style.background = "#5a9831"}
      onMouseOut={e => e.currentTarget.style.background = theme.colors.primary}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;