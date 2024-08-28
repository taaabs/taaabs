import { Icon } from '@web-ui/components/Icon'
import styles from './BottomNavigationBar.module.scss'

export namespace BottomNavigationBar {
  type Item = {
    href: string
    icon: Icon.Variant
    icon_filled: Icon.Variant
  }
  export type Props = {
    items: Item[]
  }
}

export const BottomNavigationBar: React.FC<BottomNavigationBar.Props> = (
  props,
) => {

  return (
    <div className={styles.container}>
      {props.items.map((item, i) => (
        <a
          className={styles.item}
          href={item.href}
          rel="noreferrer noopener"
          key={i}
        >
          <Icon variant={item.icon} />
          <Icon variant={item.icon_filled} />
        </a>
      ))}
    </div>
  )
}
