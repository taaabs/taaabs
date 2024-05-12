import { Icon } from '../../particles/icon'
import styles from './checkbox-item.module.scss'
import cn from 'classnames'

export namespace CheckboxItem {
  export type Props = {
    label: string
    on_click: () => void
    is_checked: boolean
  }
}

export const CheckboxItem: React.FC<CheckboxItem.Props> = (props) => {
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
