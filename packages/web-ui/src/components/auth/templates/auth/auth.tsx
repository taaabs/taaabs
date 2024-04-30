import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './auth.module.scss'

export namespace Auth {
  export type Props = {
    heading: {
      text: string
      subtext: string
    }
    recaptcha_privacy_notice: React.ReactNode
    children: React.ReactNode
  }
}

export const Auth: React.FC<Auth.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.box}>
          <div className={styles.box__inner__top}>
            <Icon variant="LOGO" />
          </div>
          <div className={styles.box__inner}>
            <div className={styles.box__inner__heading}>
              <h1>{props.heading.text}</h1>
              <div>{props.heading.subtext}</div>
            </div>
            <div>{props.children}</div>
          </div>
        </div>
        <div className={styles.footer}>{props.recaptcha_privacy_notice}</div>
      </div>
    </div>
  )
}
