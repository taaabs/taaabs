import { Icon } from '@web-ui/components/Icon'
import styles from './Actions.module.scss'

export namespace Actions {
  type Item = {
    icon: Icon.Variant
    label: string
    is_danger?: boolean
    href?: string
    on_click?: () => void
  }
  export type Props = {
    items: Item[]
  }
}

export const Actions: React.FC<Actions.Props> = (props) => {
  return (
    <div>
      {props.items.map((item, i) => {
        const actionItemClass = `${styles.actionItem} ${
          item.is_danger ? styles.isDanger : ''
        }`

        if (item.href) {
          return (
            <a key={i} href={item.href} className={actionItemClass}>
              {item.icon}
              {item.label}
            </a>
          )
        } else {
          return (
            <button
              key={i}
              onClick={item.on_click}
              className={actionItemClass}
            >
              {item.icon}
              {item.label}
            </button>
          )
        }
      })}
    </div>
  )
}
