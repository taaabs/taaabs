import loadArgon2idWasm from 'argon2id'

export namespace Crypto {
  export const generate_strong_password = (length: number = 16): string => {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-='
    let password = ''

    for (let i = 0; i < length; i++) {
      const random_index = Math.floor(Math.random() * charset.length)
      password += charset[random_index]
    }

    return password
  }

  export const derive_encrypton_key = async (
    password: string,
    salt: string, // user id
  ): Promise<Uint8Array> => {
    const argon2id = await loadArgon2idWasm()
    const encoder = new TextEncoder()
    // https://www.rfc-editor.org/rfc/rfc9106.html#name-parameter-choice
    const hash = argon2id({
      password: encoder.encode(password),
      salt: encoder.encode(salt),
      parallelism: 4,
      passes: 3,
      memorySize: 2 ** 16,
      tagLength: 32,
    })
    return hash
  }

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
          { name: 'AES-CBC', iv: iv },
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
          { name: 'AES-CBC', iv: iv },
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
}
