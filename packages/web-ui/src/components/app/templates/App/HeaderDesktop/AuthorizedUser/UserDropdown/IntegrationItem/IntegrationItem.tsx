import styles from './IntegrationItem.module.scss'

type Props = {
  text: string
  subtext: string
  children?: React.ReactNode
}

export const IntegrationItem: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <div
          className={styles.heading__text}
          dangerouslySetInnerHTML={{ __html: props.text }}
        />
        <div className={styles.heading__subtext}>{props.subtext}</div>
      </div>
      {props.children}
    </div>
  )
}
