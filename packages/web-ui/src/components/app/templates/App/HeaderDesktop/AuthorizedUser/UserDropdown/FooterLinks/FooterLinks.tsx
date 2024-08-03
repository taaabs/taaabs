import styles from './FooterLinks.module.scss'
import Link from 'next/link'

export namespace FooterLinks {
  export type Props = {
    links: { label: string; href: string }[]
  }
}

export const FooterLinks: React.FC<FooterLinks.Props> = (props) => {
  return (
    <div className={styles.container}>
      {props.links.map((link, i) => (
        <Link href={link.href} key={i} className={styles.link}>
          {link.label}
        </Link>
      ))}
    </div>
  )
}
