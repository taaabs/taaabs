import styles from './SimpleBackArrowHeader.module.scss'
import Link from 'next/link'
import cn from 'classnames'
import { Wrapper as UiWrapper } from '@web-ui/components/Wrapper'
import { Icon as UiIcon } from '@web-ui/components/Icon'

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
      <UiWrapper>
        <div className={styles.inner}>
          <Link className={styles['inner__back-arrow']} href={props.back_href}>
            <UiIcon variant="LESS_THAN" />
          </Link>
          <span className={styles.inner__title}>{props.title}</span>
        </div>
      </UiWrapper>
    </div>
  )
}
