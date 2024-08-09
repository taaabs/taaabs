import { Icon as UiIcon } from '@web-ui/components/Icon'
import styles from './auth.module.scss'
import Link from 'next/link'

export namespace Auth {
  export type Props = {
    logo_href: string
    heading: {
      text: string
      subtext: string
    }
    recaptcha_privacy_notice?: React.ReactNode
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
            <Link href={props.logo_href} className={styles.box__logo__icon}>
              <UiIcon variant="LOGO" />
            </Link>
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
        {props.recaptcha_privacy_notice && (
          <div className={styles.footer}>{props.recaptcha_privacy_notice}</div>
        )}
      </div>
    </div>
  )
}
