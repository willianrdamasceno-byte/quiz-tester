
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 font-bold transition-all duration-300 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-widest text-xs border-2";
  
  const variants = {
    primary: "bg-transparent text-[#00ff41] border-[#00ff41] hover:bg-[#00ff41] hover:text-black hover:shadow-[0_0_20px_rgba(0,255,65,0.6)]",
    secondary: "bg-transparent text-[#bc13fe] border-[#bc13fe] hover:bg-[#bc13fe] hover:text-black hover:shadow-[0_0_20px_rgba(188,19,254,0.6)]",
    outline: "border-[#00ff41]/30 text-[#00ff41]/50 hover:border-[#00ff41] hover:text-[#00ff41] bg-transparent",
    danger: "bg-transparent border-red-500 text-red-500 hover:bg-red-500 hover:text-black hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      <span className="opacity-0 group-hover:opacity-100 transition-opacity">>></span>
      {children}
    </button>
  );
};
