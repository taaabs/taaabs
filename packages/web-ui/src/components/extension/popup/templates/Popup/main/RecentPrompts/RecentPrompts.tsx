import styles from './RecentPrompts.module.scss'

export namespace RecentPrompts {
  export type Props = {
    heading: string
    recent_prompts: {
      name: string
      id: string
    }[]
    on_recent_prompt_click: (prompt_id: string) => void
  }
}

export const RecentPrompts: React.FC<RecentPrompts.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>{props.heading}</div>
      <div className={styles.prompts}>
        {props.recent_prompts.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => props.on_recent_prompt_click(prompt.id)}
          >
            {prompt.name}
          </button>
        ))}
      </div>
    </div>
  )
}
