import React from 'react'
import styles from './FooterLinks.module.scss'

type Props = {
  links: {
    href: string
    text: string
  }[]
  on_link_click: (url: string) => void
}

export const FooterLinks: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      {props.links.map((link, i) => (
        <React.Fragment key={link.href}>
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
        </React.Fragment>
      ))}
    </div>
  )
}