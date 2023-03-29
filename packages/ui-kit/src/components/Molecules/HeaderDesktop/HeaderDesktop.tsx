import { sharedValues } from '@/constants'
import { Ui } from '@/index'
import { Theme } from '@/styles/GlobalStyles'
import styled from '@emotion/styled'
import { _Logo } from './_Logo'
import { Blurhash } from 'react-blurhash'

export namespace HeaderDesktop {
  export type NavItem = { label: string; href: string; isActive: boolean }
  export type Props = {
    user?: {
      username: string
      displayName: string
      avatar?: {
        url: string
        blurhash: string
      }
    }
    onClickSearch: () => void
    onClickTheme: () => void
    onClickSignIn: () => void
    onClickAdd: () => void
    navItems: NavItem[]
    currentTheme: 'LIGHT' | 'DARK' | 'OS'
  }
}

export const HeaderDesktop: React.FC<HeaderDesktop.Props> = (props) => {
  return (
    <S.container>
      <_Logo userDisplayName={props.user && props.user.displayName} />
      <S.right>
        <S.Right.nav>
          <ul>
            {props.navItems.map((navItem) => (
              <li>
                <Ui.Atoms.ButtonUnderlined
                  href={navItem.href}
                  isActive={navItem.isActive}
                >
                  {navItem.label}
                </Ui.Atoms.ButtonUnderlined>
              </li>
            ))}
          </ul>
        </S.Right.nav>
        <S.Right.circleButton>
          <Ui.Atoms.Icon variant="SEARCH" />
        </S.Right.circleButton>
        <S.Right.circleButton>
          <Ui.Atoms.Icon variant="SUN" />
        </S.Right.circleButton>
        {!props.user ? (
          <Ui.Atoms.Button onClick={props.onClickSignIn}>
            Sign in
          </Ui.Atoms.Button>
        ) : (
          <>
            <S.Right.circleButton>
              {props.user.avatar ? (
                <>
                  <S.Right.blurHash>
                    <Blurhash hash={props.user.avatar.blurhash} />
                  </S.Right.blurHash>
                  <img src={props.user.avatar.url} />
                </>
              ) : (
                <Ui.Atoms.Icon variant="USER" />
              )}
            </S.Right.circleButton>
            <Ui.Atoms.Button onClick={props.onClickAdd}>Add</Ui.Atoms.Button>
          </>
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
        height: ${sharedValues.HEADER_DESKTOP_HEIGHT}px;
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
      position: relative;
      @media (hover: hover) {
        :hover {
          background-color: var(${Theme.COLOR_NEUTRAL_100});
          > img {
            filter: brightness(90%);
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
        transition: var(${Theme.TRANSITION_HOVER});
        z-index: 0;
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
