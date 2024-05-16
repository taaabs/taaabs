import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './bookmarklet.module.scss'

type Props = {
  text: string
  subtext: string
  button_label: string
}

const script = `javascript:b=document,window.open("https://taaabs.com/#link="+encodeURIComponent(document.location)+"&title="+encodeURIComponent(document.title)+"&note="+(document.querySelector(%27meta[name="description"]%27)!=null?document.querySelector(%27meta[name="description"]%27).content:""))`

export const Bookmarklet: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <div
          className={styles.heading__text}
          dangerouslySetInnerHTML={{ __html: props.text }}
        />
        <div className={styles.heading__subtext}>{props.subtext}</div>
      </div>
      <div className={styles.button}>
        <div
          dangerouslySetInnerHTML={{
            __html: `<a href='${script}' target='_blank' onclick="event.preventDefault();">${props.button_label}</a>`,
          }}
        />
        <Icon variant="LOGO" />
      </div>
    </div>
  )
}
