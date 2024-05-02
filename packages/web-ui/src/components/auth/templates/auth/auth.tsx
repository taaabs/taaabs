import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './auth.module.scss'
import Link from 'next/link'

export namespace Auth {
  export type Props = {
    heading: {
      text: string
      subtext: string
    }
    recaptcha_privacy_notice: React.ReactNode
    switch_form: {
      text: string
      link_label: string
      link_href: string
    }
    children: React.ReactNode
  }
}

export const Auth: React.FC<Auth.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.box}>
          <div className={styles.box__logo}>
            <Icon variant="LOGO" />
          </div>
          <div className={styles.box__heading}>
            <h1>{props.heading.text}</h1>
            <div>{props.heading.subtext}</div>
          </div>
          <div className={styles.box__form}>{props.children}</div>
          <div className={styles['box__switch-form']}>
            <div>
              <span>{props.switch_form.text} </span>
              <Link href={props.switch_form.link_href}>
                {props.switch_form.link_label}
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.footer}>{props.recaptcha_privacy_notice}</div>
      </div>
    </div>
  )
}
