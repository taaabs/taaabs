import { Icon as UiIcon } from '@web-ui/components/Icon'
import styles from './_IconButton.module.scss'

export namespace _IconButton {
  export type Props = {
    on_click: () => void
    icon_variant: Icon.Variant
    test_id?: string
    aria_label?: string
  }
}

export const _IconButton: React.FC<_IconButton.Props> = (props) => {
  return (
    <button
      className={styles.button}
      onClick={props.on_click}
      data-testid={props.test_id}
      aria-label={props.aria_label}
    >
      <UiIcon variant={props.icon_variant} />
    </button>
  )
}
