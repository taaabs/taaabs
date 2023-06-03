import { sharedValues } from '@web-ui/constants'
import styled from '@emotion/styled'
import { Theme } from '@web-ui/styles/components/GlobalStyles'
import { s } from '@web-ui/styles/constants'
import {
  UserForHeader,
  UserForHeaderTypes,
} from '@web-ui/components/Molecules/UserForHeader'
import { ButtonOutlinedIcon } from '@web-ui/components/Atoms/ButtonOutlinedIcon'
import { Wrapper } from '@web-ui/components/Atoms/Wrapper'
import { LogoForHeader } from '@web-ui/components/Molecules/LogoForHeader'
import { ButtonUnderlined } from '@web-ui/components/Atoms/ButtonUnderlined'
import { Button } from '@web-ui/components/Atoms/Button'

export namespace HeaderDesktopTypes {
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
    otherUserAccount?: UserForHeaderTypes.User
  }
}

export const HeaderDesktop = (props: HeaderDesktopTypes.Props) => {
  const userArea = !props.loggedInUser ? (
    <Button onClick={props.onClickSignIn}>Sign in</Button>
  ) : (
    <ButtonOutlinedIcon
      avatar={props.loggedInUser.avatar}
      iconVariant="USER"
      onClick={() => {}}
    />
  )

  return (
    <_.container>
      <Wrapper>
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
                    <ButtonUnderlined href={link.href} isActive={link.isActive}>
                      {link.label}
                    </ButtonUnderlined>
                  </li>
                ))}
              </ul>
            </_.Top.Left.nav>
          </_.Top.left>
          <_.Top.right>
            <ButtonOutlinedIcon
              iconVariant="SEARCH"
              onClick={props.onClickSearch}
            />
            <ButtonOutlinedIcon
              iconVariant="SUN"
              onClick={props.onClickTheme}
            />
            {userArea}
          </_.Top.right>
        </_.top>
      </Wrapper>
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
