import styles from './Footer.module.scss'

export namespace Footer {
  export type Props = {
    transaltions: {
      star_on_github: string
      send_feedback: string
    }
    feedback_url: string
  }
}

export const Footer: React.FC<Footer.Props> = (props) => {
  return (
    <div className={styles.container}>
      <a href={'https://github.com/taaabs/taaabs'} target={'_blank'}>
        {props.transaltions.star_on_github}
      </a>
      {'·'}
      <a href={props.feedback_url} target={'_blank'}>
        {props.transaltions.send_feedback}
      </a>
    </div>
  )
}
