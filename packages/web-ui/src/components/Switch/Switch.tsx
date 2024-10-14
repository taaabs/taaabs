import styles from './Switch.module.scss'
import cn from 'classnames'

export namespace Switch {
  export type Props = {
    is_checked: boolean
    on_change: (is_checked: boolean) => void
    is_disabled?: boolean
    label?: string
  }
}

export const Switch: React.FC<Switch.Props> = (props) => {
  const { is_checked, on_change, is_disabled, label } = props

  const handle_change = () => {
    if (!is_disabled) {
      on_change(!is_checked)
    }
  }

  return (
    <div
      role="button"
      className={cn(styles.container, {
        [styles['container--disabled']]: is_disabled,
        [styles['container--checked']]: is_checked,
      })}
      onClick={handle_change}
    >
      {label && <span>{label}</span>}
      <div className={styles.switch}>
        <div className={styles.thumb} />
      </div>
    </div>
  )
}
