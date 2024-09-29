export const PLAIN_TEXT_MAX_LENGTH = {
  default: 15000, // ChatGPT, Bing Copilot

  gemini: 30000,
  claude: 30000,
  perplexity: 38000,
  huggingchat: 45000,
  deepseek: 420000, // ~110k tokens
  mistral: 200000,
  cohere: 200000,
  aistudio: Infinity,
  custom: Infinity,
}
