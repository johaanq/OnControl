interface OnControlLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function OnControlLogo({ className = "", size = "md" }: OnControlLogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  }
  
  const imgSizeClasses = {
    sm: "w-9 h-9",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <img 
          src="/favicon.ico" 
          alt="Logo" 
          className={`${imgSizeClasses[size]} object-contain`}
        />
      </div>
      <span className={`font-bold ${sizeClasses[size]}`}>
        <span className="text-accent">ONCO</span>
        <span className="text-primary">NTROL</span>
      </span>
    </div>
  )
}
