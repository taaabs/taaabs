import styles from './Wrapper.module.scss'
import cn from 'classnames'

export namespace Wrapper {
  export type Props = {
    children?: React.ReactNode
    is_landing_page?: boolean
  }
}

export const Wrapper: React.FC<Wrapper.Props> = (props) => {
  return (
    <div
      className={cn(
        styles.container,
        props.is_landing_page && styles['container--landing'],
      )}
    >
      {props.children}
    </div>
  )
}
