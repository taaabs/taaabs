import { Icon } from '@web-ui/components/Icon'
import styles from './MessageHistory.module.scss'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime)

type Props = {
  on_history_back_click?: () => void
  on_history_forward_click?: () => void
  timestamp?: number
}

export const MessageHistory: React.FC<Props> = (props) => {
  // Format the timestamp to show relative time (e.g. "2m ago")
  const formatted_time_relative = props.timestamp
    ? dayjs(props.timestamp).fromNow()
    : undefined

  const formatted_time_full_date = props.timestamp
    ? dayjs(props.timestamp).format('MMMM D, YYYY h:mm A')
    : undefined

  return (
    <div className={styles.container}>
      {formatted_time_relative && (
        <span className={styles.timestamp} title={formatted_time_full_date}>
          {formatted_time_relative}
        </span>
      )}
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
