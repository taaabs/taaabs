import { Icon } from '../common/particles/icon'
import styles from './Checkbox.module.scss'
import cn from 'classnames'

export namespace Checkbox {
  export type Props = {
    label: string
    on_click: () => void
    is_checked: boolean
  }
}

export const Checkbox: React.FC<Checkbox.Props> = (props) => {
  return (
    <button className={styles.container} onClick={props.on_click}>
      <div
        className={cn([
          styles.checkbox,
          {
            [styles['checkbox--checked']]: props.is_checked,
          },
        ])}
      >
        <Icon variant="SELECTED" />
      </div>
      <span>{props.label}</span>
    </button>
  )
}