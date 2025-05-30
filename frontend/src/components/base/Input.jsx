import React from "react";

const Input = ({ style, ...props }) => (
  <input
    style={{
      border: "1px solid #d9cfc2",
      borderRadius: 8,
      padding: "10px 14px",
      marginBottom: 18,
      fontSize: 16,
      width: "100%",
      boxSizing: "border-box",
      outline: "none",
      ...style
    }}
    {...props}
  />
);

export default Input;