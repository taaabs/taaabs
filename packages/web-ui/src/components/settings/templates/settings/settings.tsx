import { Wrapper } from '@web-ui/components/common/particles/wrapper'
import styles from './settings.module.scss'

export namespace Settings {
  export type Props = {
    headerSlot: React.ReactNode
    mainSlot: React.ReactNode
    desktopNavigationSlot: React.ReactNode
    mobileNavigationSlot: React.ReactNode
  }
}

export const Settings: React.FC<Settings.Props> = (props) => {
  return (
    <>
      <div className={styles.header}>{props.headerSlot}</div>
      <Wrapper>
        <div className={styles.content}>
          <div className={styles['content__mobile-nav']}>
            {props.mobileNavigationSlot}
          </div>
          <div className={styles.content__sidebar}>
            <div className={styles.content__sidebar__inner}>
              {props.desktopNavigationSlot}
            </div>
          </div>
          <div className={styles.content__main}>{props.mainSlot}</div>
          <div className={styles.content__aside} />
        </div>
      </Wrapper>
    </>
  )
}
