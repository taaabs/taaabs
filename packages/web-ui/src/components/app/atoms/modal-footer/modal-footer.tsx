import { Button } from '@web-ui/components/common/particles/button'
import styles from './modal-footer.module.scss'

export namespace ModalFooter {
  export type Props = {
    button_label: string
    on_click_cancel: () => void
    is_disabled: boolean
  }
}

export const ModalFooter: React.FC<ModalFooter.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles['container__right-side']}>
        <button
          className={styles['container__right-side__cancel']}
          onClick={() => {
            if (!props.is_disabled) props.on_click_cancel()
          }}
        >
          Cancel
        </button>
        <Button size="medium" type="submit" is_loading={props.is_disabled}>
          {props.button_label}
        </Button>
      </div>
    </div>
  )
}
