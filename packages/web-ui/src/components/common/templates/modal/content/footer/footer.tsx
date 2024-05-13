import { Button } from '@web-ui/components/common/particles/button'
import styles from './footer.module.scss'

export namespace Footer {
  export type Props = {
    button_label: string
    button_on_click?: () => void
    on_click_cancel: () => void
    is_disabled: boolean
    translations: {
      cancel: string
    }
  }
}

export const Footer: React.FC<Footer.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles['container__right-side']}>
        {props.button_on_click ? (
          <Button
            on_click={props.button_on_click}
            is_disabled={props.is_disabled}
          >
            {props.button_label}
          </Button>
        ) : (
          <Button type="submit" is_disabled={props.is_disabled}>
            {props.button_label}
          </Button>
        )}
        <button
          className={styles['container__right-side__cancel']}
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
