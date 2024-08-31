type Task = 'tldr' | 'simplify' | 'pov'

export const get_prompt = (params: { task: Task; content: string }) => {
  if (params.task == 'tldr') {
    return `Summarize all the key points of the passage in bullet points.\n\n-\n\n${params.content}`
  } else if (params.task == 'simplify') {
    return `Provide explanation that covers all key points of the passage like I'm five years old.\n\n-\n\n${params.content}`
  } else if (params.task == 'pov') {
    return `Help me explore points of view of the matter the following passage touches.\n\n-\n\n${params.content}`
  }
}
