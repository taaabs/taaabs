import { Icon } from '@web-ui/components/Icon'
import styles from './HeaderVision.module.scss'

export namespace HeaderVision {
  export type Props = {
    back_button_on_click: () => void
    image: string
    translations: {
      title: string
    }
  }
}

export const HeaderVision: React.FC<HeaderVision.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div
        role="button"
        className={styles.back}
        onClick={props.back_button_on_click}
      >
        <Icon variant="LESS_THAN" />
      </div>
      <div className={styles.title}>{props.translations.title}</div>
      <div className={styles.image}>
        <img src={props.image} />
      </div>
    </div>
  )
}
