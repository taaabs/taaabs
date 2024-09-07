import styles from './Footer.module.scss'

export namespace Footer {
  export type Props = {
    transaltions: {
      send_feedback: string
    }
    feedback_url: string
  }
}

export const Footer: React.FC<Footer.Props> = (props) => {
  return (
    <div className={styles.container}>
      <a href={props.feedback_url} target={'_blank'}>
        {props.transaltions.send_feedback}
      </a>
    </div>
  )
}
