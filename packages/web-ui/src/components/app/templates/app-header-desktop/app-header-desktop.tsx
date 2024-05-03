import { Wrapper } from '@web-ui/components/common/templates/wrapper'
import styles from './app-header-desktop.module.scss'

export namespace AppHeaderDesktop {
  export type Props = {
    slot_logo: React.ReactNode
    slot_navigation: React.ReactNode
    slot_right_side: React.ReactNode
    cockroach_url: string
    translations: {
      powered_by: string
    }
  }
}

export const AppHeaderDesktop = (props: AppHeaderDesktop.Props) => {
  return (
    <div className={styles.container}>
      <Wrapper>
        <div className={styles.inner}>
          <div className={styles.left}>
            {props.slot_logo}
            <a
              href={props.cockroach_url}
              className={styles.cockroachdb}
              target="_blank"
            >
              <img src={'/cockroachdb.png'} />
              <div className={styles.cockroachdb__text}>
                <span>{props.translations.powered_by}</span>
                <span>CockroachDB</span>
              </div>
            </a>
          </div>
          <div className={styles.navigation}>{props.slot_navigation}</div>
          {props.slot_right_side}
        </div>
      </Wrapper>
    </div>
  )
}
