import { Icon, LogoForHeader } from '@/components/Atoms'
import { sharedValues } from '@/constants'
import { Ui } from '@/index'
import { Theme } from '@/styles/components/GlobalStyles'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

export namespace HeaderMobile {
  export type Navigation = Array<{
    label: string
    href: string
    isActive: boolean
  }>
  export type Props = {
    hamburgerIsToggled: boolean
    onClickHamburger: () => void
    onClickTheme: () => void
    currentTheme: 'LIGHT' | 'DARK'
    viewedUser?: LogoForHeader.User
    navigation: Navigation
  }
}

export const HeaderMobile: React.FC<HeaderMobile.Props> = (props) => {
  return (
    <_.container>
      <Ui.Atoms.LogoForHeader user={props.viewedUser} />
      <_.right>
        <_.Right.nav>
          <ul>
            {props.navigation.map((link) => (
              <li key={link.label}>
                <Ui.Atoms.ButtonUnderlined
                  href={link.href}
                  isActive={link.isActive}
                >
                  {link.label}
                </Ui.Atoms.ButtonUnderlined>
              </li>
            ))}
          </ul>
        </_.Right.nav>
      </_.right>
    </_.container>
  )
}

namespace _ {
  export const container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: ${sharedValues.distance[16]}px;
    padding-right: ${sharedValues.distance[10]}px;
    border-bottom: var(${Theme.BORDER_PRIMARY});
    height: ${sharedValues.headerMobile}px;
    background-color: var(${Theme.HEADER_BACKGROUND});
  `
  export const right = styled.div`
    display: flex;
    height: 100%;
  `
  export namespace Right {
    export const nav = styled.nav`
      height: 100%;
      ul {
        height: 100%;
        display: flex;
      }
      li {
        height: 100%;
      }
    `
  }
}
