export type AssistantName =
  | 'chatgpt'
  | 'gemini'
  | 'aistudio'
  | 'perplexity'
  | 'copilot'
  | 'claude'
  | 'grok'
  | 'meta'
  | 'mistral'
  | 'cohere'
  | 'huggingchat'
  | 'deepseek'
  | 'librechat'
  | 'phind'
  | 'poe'
  | 'you'
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
  aistudio: {
    display_name: 'AI Studio',
    url: 'https://aistudio.google.com/app/prompts/new_chat',
  },
  perplexity: {
    display_name: 'Perplexity',
    url: 'https://www.perplexity.ai/',
  },
  copilot: {
    display_name: 'Bing Copilot',
    url: 'https://www.bing.com/chat',
  },
  claude: {
    display_name: 'Claude',
    url: 'https://claude.ai/new',
  },
  grok: {
    display_name: 'Grok',
    url: 'https://x.com/i/grok',
  },
  meta: {
    display_name: 'Meta AI',
    url: 'https://www.meta.ai/',
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
  librechat: {
    display_name: 'LibreChat',
    url: 'https://librechat-librechat.hf.space/c/new',
  },
  phind: {
    display_name: 'Phind',
    url: 'https://www.phind.com/agent',
  },
  poe: {
    display_name: 'Poe',
    url: 'https://poe.com/',
  },
  you: {
    display_name: 'You',
    url: 'https://you.com/',
  },
  custom: {
    display_name: 'Custom',
    url: 'http://localhost:',
  },
}
