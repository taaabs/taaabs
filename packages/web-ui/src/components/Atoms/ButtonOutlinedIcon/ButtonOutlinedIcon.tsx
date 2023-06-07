import { Icon, IconTypes } from '../Icon'
import styles from './ButtonOutlinedIcon.module.scss'

export namespace ButtonOutlinedIconTypes {
  export type Props = {
    onClick: () => void
    iconVariant: IconTypes.Variant
  }
}

export const ButtonOutlinedIcon: React.FC<ButtonOutlinedIconTypes.Props> = (
  props,
) => {
  return (
    <button className={styles.button} onClick={props.onClick}>
      <Icon variant={props.iconVariant} />
    </button>
  )
}
