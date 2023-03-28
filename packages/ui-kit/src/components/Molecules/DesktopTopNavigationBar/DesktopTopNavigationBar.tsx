import { ButtonUnderlined } from '@/components/Atoms/ButtonUnderlined/ButtonUnderlined'
import { Icon } from '@/components/Atoms/Icon'
import { sharedValues } from '@/constants'
import { Theme } from '@/styles/GlobalStyles'
import styled from '@emotion/styled'
import { _Logo } from './_components/_Logo'

export namespace DesktopTopNavigationBar {
  export type NavItem = { label: string; href: string; isActive: boolean }
  export type Props = {
    user?: {
      username: string
      displayName: string
      avatarUrl?: string
    }
    onClickSearch: () => void
    onClickTheme: () => void
    onClickSignIn: () => void
    navItems: NavItem[]
    currentTheme: 'LIGHT' | 'DARK' | 'OS'
  }
}

export const DesktopTopNavigationBar: React.FC<DesktopTopNavigationBar.Props> =
  (props) => {
    return (
      <S.container>
        <_Logo username={props.user && props.user.username} />
        <S.right>
          <S.Right.nav>
            <ul>
              {props.navItems.map((navItem) => (
                <li>
                  <ButtonUnderlined
                    href={navItem.href}
                    isActive={navItem.isActive}
                  >
                    {navItem.label}
                  </ButtonUnderlined>
                </li>
              ))}
            </ul>
          </S.Right.nav>
          <S.Right.circleButton>
            <Icon variant="SEARCH" />
          </S.Right.circleButton>
          <S.Right.circleButton>
            <Icon variant="SUN" />
          </S.Right.circleButton>
          {!props.user ? (
            <S.Right.signInButton onClick={props.onClickSignIn}>
              Sign in
            </S.Right.signInButton>
          ) : (
            <S.Right.circleButton>
              {props.user.avatarUrl ? (
                <img src={props.user.avatarUrl} />
              ) : (
                <Icon variant="USER" />
              )}
            </S.Right.circleButton>
          )}
        </S.right>
      </S.container>
    )
  }

namespace S {
  export const container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `
  export const right = styled.div`
    display: flex;
    align-items: center;
    gap: var(${Theme.SPACER_8});
  `
  export namespace Right {
    export const nav = styled.nav`
      ul {
        display: flex;
      }
      li {
        height: ${sharedValues.DESKTOP_TOP_NAVIGATION_BAR_HEIGHT}px;
      }
    `
    export const circleButton = styled.button`
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(${Theme.COLOR_NEUTRAL_50});
      width: var(${Theme.BUTTON_HEIGHT_40});
      height: var(${Theme.BUTTON_HEIGHT_40});
      border-radius: 50%;
      overflow: hidden;
      @media (hover: hover) {
        &:hover {
          background-color: var(${Theme.COLOR_NEUTRAL_100});
          & > img {
            opacity: 0.8;
          }
        }
      }
      & > div svg {
        height: 20px;
        width: 20px;
      }
      & > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: var(${Theme.TRANSITION_HOVER});
      }
    `
    export const signInButton = styled.button`
      display: inline-flex;
      align-items: center;
      border-radius: var(${Theme.BORDER_RADIUS_10});
      font-size: 16px;
      font-weight: var(${Theme.FONT_WEIGHT_INTER_MEDIUM});
      height: var(${Theme.BUTTON_HEIGHT_40});
      padding: 0 10px;
      background-color: var(${Theme.COLOR_BRAND});
      color: var(${Theme.COLOR_WHITE});
      @media (hover: hover) {
        &:hover {
          background-color: var(${Theme.COLOR_PRIMARY_900});
        }
      }
    `
  }
}
