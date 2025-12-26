const ENCRYPTION_KEY = import.meta.env.VITE_API_KEY || 'sys_tools_web_2025'

export function encrypt(data: string): string {
  try {
    const keyBytes = new TextEncoder().encode(ENCRYPTION_KEY)
    const dataBytes = new TextEncoder().encode(data)
    const result: number[] = []

    for (let i = 0; i < dataBytes.length; i++) {
      result.push(dataBytes[i] ^ keyBytes[i % keyBytes.length])
    }

    return btoa(String.fromCharCode(...result))
  } catch {
    return btoa(data)
  }
}

export function decrypt(encryptedData: string): string {
  try {
    const keyBytes = new TextEncoder().encode(ENCRYPTION_KEY)
    const decoded = atob(encryptedData)
    const decodedBytes = new Uint8Array(decoded.length)

    for (let i = 0; i < decoded.length; i++) {
      decodedBytes[i] = decoded.charCodeAt(i)
    }

    const result: number[] = []
    for (let i = 0; i < decodedBytes.length; i++) {
      result.push(decodedBytes[i] ^ keyBytes[i % keyBytes.length])
    }

    return new TextDecoder().decode(new Uint8Array(result))
  } catch {
    return atob(encryptedData)
  }
}
