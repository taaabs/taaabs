import loadArgon2idWasm from 'argon2id'

export namespace Crypto {
  export const derive_key_from_password = async (
    password: string,
  ): Promise<Uint8Array> => {
    return new Uint8Array([
      195, 191, 116, 218, 165, 49, 173, 108, 101, 226, 173, 56, 202, 224, 89,
      53, 3, 39, 171, 203, 189, 178, 221, 93, 110, 192, 236, 232, 253, 212, 199,
      84,
    ])
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
    console.log(hash)
    return hash
  }

  // Hash of concatenated data and key.
  export const SHA256 = async (
    data: string,
    key: Uint8Array,
  ): Promise<string> => {
    const encoder = new TextEncoder()
    const encoded_data = encoder.encode(data)
    const merged_array = new Uint8Array(encoded_data.length + key.length)
    merged_array.set(encoded_data)
    merged_array.set(key, encoded_data.length)
    const hash = await crypto.subtle.digest('SHA-256', merged_array)
    const hash_hex = [...new Uint8Array(hash)]
      .map((char) => char.toString(16).padStart(2, '0'))
      .join('')
    return hash_hex
  }

  export namespace AES {
    export const encrypt = async (
      data: string,
      key: Uint8Array,
    ): Promise<string> => {
      const encoded_data = new TextEncoder().encode(data)
      const iv = window.crypto.getRandomValues(new Uint8Array(16)) // Generate a random IV

      const crypto_key = await window.crypto.subtle.importKey(
        'raw',
        key,
        { name: 'AES-CBC' },
        false,
        ['encrypt'],
      )

      const encrypted_data = await window.crypto.subtle.encrypt(
        { name: 'AES-CBC', iv: iv },
        crypto_key,
        encoded_data,
      )

      // Prepend IV to ciphertext.
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
    }

    export const decrypt = async (
      encrypted_data_with_iv: string,
      key: Uint8Array,
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
}
