global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  }),
)

jest.mock('argon2id', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    hash: jest.fn().mockResolvedValue('mocked_hash'),
    verify: jest.fn().mockResolvedValue(true),
    needsRehash: jest.fn().mockReturnValue(false),
  }),
}))
