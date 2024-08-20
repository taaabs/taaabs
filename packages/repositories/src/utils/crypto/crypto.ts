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
}
