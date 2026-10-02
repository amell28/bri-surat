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
      border: 'border-blue-100/80 hover:border-[#014181]/50',
      iconBg: 'bg-[#014181]/10 text-[#014181] group-hover:bg-[#014181] group-hover:text-white',
      badgeBg: 'bg-blue-50 text-[#014181]',
      glowShadow: 'hover:shadow-blue-500/10',
      accentBar: 'bg-[#014181]'
    },
    orange: {
      bg: 'bg-white',
      border: 'border-orange-100/80 hover:border-[#FF7401]/50',
      iconBg: 'bg-[#FF7401]/10 text-[#FF7401] group-hover:bg-[#FF7401] group-hover:text-white',
      badgeBg: 'bg-orange-50 text-[#FF7401]',
      glowShadow: 'hover:shadow-orange-500/10',
      accentBar: 'bg-[#FF7401]'
    },
    red: {
      bg: 'bg-white',
      border: 'border-rose-100/80 hover:border-rose-400',
      iconBg: 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white',
      badgeBg: 'bg-rose-50 text-rose-700',
      glowShadow: 'hover:shadow-rose-500/10',
      accentBar: 'bg-rose-600'
    },
    emerald: {
      bg: 'bg-white',
      border: 'border-emerald-100/80 hover:border-emerald-400',
      iconBg: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
      badgeBg: 'bg-emerald-50 text-emerald-700',
      glowShadow: 'hover:shadow-emerald-500/10',
      accentBar: 'bg-emerald-600'
    },
    amber: {
      bg: 'bg-white',
      border: 'border-amber-100/80 hover:border-amber-400',
      iconBg: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
      badgeBg: 'bg-amber-50 text-amber-700',
      glowShadow: 'hover:shadow-amber-500/10',
      accentBar: 'bg-amber-500'
    }
  }

  const current = schemes[colorScheme] || schemes.blue

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden ${current.bg} p-5 rounded-3xl border ${current.border} shadow-xs hover:shadow-xl ${current.glowShadow} transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:-translate-y-1' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-slate-800 transition-colors">
          {title}
        </span>
        <div
          className={`p-2.5 rounded-2xl ${current.iconBg} transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-6 shadow-2xs`}
        >
          <Icon className="w-5 h-5 transition-transform duration-300" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight group-hover:translate-x-0.5 transition-transform duration-200">
          {value}
        </div>
        {subtext && (
          <p className="mt-1 text-xs text-slate-500 font-medium">
            {subtext}
          </p>
        )}
      </div>

      {/* Interactive Bottom Accent Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
        <div
          className={`h-full w-0 group-hover:w-full transition-all duration-500 ease-out ${current.accentBar}`}
        ></div>
      </div>
    </div>
  )
}
