interface Props {
  title: string
  value: React.ReactNode
  subtitle?: string
  icon?: React.ReactNode
  color?: string
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = "text-indigo-600"
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition flex justify-between items-center">
      
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className={`text-3xl font-bold mt-2 ${color}`}>
          {value}
        </h2>

        {subtitle && (
          <p className="text-xs text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {icon && (
        <div className="bg-gray-100 p-3 rounded-lg">
          {icon}
        </div>
      )}

    </div>
  )
}
