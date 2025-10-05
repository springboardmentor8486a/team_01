import * as React from "react";

import "./badge.css";

function Badge({ className = "", variant = "default", ...props }) {
  const variantClass = `badge ${variant}`;
  return <div className={`${variantClass} ${className}`} {...props} />;
}

export { Badge };
