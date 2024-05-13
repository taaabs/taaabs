import { Button } from '@web-ui/components/common/particles/button'
import styles from './footer.module.scss'

export namespace Footer {
  export type Props = {
    button_label_: string
    button_on_click_?: () => void
    on_click_cancel_: () => void
    is_disabled_: boolean
    translations_: {
      cancel_: string
    }
  }
}

export const Footer: React.FC<Footer.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles['container__right-side']}>
        {props.button_on_click_ ? (
          <Button
            on_click={props.button_on_click_}
            is_disabled={props.is_disabled_}
          >
            {props.button_label_}
          </Button>
        ) : (
          <Button type="submit" is_disabled={props.is_disabled_}>
            {props.button_label_}
          </Button>
        )}
        <button
          className={styles['container__right-side__cancel']}
          onClick={(e) => {
            e.preventDefault() // As this component is likely placed inside <form>, we need to prevent the default form submission.
            if (!props.is_disabled_) props.on_click_cancel_()
          }}
        >
          {props.translations_.cancel_}
        </button>
      </div>
    </div>
  )
}
