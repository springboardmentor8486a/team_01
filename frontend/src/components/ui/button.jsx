import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import "./button.css";

const Button = React.forwardRef(({ className = "", variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  const variantClass = `button ${variant} size-${size}`;
  return (
    <Comp
      className={`${variantClass} ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };
