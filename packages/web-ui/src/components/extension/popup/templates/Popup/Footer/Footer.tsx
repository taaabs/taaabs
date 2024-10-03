import styles from './Footer.module.scss'

export namespace Footer {
  export type Props = {
    items: {
      label: string
      url: string
    }[]
  }
}

export const Footer: React.FC<Footer.Props> = (props) => {
  return (
    <div className={styles.container}>
      {props.items.map((item, i) => (
        <a href={item.url} target={'_blank'} key={i}>
          {item.label}
        </a>
      ))}
    </div>
  )
}
