export const get_chatbot_prompt_by_id = (prompt_id: string) => {
  if (prompt_id == 'summarize') {
    return `Please summarize all the key points of the text in bullet points.`
  } else if (prompt_id == 'eli5') {
    return `Please provide an explanation that covers all key points of the text in a way that a five-year-old can understand (ELI5).`
  } else if (prompt_id == 'study-guide') {
    return `Please generate a comprehensive study guide based on the text. The study guide should include:
1. Key concepts and definitions.
2. Important facts and figures.
3. Summary of main ideas and arguments.
4. Practice questions and answers.
5. Inspirations for further learning.

Ensure the study guide is well-structured and easy to follow.`
  } else if (prompt_id == 'ask-question') {
    return `Your first response should be solely: "Hi! What's your question?" After the user provides a question, please provide two answers: a quick one and a detailed one. Use the text for context.`
  } else if (prompt_id == 'quiz-me') {
    return `Please generate three types of quizzes based on text:
1. Multiple-Choice: 5 questions with 4 choices each.
2. True/False: 5 statements.
3. Fill-in-the-Blanks: 5 sentences.
Provide all answers at the very end, grouped by quiz type.`
  } else if (prompt_id == 'layman') {
    return `Please explain the text in layman's terms so that anyone can understand it.`
  }
}
