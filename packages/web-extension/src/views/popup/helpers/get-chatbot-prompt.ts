export const get_chatbot_prompt = (params: {
  prompt_id: string
  plain_text: string
}) => {
  let prompt = ''
  if (params.prompt_id == 'summarize') {
    prompt = `Please summarize all the key points of the following text in bullet points.\n\n---\n\n${params.plain_text}`
  } else if (params.prompt_id == 'eli5') {
    prompt = `Please provide an explanation that covers all key points of the following text in a way that a five-year-old can understand (ELI5).\n\n---\n\n${params.plain_text}`
  } else if (params.prompt_id == 'study-guide') {
    prompt = `Please generate a comprehensive study guide based on the following text. The study guide should include:
1. Key concepts and definitions.
2. Important facts and figures.
3. Summary of main ideas and arguments.
4. Practice questions and answers.
5. Recommended further reading or resources.

Ensure the study guide is well-structured and easy to follow.\n\n---\n\n${params.plain_text}`
  } else if (params.prompt_id == 'reply-draft') {
    prompt = `Please draft a response to the following forum post.\n\n---\n\n${params.plain_text}`
  } else if (params.prompt_id == 'follow-up-question') {
    prompt = `Your first response should be solely: "Hi! What's your question?" After the user provides a question, please provide two answers: a quick one and a detailed one. Use the attached page for context.\n\n---\n\n${params.plain_text}`
  } else if (params.prompt_id == 'quiz-me') {
    prompt = `Please generate three types of quizzes based on the following text:
1. Multiple-Choice: 5 questions with 4 choices each.
2. True/False: 5 statements.
3. Fill-in-the-Blanks: 5 sentences.
Provide all answers at the very end, grouped by quiz type.\n\n---\n\n${params.plain_text}`
  } else if (params.prompt_id == 'layman') {
    prompt = `Please explain the following text in layman's terms so that anyone can understand it.\n\n---\n\n${params.plain_text}`
  } else if (params.prompt_id == 'buying-advice') {
    prompt = `I'm considering purchasing the product described in the following text. To make an informed decision, could you please guide me through the key factors I should consider? Specifically, I'd like to know about:
1. The most important features and specifications to look for in this type of product.
2. Any potential drawbacks or limitations I should be aware of.
3. The product's durability and expected lifespan.
4. The brand's reputation and customer service.
5. Value for money compared to similar products on the market.
6. Any additional costs or accessories I might need to consider.
Also, are there any specific online reviews or product comparisons you'd recommend I read before making my purchase? Thank you for your expert advice!\n\n---\n\n${params.plain_text}`
  }
  return prompt
}
