export const get_chatbot_prompt = (params: {
  prompt_id: string
  plain_text: string
}) => {
  let prompt = ''
  if (params.prompt_id == '1') {
    prompt = `Summarize all the key points of the page in bullet points.\n\n---\n\n${params.plain_text}`
  } else if (params.prompt_id == '2') {
    prompt = `Provide explanation that covers all key points of the page like I'm five years old.\n\n---\n\n${params.plain_text}`
  } else if (params.prompt_id == '3') {
    prompt = `Help me explore points of view of the matter the following page touches.\n\n---\n\n${params.plain_text}`
  } else if (params.prompt_id == '4') {
    prompt = `Reply to the OP in this forum thread with a thoughtful response addressing their main points.\n\n---\n\n${params.plain_text}`
  } else if (params.prompt_id == '5') {
    prompt = `Your first response should be solely: "Hi! What's your question?" After I provide a question, please answer it with both a concise summary and a detailed explanation.\n\n---\n\n${params.plain_text}`
  } else if (params.prompt_id == '6') {
    prompt = `Generate three quiz types (Multiple-Choice: 5 questions/4 choices, True/False: 5 statements, Fill-in-the-Blanks: 5 sentences) based on the page. Provide all answers at the very end, grouped by quiz type.\n\n---\n\n${params.plain_text}`
  } else if (params.prompt_id == '7') {
    prompt = `Create a study guide based on this page.\n\n---\n\n${params.plain_text}`
  }
  return prompt
}
