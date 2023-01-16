import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button = ({ children, className, ...btnProps }: ButtonProps) => {
  return (
    <button
      className={`w-fit bg-primary px-3.5 py-2 text-xs font-semibold text-white transition-opacity focus:outline-none enabled:hover:bg-opacity-80 enabled:active:bg-opacity-90 disabled:cursor-not-allowed md:text-sm ${className}`}
      {...btnProps}
    >
      {children}
    </button>
  );
};

export default Button;
