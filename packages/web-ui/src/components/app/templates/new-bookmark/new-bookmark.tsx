import { Ui } from '@web-ui'
import styles from './new-bookmark.module.scss'

export namespace NewBookmark {
  export type Props = {
    slot_header: React.ReactNode
    children?: React.ReactNode
    slot_footer: React.ReactNode
  }
}

export const NewBookmark: React.FC<NewBookmark.Props> = (props) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>{props.slot_header}</div>
        <main className={styles.main}>{props.children}</main>
        <div className={styles.footer}>
          <Ui.Common.Templates.Wrapper>
            <div className={styles.footer__inner}>{props.slot_footer}</div>
          </Ui.Common.Templates.Wrapper>
        </div>
      </div>
    </>
  )
}
