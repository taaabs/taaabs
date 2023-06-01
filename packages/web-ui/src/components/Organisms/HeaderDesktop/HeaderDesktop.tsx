import { sharedValues } from '@web-ui/constants'
import { Ui } from '@web-ui/index'
import styled from '@emotion/styled'
import { Theme } from '@web-ui/styles/components/GlobalStyles'
import { s } from '@web-ui/styles/constants'
import { LogoForHeader } from '@web-ui/components/Atoms'
import { UserForHeader } from '@web-ui/components/Molecules'

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
    otherUserAccount?: UserForHeader.User
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
            {props.otherUserAccount ? (
              <UserForHeader user={props.otherUserAccount} />
            ) : (
              <LogoForHeader />
            )}
            <_.Top.Left.nav>
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
            </_.Top.Left.nav>
          </_.Top.left>
          <_.Top.right>
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
    export const left = styled.div`
      display: flex;
      align-items: center;
      gap: ${sharedValues.distance[16]}px;
      height: 100%;
    `
    export namespace Left {
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
    export const right = styled.div`
      display: flex;
      align-items: center;
      gap: ${sharedValues.distance[8]}px;
      height: 100%;
    `
  }
}
