import { Icon } from '../../particles/icon'
import styles from './standard-item.module.scss'

export namespace StandardItem {
  export type Props = {
    icon_variant: Icon.Variant
    label: string
    on_click: () => void
  }
}

export const StandardItem: React.FC<StandardItem.Props> = (props) => {
  return (
    <button className={styles.container} onClick={props.on_click}>
      <Icon variant={props.icon_variant} />
      <span>{props.label}</span>
    </button>
  )
}
