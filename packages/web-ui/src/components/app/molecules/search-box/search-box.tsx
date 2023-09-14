import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './search-box.module.scss'

export namespace SearchBox {
  export type Props = {
    on_click: () => void
    placeholder: string
  }
}

export const SearchBox: React.FC<SearchBox.Props> = (props) => {
  return (
    <button className={styles['search-box']} onClick={props.on_click}>
      <Icon variant="SEARCH" />
      <span>{props.placeholder}</span>
    </button>
  )
}
