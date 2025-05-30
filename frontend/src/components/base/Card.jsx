import React from "react";
import { useTheme } from "styled-components";

const Card = ({ children, style }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        background: theme.colors.white,
        borderRadius: theme.borderRadius,
        boxShadow: "0 4px 24px rgba(106,168,57,0.08)",
        padding: 32,
        margin: "32px 0",
        width: "100%",
        maxWidth: "100%",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Card;