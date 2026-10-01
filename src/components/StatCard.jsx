export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  colorScheme = 'blue', // 'blue' | 'orange' | 'red' | 'emerald' | 'amber'
  onClick
}) {
  const schemes = {
    blue: {
      bg: 'bg-white',
      border: 'border-blue-100 hover:border-[#014181]/40',
      iconBg: 'bg-[#014181]/10 text-[#014181]',
      badgeBg: 'bg-blue-50 text-[#014181]'
    },
    orange: {
      bg: 'bg-white',
      border: 'border-orange-100 hover:border-[#FF7401]/40',
      iconBg: 'bg-[#FF7401]/10 text-[#FF7401]',
      badgeBg: 'bg-orange-50 text-[#FF7401]'
    },
    red: {
      bg: 'bg-white',
      border: 'border-rose-100 hover:border-rose-400',
      iconBg: 'bg-rose-50 text-rose-600',
      badgeBg: 'bg-rose-50 text-rose-700'
    },
    emerald: {
      bg: 'bg-white',
      border: 'border-emerald-100 hover:border-emerald-400',
      iconBg: 'bg-emerald-50 text-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-700'
    },
    amber: {
      bg: 'bg-white',
      border: 'border-amber-100 hover:border-amber-400',
      iconBg: 'bg-amber-50 text-amber-600',
      badgeBg: 'bg-amber-50 text-amber-700'
    }
  }

  const current = schemes[colorScheme] || schemes.blue

  return (
    <div
      onClick={onClick}
      className={`${current.bg} p-5 rounded-2xl border ${current.border} shadow-xs hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${current.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </div>
        {subtext && (
          <p className="mt-1 text-xs text-slate-500 font-medium">
            {subtext}
          </p>
        )}
      </div>
    </div>
  )
}
