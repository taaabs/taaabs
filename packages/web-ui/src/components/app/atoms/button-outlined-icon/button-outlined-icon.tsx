import { Icon, IconTypes } from '@web-ui/components/common/atoms/icon'
import styles from './button-outlined-icon.module.scss'

export namespace ButtonOutlinedIconTypes {
  export type Props = {
    onClick: () => void
    iconVariant: IconTypes.Variant
    testId?: string
  }
}

export const ButtonOutlinedIcon: React.FC<ButtonOutlinedIconTypes.Props> = (
  props,
) => {
  return (
    <button
      className={styles.button}
      onClick={props.onClick}
      data-testid={props.testId}
    >
      <Icon variant={props.iconVariant} />
    </button>
  )
}
