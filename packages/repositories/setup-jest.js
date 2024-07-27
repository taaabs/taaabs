jest.mock('@repositories/utils/crypto', () => ({
  Crypto: {
    AES: {
      decrypt: jest.fn(),
    },
    SHA256: jest.fn().mockResolvedValue('mocked_hash'),
  },
}))
