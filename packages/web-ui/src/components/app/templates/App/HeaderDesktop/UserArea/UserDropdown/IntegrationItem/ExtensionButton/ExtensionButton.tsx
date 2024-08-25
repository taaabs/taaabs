import { Icon as UiIcon } from '@web-ui/components/Icon'
import styles from './ExtensionButton.module.scss'

type Props = {
  icon: UiIcon.Variant
  text: string
  subtext: string
  href: string
}

export const ExtensionButton: React.FC<Props> = (props) => {
  return (
    <a href={props.href} target="_blank" className={styles.button}>
      <UiIcon variant={props.icon} />
      <div className={styles.text}>
        <div className={styles.text__top}>{props.text}</div>
        <div className={styles.text__bottom}>{props.subtext}</div>
      </div>
    </a>
  )
}
