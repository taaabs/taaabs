import { ButtonUnderlined } from '@web-ui/components/app/atoms/ButtonUnderlined'
import styles from './NavigationForHeader.module.scss'

export namespace NavigationForHeaderTypes {
  export type NavigationItem = {
    label: string
    href: string
    isActive: boolean
  }
  export type Props = {
    navigation: NavigationItem[]
  }
}

export const NavigationForHeader: React.FC<NavigationForHeaderTypes.Props> = ({
  navigation,
}) => {
  return (
    <div className={styles.container}>
      <ul>
        {navigation.map((link) => (
          <li key={link.label}>
            <ButtonUnderlined href={link.href} isActive={link.isActive}>
              {link.label}
            </ButtonUnderlined>
          </li>
        ))}
      </ul>
    </div>
  )
}
