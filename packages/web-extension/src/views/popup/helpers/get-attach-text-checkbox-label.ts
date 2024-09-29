export const get_attach_text_checkbox_label = (url: string) => {
  const conversation = 'Attach chat'
  const label_map = {
    'https://www.youtube.com/watch': 'Attach transcript',
    'https://x.com': 'Attach tweet',
    'https://www.reddit.com/r/': 'Attach post',
    'https://gemini.google.com/app/': conversation,
    'https://chatgpt.com/c/': conversation,
    'https://huggingface.co/chat/conversation/': conversation,
    'https://claude.ai/chat/': conversation,
    'https://chat.mistral.ai/chat/': conversation,
    'https://coral.cohere.com/c/': conversation,
    'https://aistudio.google.com/app/prompts/': conversation,
    'https://mail.google.com/mail/': 'Attach e-mail',
  }

  let label = 'Attach article' // Default label

  for (const prefix in label_map) {
    if (url.startsWith(prefix)) {
      label = (label_map as any)[prefix]
      break
    }
  }
  return label
}
