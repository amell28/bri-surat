import { useState, useEffect } from 'react'

export function getInitials(name) {
  if (!name || typeof name !== 'string') return 'U'
  // Clean titles or extra punctuation
  const clean = name.replace(/^(bpk\.|ibu\.|dr\.|drs\.|drg\.|ir\.|h\.|hj\.)\s+/i, '').trim()
  const parts = clean.split(/[\s,]+/).filter(Boolean)
  if (parts.length === 0) return 'U'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()

  const first = parts[0][0]
  // If last part looks like a degree/title with period (e.g. S.E., S.Kom), try previous part
  let lastPart = parts[parts.length - 1]
  if (lastPart.includes('.') && parts.length > 2) {
    lastPart = parts[parts.length - 2]
  }
  const last = lastPart[0]
  return (first + last).toUpperCase()
}

// List of pleasant banking brand accent gradients for staff without custom photos
const GRADIENTS = [
  'from-[#014181] via-[#0256ab] to-[#002d5b]',
  'from-[#00529C] to-[#01356b]',
  'from-[#014181] to-[#FF7401]',
  'from-[#0a58ca] to-[#014181]',
  'from-[#023e8a] to-[#0077b6]'
]

function getGradientForName(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % GRADIENTS.length
  return GRADIENTS[index]
}

export default function Avatar({
  src,
  name = 'Staf BRI',
  size = 'md',
  className = '',
  ringClassName = ''
}) {
  const [hasError, setHasError] = useState(false)

  // Reset error state if image source changes
  useEffect(() => {
    setHasError(false)
  }, [src])

  // Ignore dummy placeholder URLs from older test datasets
  const isDummyUrl = typeof src === 'string' && src.includes('unsplash.com')
  const validSrc = !isDummyUrl && src && !hasError

  const sizeMap = {
    xs: {
      box: 'w-6 h-6',
      text: 'text-[11px] font-bold leading-none'
    },
    sm: {
      box: 'w-8 h-8',
      text: 'text-xs font-bold leading-none'
    },
    md: {
      box: 'w-9 h-9',
      text: 'text-sm font-bold leading-none'
    },
    lg: {
      box: 'w-12 h-12',
      text: 'text-xl font-extrabold leading-none'
    },
    xl: {
      box: 'w-24 h-24 sm:w-28 sm:h-28',
      text: 'text-5xl sm:text-6xl font-black tracking-tight leading-none'
    }
  }

  const config = sizeMap[size] || sizeMap.md
  const gradient = getGradientForName(name)

  if (validSrc) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setHasError(true)}
        className={`${config.box} rounded-full object-cover shrink-0 select-none ${ringClassName} ${className}`}
      />
    )
  }

  return (
    <div
      className={`${config.box} ${config.text} rounded-full bg-gradient-to-tr ${gradient} text-white flex items-center justify-center shrink-0 select-none shadow-lg border-2 border-white/30 ${ringClassName} ${className}`}
      title={name}
    >
      <span className="transform translate-y-[-1px]">{getInitials(name)}</span>
    </div>
  )
}
