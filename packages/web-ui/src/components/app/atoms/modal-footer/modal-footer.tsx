import { Button } from '@web-ui/components/common/particles/button'
import styles from './modal-footer.module.scss'

export namespace ModalFooter {
  export type Props = {
    button_label: string
    button_on_click?: () => void
    on_click_cancel: () => void
    is_disabled: boolean
    translations_: {
      cancel_: string
    }
  }
}

export const ModalFooter: React.FC<ModalFooter.Props> = (props) => {
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
          onClick={(e) => {
            e.preventDefault() // As this component is likely placed inside <form>, we need to prevent the default form submission.
            if (!props.is_disabled) props.on_click_cancel()
          }}
        >
          {props.translations_.cancel_}
        </button>
      </div>
    </div>
  )
}
