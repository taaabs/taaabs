import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './button-outlined-icon.module.scss'

export namespace ButtonOutlinedIcon {
  export type Props = {
    onClick: () => void
    iconVariant: Icon.Variant
    testId?: string
  }
}

export const ButtonOutlinedIcon: React.FC<ButtonOutlinedIcon.Props> = (
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
