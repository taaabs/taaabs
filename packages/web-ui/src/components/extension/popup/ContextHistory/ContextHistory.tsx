import { Icon } from '@web-ui/components/Icon'
import styles from './ContextHistory.module.scss'

type Props = {
  on_history_back_click?: () => void
  on_history_forward_click?: () => void
}

export const ContextHistory: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={props.on_history_forward_click}
        disabled={!props.on_history_forward_click}
        title="Prompt history: next"
      >
        <Icon variant="CHEVRON" />
      </button>
      <button
        className={styles.button}
        onClick={props.on_history_back_click}
        disabled={!props.on_history_back_click}
        title="Prompt history: previous"
      >
        <Icon variant="CHEVRON" />
      </button>
    </div>
  )
}
