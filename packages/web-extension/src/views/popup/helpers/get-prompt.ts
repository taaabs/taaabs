type Task = 'tldr' | 'simplify' | 'pov'

export const get_prompt = (params: { task: Task; content: string }) => {
  if (params.task == 'tldr') {
    return `Provide a TL;DR that covers all key points of the passage, without any introductory or closing statements.\n\n-\n\n${params.content}`
  } else if (params.task == 'simplify') {
    return `Translate the passage below into simpler terms for a high school student, without any introductory or closing statements.\n\n-\n\n${params.content}\n\n-\n\nAny term that might be above a teenager's knowledge must be followed by a brief definition, enclosed in brackets. If the passage have some distinct structure, follow it.`
  } else if (params.task == 'pov') {
    return `Help me explore points of view of the matter the following passage touches.\n\n-\n\n${params.content}`
  } else {
    throw new Error('Unknown task')
  }
}
