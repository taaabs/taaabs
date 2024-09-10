import { Icon as UiIcon } from '../Icon'
import styles from './Checkbox.module.scss'
import cn from 'classnames'

export namespace Checkbox {
  export type Props = {
    label: string
    on_click: () => void
    is_checked?: boolean
    is_disabled?: boolean
  }
}

export const Checkbox: React.FC<Checkbox.Props> = (props) => {
  return (
    <div
      role="button"
      className={cn(styles.container, {
        [styles['container--disabled']]: props.is_disabled,
      })}
      onClick={props.on_click}
    >
      <div
        className={cn([
          styles.checkbox,
          {
            [styles['checkbox--checked']]: props.is_checked,
          },
        ])}
      >
        <UiIcon variant="SELECTED" />
      </div>
      <span>{props.label}</span>
    </div>
  )
}
