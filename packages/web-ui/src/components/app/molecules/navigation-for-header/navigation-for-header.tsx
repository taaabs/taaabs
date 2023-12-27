import { Ui } from '@web-ui'
import styles from './navigation-for-header.module.scss'

export namespace NavigationForHeader {
  export type NavigationItem = {
    label: string
    href: string
    is_active: boolean
  }
  export type Props = {
    navigation: NavigationItem[]
  }
}

export const NavigationForHeader: React.FC<NavigationForHeader.Props> = ({
  navigation,
}) => {
  return (
    <div className={styles.container}>
      <ul>
        {navigation.map((link) => (
          <li key={link.label}>
            <Ui.App.Atoms.ButtonUnderlined
              href={link.href}
              is_active={link.is_active}
              label={link.label}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
