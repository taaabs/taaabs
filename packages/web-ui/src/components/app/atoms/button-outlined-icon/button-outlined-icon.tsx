import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './button-outlined-icon.module.scss'

export namespace ButtonOutlinedIcon {
  export type Props = {
    on_click: () => void
    icon_variant: Icon.Variant
    test_id?: string
    aria_label?: string
  }
}

export const ButtonOutlinedIcon: React.FC<ButtonOutlinedIcon.Props> = (
  props,
) => {
  return (
    <button
      className={styles.button}
      onClick={props.on_click}
      data-testid={props.test_id}
      aria-label={props.aria_label}
    >
      <Icon variant={props.icon_variant} />
    </button>
  )
}
