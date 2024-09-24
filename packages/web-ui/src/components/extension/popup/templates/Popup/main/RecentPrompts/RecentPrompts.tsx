import styles from './RecentPrompts.module.scss'
import cn from 'classnames'

export namespace RecentPrompts {
  export type Props = {
    recent_prompts: string[]
    default_prompts: string[]
    on_recent_prompt_click: (prompt: string) => void
    is_disabled: boolean
    is_not_available: boolean
    filter_phrase: string
  }
}

export const RecentPrompts: React.FC<RecentPrompts.Props> = (props) => {
  const filter_words = props.filter_phrase
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 1)

  const filtered_prompts = props.filter_phrase
    ? props.recent_prompts
        .filter((prompt) =>
          filter_words.every((word) => prompt.toLowerCase().includes(word)),
        )
        .map((prompt) => {
          let highlightedPrompt = prompt
          filter_words.forEach((word) => {
            const regex = new RegExp(`(${word})`, 'gi')
            highlightedPrompt = highlightedPrompt.replace(
              regex,
              '<mark>$1</mark>',
            )
          })
          return highlightedPrompt
        })
    : props.recent_prompts

  return (
    <div className={styles.container}>
      <div className={styles.prompts}>
        <div
          className={cn(styles.prompts__inner, {
            [styles['prompts__inner--disabled']]: props.is_disabled,
            [styles['prompts__inner--not-available']]: props.is_not_available,
          })}
        >
          {filtered_prompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => props.on_recent_prompt_click(prompt)}
              className={cn(styles.prompts__inner__button, {
                [styles['prompts__inner__button--default']]:
                  props.default_prompts.includes(prompt),
              })}
              dangerouslySetInnerHTML={{ __html: prompt }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
