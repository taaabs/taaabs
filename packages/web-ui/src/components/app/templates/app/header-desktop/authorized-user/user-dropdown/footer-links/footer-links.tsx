import styles from './footer-links.module.scss'
import Link from 'next/link'

export namespace FooterLinks {
  export type Props = {
    links_: { label_: string; href_: string }[]
  }
}

export const FooterLinks: React.FC<FooterLinks.Props> = (props) => {
  return (
    <div className={styles.container}>
      {props.links_.map((link, i) => (
        <Link href={link.href_} key={i} className={styles.link}>
          {link.label_}
        </Link>
      ))}
    </div>
  )
}
