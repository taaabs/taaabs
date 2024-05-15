import Link from 'next/link'
import styles from './user-dropdown.module.scss'

export namespace UserDropdown {
  export type Props = {
    on_click_log_out_: () => void
    username_: string
    profile_url_: string
    settings_href_: string
    footer_links_: {
      label_: string
      href_: string
    }[]
    translations_: {
      save_to_taaabs_: string
      theme_: string
      settings_: string
      log_out_: string
    }
  }
}

export const UserDropdown: React.FC<UserDropdown.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <Link href={props.profile_url_}>{`/${props.username_}`}</Link>
      </div>
      <div className={styles.bookmarklet}>
        <a
          onClick={(e) => e.preventDefault()}
          href='javascript:b=document,window.open("https://taaabs.com/#link="+encodeURIComponent(document.location)+"&title="+encodeURIComponent(document.title)+"&note="+(document.querySelector(%27meta[name="description"]%27)!=null?document.querySelector(%27meta[name="description"]%27).content:""))'
        >
          {props.translations_.save_to_taaabs_}
        </a>
      </div>
      {/* <div className={styles.theme}>{props.translations_.theme_}</div> */}
      <div className={styles.menu}>
        <Link href={props.settings_href_} className={styles.menu__item}>
          {props.translations_.settings_}
        </Link>
        <button onClick={props.on_click_log_out_} className={styles.menu__item}>
          {props.translations_.log_out_}
        </button>
      </div>
      <div className={styles.footer}>
        {props.footer_links_.map((link, i) => (
          <Link href={link.href_} key={i} className={styles.footer__link}>
            {link.label_}
          </Link>
        ))}
      </div>
    </div>
  )
}
