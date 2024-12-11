export type AssistantName =
  | 'chatgpt'
  | 'gemini'
  | 'copilot'
  | 'claude'
  | 'aistudio'
  | 'mistral'
  | 'cohere'
  | 'huggingchat'
  | 'deepseek'
  | 'custom'

export interface AssistantDetails {
  display_name: string
  url: string
}

export const assistants: Record<AssistantName, AssistantDetails> = {
  chatgpt: {
    display_name: 'ChatGPT',
    url: 'https://chatgpt.com/',
  },
  gemini: {
    display_name: 'Gemini',
    url: 'https://gemini.google.com/app',
  },
  copilot: {
    display_name: 'Copilot',
    url: 'https://copilot.microsoft.com/',
  },
  claude: {
    display_name: 'Claude',
    url: 'https://claude.ai/new',
  },
  aistudio: {
    display_name: 'AI Studio',
    url: 'https://aistudio.google.com/app/prompts/new_chat',
  },
  mistral: {
    display_name: 'Mistral',
    url: 'https://chat.mistral.ai/chat',
  },
  cohere: {
    display_name: 'Cohere',
    url: 'https://coral.cohere.com/',
  },
  huggingchat: {
    display_name: 'HuggingChat',
    url: 'https://huggingface.co/chat/',
  },
  deepseek: {
    display_name: 'DeepSeek',
    url: 'https://chat.deepseek.com/',
  },
  custom: {
    display_name: 'Custom',
    url: '',
  },
}

export const assistants_vision: AssistantName[] = [
  // 'chatgpt',
  'claude',
  'mistral',
  'huggingchat',
  'copilot',
  'custom',
]
