import { Icon } from '@web-ui/components/common/atoms/Icon'
import styles from './SearchBox.module.scss'

export namespace SearchBoxTypes {
  export type Props = {
    onClick: () => void
    placeholder: string
  }
}

export const SearchBox: React.FC<SearchBoxTypes.Props> = (props) => {
  return (
    <button className={styles['search-box']} onClick={props.onClick}>
      <Icon variant="SEARCH" />
      <span>{props.placeholder}</span>
    </button>
  )
}
