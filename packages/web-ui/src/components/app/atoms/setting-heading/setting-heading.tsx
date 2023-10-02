import styles from './setting-heading.module.scss'

export namespace SettingHeading {
  export type Props = {
    heading: string
    subheading: string
  }
}

export const SettingHeading: React.FC<SettingHeading.Props> = (props) => {
  return (
    <div className={styles.container}>
      <h2>{props.heading}</h2>
      <p>{props.subheading}</p>
    </div>
  )
}
