import styles from './RecentPrompts.module.scss'
import cn from 'classnames'

export namespace RecentPrompts {
  export type Props = {
    recent_prompts: string[]
    default_prompts: string[]
    on_recent_prompt_click: (prompt: string) => void
    is_disabled: boolean
    filter_phrase: string
  }
}

type FilteredPrompt =
  | string
  | {
      original_prompt: string
      highlighted_prompt: string
    }

export const RecentPrompts: React.FC<RecentPrompts.Props> = (props) => {
  const filtered_prompts: FilteredPrompt[] = props.is_disabled
    ? props.recent_prompts
    : props.filter_phrase
    ? props.recent_prompts
        .filter((prompt) => {
          const filter_words = props.filter_phrase
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .filter((word) => word.length)
          return filter_words.every((word) =>
            prompt.toLowerCase().includes(word),
          )
        })
        .map((prompt) => {
          const original_prompt = prompt
          let highlighted_with_markup = prompt
          const filter_words = props.filter_phrase
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .filter((word) => word.length)

          filter_words.forEach((word) => {
            const regex = new RegExp(`(${word})`, 'gi')
            highlighted_with_markup = highlighted_with_markup.replace(
              regex,
              '<mark>$1</mark>',
            )
          })
          return {
            original_prompt,
            highlighted_prompt: highlighted_with_markup,
          }
        })
    : props.recent_prompts

  return (
    <div className={styles.container}>
      <div className={styles.prompts}>
        <div
          className={cn(styles.prompts__inner, {
            [styles['prompts__inner--disabled']]: props.is_disabled,
          })}
        >
          {filtered_prompts.map((prompt, i) => {
            const prompt_to_use =
              typeof prompt == 'string' ? prompt : prompt.highlighted_prompt
            const original_prompt =
              typeof prompt == 'string' ? prompt : prompt.original_prompt
            return (
              <button
                key={i}
                onClick={() => props.on_recent_prompt_click(original_prompt)}
                className={cn(styles.prompts__inner__button, {
                  [styles['prompts__inner__button--clamp']]:
                    !props.filter_phrase,
                })}
                dangerouslySetInnerHTML={{
                  __html: props.default_prompts.includes(original_prompt)
                    ? `${star}${prompt_to_use}`
                    : prompt_to_use,
                }}
                title={original_prompt}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

const star = `<svg viewBox="0 0 182 173" xmlns="http://www.w3.org/2000/svg">
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M80.0381 6.90805C84.1793 -2.3027 97.2777 -2.30267 101.419 6.90805L121.645 51.8979L170.755 57.1993C180.81 58.2847 184.858 70.7215 177.362 77.4991L140.753 110.606L150.878 158.872C152.951 168.754 142.354 176.44 133.581 171.419L90.7289 146.889L47.8761 171.419C39.1029 176.44 28.5057 168.754 30.5787 158.872L40.7042 110.606L4.09439 77.4991C-3.40069 70.7214 0.64712 58.2847 10.7014 57.1993L59.8118 51.8979L80.0381 6.90805Z"
  />
</svg>`
