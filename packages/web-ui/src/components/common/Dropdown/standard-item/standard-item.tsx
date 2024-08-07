import { Icon } from '../../particles/icon'
import styles from './standard-item.module.scss'
import cn from 'classnames'

export namespace StandardItem {
  export type Props = {
    icon_variant: Icon.Variant
    label: string
    on_click: () => void
    is_danger?: boolean
  }
}

export const StandardItem: React.FC<StandardItem.Props> = (props) => {
  return (
    <button
      className={cn(styles.container, {
        [styles['container--danger']]: props.is_danger,
      })}
      onClick={props.on_click}
    >
      <Icon variant={props.icon_variant} />
      <span>{props.label}</span>
    </button>
  )
}
