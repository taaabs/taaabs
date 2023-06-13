import { ButtonUnderlined } from '@web-ui/components/Atoms/ButtonUnderlined'
import styles from './NavigationForAppHeader.module.scss'

export namespace NavigationForAppHeaderTypes {
  export type NavigationItem = {
    label: string
    href: string
    isActive: boolean
  }
  export type Props = {
    navigation: NavigationItem[]
  }
}

export const NavigationForAppHeader: React.FC<
  NavigationForAppHeaderTypes.Props
> = ({ navigation }) => {
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
