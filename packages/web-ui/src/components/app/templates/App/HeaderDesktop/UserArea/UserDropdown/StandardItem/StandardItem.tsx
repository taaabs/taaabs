import Link from 'next/link'
import styles from './StandardItem.module.scss'

export namespace StandardItem {
  export type Props = {
    label: string
    on_click?: () => void
    href?: string
  }
}

export const StandardItem: React.FC<StandardItem.Props> = (props) => {
  if (props.on_click) {
    return (
      <button className={styles.container} onClick={props.on_click}>
        {props.label}
      </button>
    )
  } else if (props.href) {
    return (
      <Link className={styles.container} href={props.href!}>
        {props.label}
      </Link>
    )
  } else {
    return <div>[StandardItem] Invalid component usage.</div>
  }
}
