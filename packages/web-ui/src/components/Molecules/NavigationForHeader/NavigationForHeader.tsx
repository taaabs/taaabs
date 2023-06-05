import { css } from '@emotion/react'
import { ButtonUnderlined } from '@web-ui/components/Atoms/ButtonUnderlined'

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
    <div
      css={css`
        height: 100%;
        ul {
          height: 100%;
          display: flex;
        }
      `}
    >
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
