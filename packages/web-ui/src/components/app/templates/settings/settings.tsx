import styles from './settings.module.scss'

export namespace Settings {
  export type Props = {
    slot_header: React.ReactNode
    slot_main: React.ReactNode
    slot_desktop_navigation: React.ReactNode
    slot_mobile_navigation: React.ReactNode
  }
}

export const Settings: React.FC<Settings.Props> = (props) => {
  return (
    <>
      <div className={styles.header}>{props.slot_header}</div>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles['content__mobile-nav']}>
            {props.slot_mobile_navigation}
          </div>
          <div className={styles.content__sidebar}>
            <div className={styles.content__sidebar__inner}>
              {props.slot_desktop_navigation}
            </div>
          </div>
          <main className={styles.content__main}>{props.slot_main}</main>
          <div className={styles.content__aside} />
        </div>
      </div>
    </>
  )
}
