import styles from './heading-with-subheading.module.scss'

export namespace HeadingWithSubheading {
  export type Props = {
    heading: React.ReactNode
    subheading?: React.ReactNode
  }
}

export const HeadingWithSubheading: React.FC<HeadingWithSubheading.Props> = (
  props,
) => {
  return (
    <div className={styles.container}>
      <h1>{props.heading}</h1>
      {props.subheading && <p>{props.subheading}</p>}
    </div>
  )
}
