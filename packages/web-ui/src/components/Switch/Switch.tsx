import styles from './Switch.module.scss'
import cn from 'classnames'

export namespace Switch {
  export type Props = {
    is_checked: boolean
    on_change: (is_checked: boolean) => void
    is_disabled?: boolean
    label?: string
    label_position?: 'left' | 'right'
  }
}

export const Switch: React.FC<Switch.Props> = (props) => {
  const label_position = props.label_position || 'right'

  const handle_change = () => {
    if (!props.is_disabled) {
      props.on_change(!props.is_checked)
    }
  }

  return (
    <div
      role="button"
      className={cn(styles.container, {
        [styles['container--disabled']]: props.is_disabled,
        [styles['container--checked']]: props.is_checked,
        [styles['container--label-left']]: label_position == 'left',
      })}
      onClick={handle_change}
    >
      <div className={styles.switch}>
        <div className={styles.thumb} />
      </div>
      <span className={styles.label}>{props.label}</span>
    </div>
  )
}
