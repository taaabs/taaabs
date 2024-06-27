import styles from './StandardSection.module.scss'
import cn from 'classnames'

export namespace StandardSection {
  export type Props = {
    heading: {
      text: string
      subtext?: React.ReactNode
    }
    is_danger?: boolean
    children: React.ReactNode
  }
}

export const StandardSection: React.FC<StandardSection.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div
        className={cn(styles.heading, {
          [styles['heading--danger']]: props.is_danger,
        })}
      >
        <h1>{props.heading.text}</h1>
        {props.heading.subtext && (
          <p dangerouslySetInnerHTML={{ __html: props.heading.subtext }} />
        )}
      </div>
      {props.children}
    </div>
  )
}
