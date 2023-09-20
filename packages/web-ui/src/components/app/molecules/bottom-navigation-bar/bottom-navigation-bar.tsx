import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './bottom-navigation-bar.module.scss'

export namespace BottomNavigationBar {
  export type Props = {
    add_on_click: () => void
    my_library_on_click: () => void
    notifications_on_click: () => void
    search_on_click: () => void
    theme_on_click: () => void
    user_on_click: () => void
  }
}

export const BottomNavigationBar: React.FC<BottomNavigationBar.Props> = (
  props,
) => {
  return (
    <div className={styles.container}>
      <button onClick={props.add_on_click}>
        <Icon variant="ADD" />
      </button>
      <button onClick={props.notifications_on_click}>
        <Icon variant="NOTIFICATIONS" />
      </button>
      <button onClick={props.notifications_on_click}>
        <Icon variant="SEARCH" />
      </button>
      <button onClick={props.theme_on_click}>
        <Icon variant="SUN" />
      </button>
      <button onClick={props.user_on_click}>
        <Icon variant="USER" />
      </button>
    </div>
  )
}
