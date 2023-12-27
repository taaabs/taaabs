import { Ui } from '@web-ui'
import styles from './bottom-navigation-bar.module.scss'

export namespace BottomNavigationBar {
  export type Props = {
    home_on_click: () => void
    add_on_click: () => void
    my_library_on_click: () => void
    notifications_on_click: () => void
    search_on_click: () => void
    user_on_click: () => void
  }
}

export const BottomNavigationBar: React.FC<BottomNavigationBar.Props> = (
  props,
) => {
  return (
    <div className={styles.container}>
      <button onClick={props.home_on_click}>
        <Ui.Common.Particles.Icon variant="HOME" />
      </button>

      <button onClick={props.notifications_on_click}>
        <Ui.Common.Particles.Icon variant="SEARCH" />
      </button>

      <button onClick={props.add_on_click}>
        <Ui.Common.Particles.Icon variant="ADD" />
      </button>

      <button onClick={props.notifications_on_click}>
        <Ui.Common.Particles.Icon variant="NOTIFICATIONS" />
      </button>

      <button onClick={props.user_on_click}>
        <Ui.Common.Particles.Icon variant="USER" />
      </button>
    </div>
  )
}
