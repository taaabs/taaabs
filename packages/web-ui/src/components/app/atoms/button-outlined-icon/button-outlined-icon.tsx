import { Ui } from '@web-ui'
import styles from './button-outlined-icon.module.scss'

export namespace ButtonOutlinedIcon {
  export type Props = {
    on_click: () => void
    icon_variant: Ui.Common.Particles.Icon.Variant
    test_id?: string
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
    >
      <Ui.Common.Particles.Icon variant={props.icon_variant} />
    </button>
  )
}
