import { Fragment } from 'react'
import styles from './FooterLinks.scss'

type Props = {
  links: {
    href: string
    text: string
  }[]
  on_link_click: (url: string) => void
  on_get_help_click: () => void
}

export const FooterLinks: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault()
          props.on_get_help_click()
        }}
      >
        Get help
      </a>
      <div>
        {props.links.map((link, i) => (
          <Fragment key={link.href}>
            <a
              href={link.href}
              onClick={(e) => {
                e.preventDefault()
                props.on_link_click(link.href)
              }}
            >
              {link.text}
            </a>
            {i < props.links.length - 1 && <span>·</span>}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
