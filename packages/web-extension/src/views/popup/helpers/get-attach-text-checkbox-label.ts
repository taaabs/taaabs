export const get_attach_text_checkbox_label = (url: string) => {
  const conversation = 'Include conversation'
  const label_map = {
    'https://www.youtube.com/watch': 'Include transcript',
    'https://x.com': 'Include tweet',
    'https://twitter.com': 'Include tweet',
    'https://www.reddit.com/r/': 'Include post',
    'https://gemini.google.com/app/': conversation,
    'https://chatgpt.com/c/': conversation,
    'https://huggingface.co/chat/conversation/': conversation,
    'https://claude.ai/chat/': conversation,
    'https://chat.mistral.ai/chat/': conversation,
    'https://coral.cohere.com/c/': conversation,
    'https://aistudio.google.com/app/prompts/': conversation,
    'https://mail.google.com/mail/': 'Include e-mail',
  }

  let label = 'Include page' // Default label

  for (const prefix in label_map) {
    if (url.startsWith(prefix)) {
      label = (label_map as any)[prefix]
      break
    }
  }
  return label
}
