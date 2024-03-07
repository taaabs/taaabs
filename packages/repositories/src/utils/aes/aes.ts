import CryptoJS from 'crypto-js'
import loadArgon2idWasm from 'argon2id'

export namespace AES {
  export const derive_key_from_password = async (
    password: string,
  ): Promise<string> => {
    return 'BWYvwrNY5g6a2GpkHcQbWkszQiY8tayzdy4KIkz7BqY='
  }

  export const derive_key_from_password2 = async (
    password: string,
  ): Promise<ArrayBuffer> => {
    const argon2id = await loadArgon2idWasm()
    const encoder = new TextEncoder()
    const hash = argon2id({
      password: encoder.encode(password),
      salt: encoder.encode('taaabs'),
      parallelism: 4,
      passes: 3,
      memorySize: 2 ** 16,
      tagLength: 32,
    })
    return hash.buffer
  }

  export const encrypt = (text: string, key: string): string => {
    return CryptoJS.AES.encrypt(text, key).toString()
  }

  export const decrypt = (ciphertext: string, key: string): string => {
    return CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8)
  }

  export const encrypt2 = async (
    data: string,
    key: ArrayBuffer,
  ): Promise<string> => {
    const encodedData = new TextEncoder().encode(data)
    const iv = window.crypto.getRandomValues(new Uint8Array(16)) // Generate a random IV

    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      key,
      { name: 'AES-CBC' },
      false,
      ['encrypt'],
    )

    const encryptedData = await window.crypto.subtle.encrypt(
      { name: 'AES-CBC', iv: iv },
      cryptoKey,
      encodedData,
    )

    // Prepend IV to ciphertext.
    const ciphertextWithIV = new Uint8Array(
      iv.byteLength + encryptedData.byteLength,
    )
    ciphertextWithIV.set(new Uint8Array(iv), 0)
    ciphertextWithIV.set(new Uint8Array(encryptedData), iv.byteLength)

    return btoa(
      ciphertextWithIV.reduce(
        (data, byte) => data + String.fromCharCode(byte),
        '',
      ),
    )
  }

  export const decrypt2 = async (
    encrypted_data_with_iv: string,
    key: ArrayBuffer,
  ): Promise<string> => {
    const encrypted_data_array_buffer = Uint8Array.from(
      atob(encrypted_data_with_iv),
      (c) => c.charCodeAt(0),
    )
    const iv = new Uint8Array(encrypted_data_array_buffer.slice(0, 16)) // Extract IV from ciphertext.
    const encrypted_data = encrypted_data_array_buffer.slice(16)

    const crypto_key = await window.crypto.subtle.importKey(
      'raw',
      key,
      { name: 'AES-CBC' },
      false,
      ['decrypt'],
    )

    const decrypted_data = await window.crypto.subtle.decrypt(
      { name: 'AES-CBC', iv: iv },
      crypto_key,
      encrypted_data,
    )

    return new TextDecoder().decode(decrypted_data)
  }
}
