jest.mock('@repositories/utils/sha256', () => ({
  SHA256: jest.fn().mockResolvedValue('mocked_hash'),
}))

jest.mock('@repositories/utils/aes', () => ({
  AES: {
    decrypt: jest.fn(),
  },
}))
