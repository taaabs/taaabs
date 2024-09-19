import styles from './RecentPrompts.module.scss'
import cn from 'classnames'

export namespace RecentPrompts {
  export type Props = {
    recent_prompts: {
      name: string
      id: string
    }[]
    on_recent_prompt_click: (prompt_id: string) => void
    is_disabled: boolean
  }
}

export const RecentPrompts: React.FC<RecentPrompts.Props> = (props) => {
  return (
    <div
      className={cn(styles.prompts, {
        [styles['prompts--disabled']]: props.is_disabled,
      })}
    >
      {props.recent_prompts.map((prompt) => (
        <button
          key={prompt.id}
          onClick={() => props.on_recent_prompt_click(prompt.id)}
        >
          {prompt.name}
        </button>
      ))}
    </div>
  )
}
