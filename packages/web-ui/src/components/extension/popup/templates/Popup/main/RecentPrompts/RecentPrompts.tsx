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
  }
}

export const RecentPrompts: React.FC<RecentPrompts.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>{props.translations.heading}</div>
      <div className={styles.prompts}>
        <div
          className={cn(styles.prompts__inner, {
            [styles['prompts__inner--disabled']]: props.is_disabled,
            [styles['prompts__inner--not-available']]: props.is_not_available,
          })}
        >
          {props.recent_prompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => props.on_recent_prompt_click(prompt)}
              className={cn(styles.prompts__inner__button, {
                [styles['prompts__inner__button--default']]:
                  props.default_prompts.includes(prompt),
              })}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
