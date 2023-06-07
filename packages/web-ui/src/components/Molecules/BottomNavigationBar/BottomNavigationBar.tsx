import { Icon } from '@web-ui/components/Atoms/Icon'
import styles from './BottomNavigationBar.module.scss'

export namespace BottomNavigationBarTypes {
  export type Props = {
    onClickSearch: () => void
    onClickUser: () => void
    onClickAdd: () => void
    onClickNotifications: () => void
    onClickMyLibrary: () => void
  }
}

export const BottomNavigationBar: React.FC<BottomNavigationBarTypes.Props> = (
  props,
) => {
  return (
    <div className={styles.container}>
      <button onClick={props.onClickMyLibrary}>
        <Icon variant="ADD" />
      </button>
      <button onClick={props.onClickNotifications}>
        <Icon variant="SEARCH" />
      </button>
      <button onClick={props.onClickAdd}>
        <Icon variant="NOTIFICATIONS" />
      </button>
      <button onClick={props.onClickUser}>
        <Icon variant="USER" />
      </button>
    </div>
  )
}
