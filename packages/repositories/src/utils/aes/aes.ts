export namespace AES {
  /**
   * Encrypts the given data using AES-CBC with the provided encryption key.
   *
   * @param data - The data to be encrypted, provided as a string.
   * @param encryption_key - The encryption key derived from the user's password using Argon2id.
   * @returns A Promise that resolves to a Base64-encoded string containing the IV and encrypted data.
   */
  export const encrypt = async (
    data: string,
    encryption_key: Uint8Array,
  ): Promise<string> => {
    try {
      // Encode the input data to a Uint8Array
      const encoded_data = new TextEncoder().encode(data)

      // Generate a random initialization vector (IV)
      const iv = window.crypto.getRandomValues(new Uint8Array(16))

      // Import the encryption key into the Web Crypto API
      const crypto_key = await window.crypto.subtle.importKey(
        'raw',
        encryption_key,
        { name: 'AES-CBC' },
        false,
        ['encrypt'],
      )

      // Encrypt the data using AES-CBC with the generated IV
      const encrypted_data = await window.crypto.subtle.encrypt(
        { name: 'AES-CBC', iv },
        crypto_key,
        encoded_data,
      )

      // Combine the IV and encrypted data into a single Uint8Array
      const ciphertext_with_iv = new Uint8Array(
        iv.byteLength + encrypted_data.byteLength,
      )
      ciphertext_with_iv.set(new Uint8Array(iv), 0)
      ciphertext_with_iv.set(new Uint8Array(encrypted_data), iv.byteLength)

      // Convert the combined array to a Base64-encoded string
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

  /**
   * Decrypts the given Base64-encoded string containing the IV and encrypted data using AES-CBC.
   *
   * @param encrypted_data_with_iv - The Base64-encoded string containing the IV and encrypted data.
   * @param encryption_key - The encryption key derived from the user's password using Argon2id.
   * @returns A Promise that resolves to the decrypted data as a string.
   */
  export const decrypt = async (
    encrypted_data_with_iv: string,
    encryption_key: Uint8Array,
  ): Promise<string> => {
    try {
      // Decode the Base64-encoded string to a Uint8Array
      const encrypted_data_array_buffer = Uint8Array.from(
        atob(encrypted_data_with_iv),
        (c) => c.charCodeAt(0),
      )

      // Extract the IV from the beginning of the array
      const iv = new Uint8Array(encrypted_data_array_buffer.slice(0, 16))

      // Extract the encrypted data from the rest of the array
      const encrypted_data = encrypted_data_array_buffer.slice(16)

      // Import the encryption key into the Web Crypto API
      const crypto_key = await window.crypto.subtle.importKey(
        'raw',
        encryption_key,
        { name: 'AES-CBC' },
        false,
        ['decrypt'],
      )

      // Decrypt the data using AES-CBC with the extracted IV
      const decrypted_data = await window.crypto.subtle.decrypt(
        { name: 'AES-CBC', iv },
        crypto_key,
        encrypted_data,
      )

      // Decode the decrypted data from a Uint8Array to a string
      return new TextDecoder().decode(decrypted_data)
    } catch (error) {
      console.error('Decryption failed: ', error)
      throw new Error('Decryption failed')
    }
  }
}
