import styles from './RecentPrompts.module.scss'
import cn from 'classnames'

export namespace RecentPrompts {
  export type Props = {
    recent_prompts: string[]
    default_prompts: string[]
    on_recent_prompt_click: (prompt: string) => void
    is_disabled: boolean
    is_not_available: boolean
    translations: {
      heading: string
    }
    filter_phrase: string
  }
}

export const RecentPrompts: React.FC<RecentPrompts.Props> = (props) => {
  const filtered_prompts = props.filter_phrase
    ? props.recent_prompts
        .filter((prompt) => {
          const regex = new RegExp(
            props.filter_phrase
              .split('')
              .map((char) => `.*${char}`)
              .join(''),
            'i',
          )
          return regex.test(prompt)
        })
        .map((prompt) => {
          const index = prompt
            .toLowerCase()
            .indexOf(props.filter_phrase.toLowerCase())
          if (index > -1) {
            const before = prompt.substring(0, index)
            const match = prompt.substring(
              index,
              index + props.filter_phrase.length,
            )
            const after = prompt.substring(index + props.filter_phrase.length)
            return `${before}<mark>${match}</mark>${after}`
          }
          return prompt
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
