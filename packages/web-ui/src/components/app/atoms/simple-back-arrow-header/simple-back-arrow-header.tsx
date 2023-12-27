import { Ui } from '@web-ui'
import styles from './simple-back-arrow-header.module.scss'
import Link from 'next/link'
import cn from 'classnames'

export namespace SimpleBackArrowHeader {
  export type Props = {
    title: string
    back_href: string
    is_transparent_on_desktop?: boolean
  }
}

export const SimpleBackArrowHeader: React.FC<SimpleBackArrowHeader.Props> = ({
  is_transparent_on_desktop = false,
  ...props
}) => {
  return (
    <div
      className={cn([
        styles.container,
        {
          [styles['container--is-transparent-on-desktop']]:
            is_transparent_on_desktop,
        },
      ])}
    >
      <Ui.Common.Templates.Wrapper>
        <div className={styles.inner}>
          <Link className={styles['inner__back-arrow']} href={props.back_href}>
            <Ui.Common.Particles.Icon variant="LESS_THAN" />
          </Link>
          <span className={styles.inner__title}>{props.title}</span>
        </div>
      </Ui.Common.Templates.Wrapper>
    </div>
  )
}
