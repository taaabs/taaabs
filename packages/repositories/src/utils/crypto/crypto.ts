import loadArgon2idWasm from 'argon2id'

export namespace Crypto {
  namespace Helpers {
    // Helper function to get a random integer
    export const get_random_int = (max: number): number => {
      return window.crypto.getRandomValues(new Uint32Array(1))[0] % max
    }

    // Helper function to shuffle a string
    export const shuffle_string = (str: string): string => {
      return str
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('')
    }
  }

  export const generate_strong_password = (length: number = 16): string => {
    if (length <= 0) {
      throw new Error('Password length must be greater than 0')
    }

    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const digits = '0123456789'
    const specialChars = '!@#$%^&*()_+~`|}{[]:;?><,./-='

    const all_chars = lowercase + uppercase + digits + specialChars

    // Ensure at least one character from each category
    let password = [
      lowercase[Helpers.get_random_int(lowercase.length)],
      uppercase[Helpers.get_random_int(uppercase.length)],
      digits[Helpers.get_random_int(digits.length)],
      specialChars[Helpers.get_random_int(specialChars.length)],
    ].join('')

    // Fill the rest of the password length with random characters
    for (let i = password.length; i < length; i++) {
      password += all_chars[Helpers.get_random_int(all_chars.length)]
    }

    // Shuffle the password to ensure randomness
    return Helpers.shuffle_string(password)
  }

  export const derive_encrypton_key = async (
    password: string,
    salt: string, // user id
  ): Promise<Uint8Array> => {
    // Load the Argon2id WASM module
    const argon2id = await loadArgon2idWasm()
    // Create a TextEncoder to convert the password and salt strings to Uint8Arrays
    const encoder = new TextEncoder()

    // Derive the encryption key using Argon2id
    // https://www.rfc-editor.org/rfc/rfc9106.html#name-parameter-choice
    const hash = argon2id({
      password: encoder.encode(password),
      salt: encoder.encode(salt),
      // Number of parallel threads to use (4 in this case)
      parallelism: 4,
      // Number of iterations (3 in this case)
      passes: 3,
      // Amount of memory to use (2^16 KB or 64 MB)
      memorySize: 2 ** 16,
      // Length of the derived key in bytes (32 bytes or 256 bits)
      tagLength: 32,
    })
    return hash
  }
}
