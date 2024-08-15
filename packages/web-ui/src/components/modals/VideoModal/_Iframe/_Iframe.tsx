import styles from './_Iframe.module.scss'

export namespace _Iframe {
  export type Props = {
    src: string
  }
}

export const _Iframe: React.FC<_Iframe.Props> = (props) => {
  return (
    <div className={styles.container}>
      <iframe src={props.src} allow="autoplay; fullscreen" allowFullScreen />
    </div>
  )
}
