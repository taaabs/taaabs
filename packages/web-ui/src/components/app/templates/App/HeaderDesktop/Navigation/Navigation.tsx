import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './Navigation.module.scss'
import { _Button } from './_Button'

export namespace Navigation {
  export type Item = {
    icon: Icon.Variant
    filled_icon: Icon.Variant
    is_active: boolean
    href: string
    on_click?: (e: React.MouseEvent) => void
    title: string
  }
  export type Props = {
    items: Item[]
  }
}

export const Navigation = (props: Navigation.Props) => {
  return (
    <div className={styles.container}>
      {props.items.map((item, i) => (
        <_Button
          key={i}
          icon={item.icon}
          filled_icon={item.filled_icon}
          is_active={item.is_active}
          href={item.href}
          title={item.title}
          on_click={item.on_click}
        />
      ))}
    </div>
  )
}