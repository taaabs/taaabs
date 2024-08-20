export const SHA256 = async (
  data: string,
  encryption_key: Uint8Array,
): Promise<string> => {
  const encoder = new TextEncoder()
  const encoded_data = encoder.encode(data)
  const merged_array = new Uint8Array(
    encoded_data.length + encryption_key.length,
  )
  merged_array.set(encoded_data)
  merged_array.set(encryption_key, encoded_data.length)
  const hash = await crypto.subtle.digest('SHA-256', merged_array)
  const hash_hex = [...new Uint8Array(hash)]
    .map((char) => char.toString(16).padStart(2, '0'))
    .join('')
  return hash_hex
}