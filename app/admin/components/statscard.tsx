interface Props {
  title: string
  value: React.ReactNode
  subtitle?: string
  icon?: React.ReactNode
  color?: string
  valueColor?: string
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = "text-cyan-300",
  valueColor
}: Props) {
  return (
    <div className="
      bg-[#1a2f6d]/85
      backdrop-blur-xl
      border border-cyan-300/20
      rounded-xl
      shadow-lg
      p-6
      transition
      flex justify-between items-center
    ">
      
      <div>
        {/* TITLE */}
        <p className="text-blue-100/90 text-sm tracking-wide font-medium">
          {title}
        </p>

        {/* VALUE */}
        <h2 className={`text-3xl font-bold mt-2 ${valueColor ?? color}`}>
          {value}
        </h2>

        {/* SUBTITLE */}
        {subtitle && (
          <p className="text-sm text-blue-200/80 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* ICON */}
      {icon && (
        <div className="
          bg-[#243b74]
          border border-cyan-300/15
          p-3
          rounded-lg
        ">
          {icon}
        </div>
      )}

    </div>
  )
}