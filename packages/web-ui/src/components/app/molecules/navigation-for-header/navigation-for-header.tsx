import { ButtonUnderlined } from '@web-ui/components/app/atoms/button-underlined'
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
            <ButtonUnderlined
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
