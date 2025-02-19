export type AssistantName =
  | 'chatgpt'
  | 'gemini'
  | 'copilot'
  | 'claude'
  | 'aistudio'
  | 'grok'
  // | 'meta'
  | 'mistral'
  | 'cohere'
  | 'deepseek'
  | 'custom'

export interface AssistantDetails {
  label: string
  url: string
  supports_vision: boolean
}

export const assistants: Record<AssistantName, AssistantDetails> = {
  chatgpt: {
    label: 'ChatGPT',
    url: 'https://chatgpt.com/',
    supports_vision: true,
  },
  gemini: {
    label: 'Gemini',
    url: 'https://gemini.google.com/app',
    supports_vision: false,
  },
  copilot: {
    label: 'Copilot',
    url: 'https://copilot.microsoft.com/',
    supports_vision: true,
  },
  claude: {
    label: 'Claude',
    url: 'https://claude.ai/new',
    supports_vision: true,
  },
  aistudio: {
    label: 'AI Studio',
    url: 'https://aistudio.google.com/app/prompts/new_chat',
    supports_vision: false,
  },
  grok: {
    label: 'Grok',
    url: 'https://x.com/i/grok',
    supports_vision: true,
  },
  deepseek: {
    label: 'DeepSeek',
    url: 'https://chat.deepseek.com/',
    supports_vision: false,
  },
  // meta: {
  //   display_name: 'Meta AI',
  //   url: 'https://www.meta.ai/',
  //   supports_vision: false,
  // },
  mistral: {
    label: 'Mistral',
    url: 'https://chat.mistral.ai/chat',
    supports_vision: true,
  },
  cohere: {
    label: 'Cohere',
    url: 'https://coral.cohere.com/',
    supports_vision: false,
  },
  custom: {
    label: 'Custom',
    url: '',
    supports_vision: true,
  },
}
