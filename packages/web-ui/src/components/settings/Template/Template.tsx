import styles from './Template.module.scss'

export namespace Template {
  export type Props = {
    slot_header: React.ReactNode
    slot_desktop_navigation: React.ReactNode
    slot_mobile_navigation: React.ReactNode
    children: React.ReactNode
  }
}

export const Template: React.FC<Template.Props> = (props) => {
  return (
    <>
      <div className={styles.header}>{props.slot_header}</div>
      {/* Empty div needed by modal's padding-right setting. */}
      <div>
        <div className={styles.content}>
          <div className={styles['content__mobile-nav']}>
            {props.slot_mobile_navigation}
          </div>
          <div className={styles.content__sidebar}>
            <div className={styles.content__sidebar__inner}>
              {props.slot_desktop_navigation}
            </div>
          </div>
          <main className={styles.content__main}>
            <div className={styles.content__main__inner}>{props.children}</div>
          </main>
          <div className={styles.content__aside} />
        </div>
      </div>
    </>
  )
}
