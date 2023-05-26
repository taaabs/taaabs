import { sharedValues } from '@/constants'
import { Ui } from '@/index'
import styled from '@emotion/styled'
import { LogoForHeader } from '../../Atoms/LogoForHeader'
import { Theme } from '@/styles/components/GlobalStyles'
import { s } from '@/styles/constants'

export namespace HeaderDesktop {
  export type Navigation = Array<{
    label: string
    href: string
    isActive: boolean
  }>
  export type Props = {
    loggedInUser?: {
      username: string
      displayName?: string
      avatar?: {
        url: string
        blurhash: string
      }
    }
    onClickSearch: () => void
    onClickTheme: () => void
    onClickSignIn: () => void
    onClickAdd: () => void
    navigation: Navigation
    currentTheme: 'LIGHT' | 'DARK'
    viewedUser?: LogoForHeader.User
  }
}

export const HeaderDesktop: React.FC<HeaderDesktop.Props> = (props) => {
  const userArea = !props.loggedInUser ? (
    <Ui.Atoms.Button onClick={props.onClickSignIn}>Sign in</Ui.Atoms.Button>
  ) : (
    <Ui.Atoms.ButtonOutlinedIcon
      avatar={props.loggedInUser.avatar}
      iconVariant="USER"
      onClick={() => {}}
    />
  )

  return (
    <_.container>
      <Ui.Atoms.Wrapper>
        <_.top>
          <_.Top.left>
            <LogoForHeader user={props.viewedUser} />
          </_.Top.left>
          <_.Top.right>
            <_.Top.Right.nav>
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
            </_.Top.Right.nav>
            <Ui.Atoms.ButtonOutlinedIcon
              iconVariant="SEARCH"
              onClick={props.onClickSearch}
            />
            <Ui.Atoms.ButtonOutlinedIcon
              iconVariant="SUN"
              onClick={props.onClickTheme}
            />
            {userArea}
          </_.Top.right>
        </_.top>
      </Ui.Atoms.Wrapper>
    </_.container>
  )
}

namespace _ {
  export const container = styled.div`
    border-bottom: var(${Theme.BORDER_PRIMARY});
    background-color: var(${Theme.HEADER_TRANSPARENT_BACKGROUND});
    ${s.backdropFilter.desktopHeader}
    height: ${sharedValues.headerDesktop}px;
    > div {
      height: 100%;
    }
  `
  export const top = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  `
  export namespace Top {
    export const right = styled.div`
      display: flex;
      align-items: center;
      gap: ${sharedValues.distance[8]}px;
      height: 100%;
    `
    export const left = styled.div`
      display: flex;
      align-items: center;
      gap: ${sharedValues.distance[20]}px;
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
      export const blurHash = styled.div`
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      `
    }
  }
}
