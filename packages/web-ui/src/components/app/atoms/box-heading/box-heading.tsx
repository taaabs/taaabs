import styles from './box-heading.module.scss'

export namespace BoxHeading {
  export type Props = {
    heading: React.ReactNode
    subheading?: React.ReactNode
  }
}

export const BoxHeading: React.FC<BoxHeading.Props> = (props) => {
  return (
    <div className={styles.container}>
      <h2>{props.heading}</h2>
      {props.subheading && <p>{props.subheading}</p>}
    </div>
  )
}
