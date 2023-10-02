import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './header.module.scss'
import { Wrapper } from '@web-ui/components/common/particles/wrapper'
import Link from 'next/link'

export namespace Header {
  export type Props = {
    title: string
    back_href: string
  }
}

export const Header: React.FC<Header.Props> = (props) => {
  return (
    <div className={styles.container}>
      <Wrapper>
        <div className={styles.inner}>
          <Link className={styles['inner__back-arrow']} href={props.back_href}>
            <Icon variant="LESS_THAN" />
          </Link>
          <span className={styles.inner__title}>{props.title}</span>
        </div>
      </Wrapper>
    </div>
  )
}
