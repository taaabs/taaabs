export namespace AES {
  export const encrypt = async (
    data: string,
    encryption_key: Uint8Array,
  ): Promise<string> => {
    try {
      const encoded_data = new TextEncoder().encode(data)
      const iv = window.crypto.getRandomValues(new Uint8Array(16))

      const crypto_key = await window.crypto.subtle.importKey(
        'raw',
        encryption_key,
        { name: 'AES-CBC' },
        false,
        ['encrypt'],
      )

      const encrypted_data = await window.crypto.subtle.encrypt(
        { name: 'AES-CBC', iv },
        crypto_key,
        encoded_data,
      )

      const ciphertext_with_iv = new Uint8Array(
        iv.byteLength + encrypted_data.byteLength,
      )
      ciphertext_with_iv.set(new Uint8Array(iv), 0)
      ciphertext_with_iv.set(new Uint8Array(encrypted_data), iv.byteLength)

      return btoa(
        ciphertext_with_iv.reduce(
          (data, byte) => data + String.fromCharCode(byte),
          '',
        ),
      )
    } catch (error) {
      console.error('Encryption failed: ', error)
      throw new Error('Encryption failed')
    }
  }

  export const decrypt = async (
    encrypted_data_with_iv: string,
    encryption_key: Uint8Array,
  ): Promise<string> => {
    try {
      const encrypted_data_array_buffer = Uint8Array.from(
        atob(encrypted_data_with_iv),
        (c) => c.charCodeAt(0),
      )
      const iv = new Uint8Array(encrypted_data_array_buffer.slice(0, 16))
      const encrypted_data = encrypted_data_array_buffer.slice(16)

      const crypto_key = await window.crypto.subtle.importKey(
        'raw',
        encryption_key,
        { name: 'AES-CBC' },
        false,
        ['decrypt'],
      )

      const decrypted_data = await window.crypto.subtle.decrypt(
        { name: 'AES-CBC', iv },
        crypto_key,
        encrypted_data,
      )

      return new TextDecoder().decode(decrypted_data)
    } catch (error) {
      console.error('Decryption failed: ', error)
      throw new Error('Decryption failed')
    }
  }
}