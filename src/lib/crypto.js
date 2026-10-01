// Utility Kriptografi Enkripsi Password (SHA-256 dengan Salt Resmi)
// Memastikan password staf tidak pernah tersimpan dalam bentuk teks biasa (plain-text) di database.

export async function hashPassword(plainText) {
  if (!plainText) return ''
  
  // Jika sudah berbentuk hash SHA-256 (64 karakter heksadesimal)
  if (/^[a-f0-9]{64}$/i.test(plainText)) {
    return plainText
  }

  // Salt rahasia untuk mencegah rainbow table attack
  const salt = 'bri_kcp_iskandar_palembang_secure_salt'
  const encoder = new TextEncoder()
  const data = encoder.encode(plainText + salt)
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPassword(inputPassword, storedPasswordOrHash) {
  if (!inputPassword || !storedPasswordOrHash) return false

  // Dukung backward compatibility jika ada akun lama dengan plain text
  if (inputPassword === storedPasswordOrHash) {
    return true
  }

  const hashedInput = await hashPassword(inputPassword)
  return hashedInput === storedPasswordOrHash
}
