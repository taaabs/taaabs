import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './ExtensionButton.module.scss'

type Props = {
  icon: Icon.Variant
  text: string
  subtext: string
  href: string
}

export const ExtensionButton: React.FC<Props> = (props) => {
  return (
    <a href={props.href} target="_blank" className={styles.button}>
      <Icon variant={props.icon} />
      <div className={styles.text}>
        <div className={styles.text__top}>{props.text}</div>
        <div className={styles.text__bottom}>{props.subtext}</div>
      </div>
    </a>
  )
}
