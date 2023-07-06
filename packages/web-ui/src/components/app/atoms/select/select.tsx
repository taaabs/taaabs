import { Icon } from '@web-ui/components/common/atoms/icon'
import styles from './select.module.scss'
import cn from 'classnames'

export namespace SelectTypes {
  export type Props = {
    label: string
    currentValue: string
    isActive?: boolean
  }
}

export const Select: React.FC<SelectTypes.Props> = (props) => {
  return (
    <div
      className={cn([
        styles.container,
        { [styles['container--toggled']]: props.isActive },
      ])}
    >
      <div className={styles.inner}>
        <span>{props.label}</span>
        <span>{props.currentValue}</span>
      </div>
      <div
        className={cn([
          styles.arrow,
          { [styles['arrow--toggled']]: props.isActive },
        ])}
      >
        <Icon variant="LESS_THAN" />
      </div>
    </div>
  )
}
