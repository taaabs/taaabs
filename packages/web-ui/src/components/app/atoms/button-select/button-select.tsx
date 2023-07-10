import { Icon } from '@web-ui/components/common/atoms/icon'
import styles from './button-select.module.scss'
import cn from 'classnames'

export namespace ButtonSelect {
  export type Props = {
    label: string
    currentValue: string
    isActive?: boolean
    onClick: () => void
  }
}

export const ButtonSelect: React.FC<ButtonSelect.Props> = (props) => {
  return (
    <button
      className={cn([
        styles.container,
        { [styles['container--toggled']]: props.isActive },
      ])}
      onClick={props.onClick}
    >
      <div className={styles.inner}>
        <div>{props.label}</div>
        <div>{props.currentValue}</div>
      </div>
      <div className={styles.arrow}>
        <Icon variant="LESS_THAN" />
      </div>
    </button>
  )
}
