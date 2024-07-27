export const ky_instance_mock = {
  post: jest.fn().mockReturnValue({
    json: jest.fn().mockResolvedValue({}),
  }),
  get: jest.fn().mockReturnValue({
    json: jest.fn().mockResolvedValue({}),
    text: jest.fn().mockResolvedValue('mocked_text'),
  }),
  put: jest.fn().mockReturnValue({
    json: jest.fn().mockResolvedValue({}),
  }),
  delete: jest.fn().mockReturnValue({
    json: jest.fn().mockResolvedValue({}),
  }),
  patch: jest.fn().mockReturnValue({
    json: jest.fn().mockResolvedValue({}),
  }),
} as any
