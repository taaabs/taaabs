import { Ui } from '@web-ui'
import styles from './button-select.module.scss'
import cn from 'classnames'

export namespace ButtonSelect {
  export type Props = {
    label: string
    current_value: string
    is_active?: boolean
    on_click: () => void
  }
}

export const ButtonSelect: React.FC<ButtonSelect.Props> = (props) => {
  return (
    <button
      className={cn([
        styles.container,
        { [styles['container--toggled']]: props.is_active },
      ])}
      onClick={props.on_click}
    >
      <div className={styles.inner}>
        <div>{props.label}</div>
        <div>{props.current_value}</div>
      </div>
      <div
        className={cn([
          styles.arrow,
          { [styles['arrow--toggled']]: props.is_active },
        ])}
      >
        <Ui.Common.Particles.Icon variant="LESS_THAN" />
      </div>
    </button>
  )
}
