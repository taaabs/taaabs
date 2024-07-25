import { Button } from '@web-ui/components/common/particles/button'
import styles from './Footer.module.scss'

// Don't suffix properties as the component is used in at least two places.
export namespace Footer {
  export type Props = {
    button_label: string
    button_on_click: () => void
    on_click_cancel: () => void
    is_disabled?: boolean
    is_danger?: boolean
    children?: React.ReactNode
    translations: {
      cancel: string
    }
  }
}

export const Footer: React.FC<Footer.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div>{props.children}</div>
      <div className={styles.container__actions}>
        <Button
          on_click={props.button_on_click}
          is_disabled={props.is_disabled}
          is_danger={props.is_danger}
          auto_focus={true}
        >
          {props.button_label}
        </Button>
        <button
          className={styles.container__actions__cancel}
          onClick={() => {
            if (!props.is_disabled) props.on_click_cancel()
          }}
        >
          {props.translations.cancel}
        </button>
      </div>
    </div>
  )
}
