import React from 'react'
import styles from './FooterLinks.module.scss'

type Props = {
  links: {
    href: string
    text: string
  }[]
}

export const FooterLinks: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      {props.links.map((link, i) => (
        <React.Fragment key={link.href}>
          <a href={link.href} target="_blank" rel="noopener noreferrer">
            {link.text}
          </a>
          {i < props.links.length - 1 && <span>·</span>}
        </React.Fragment>
      ))}
    </div>
  )
}
