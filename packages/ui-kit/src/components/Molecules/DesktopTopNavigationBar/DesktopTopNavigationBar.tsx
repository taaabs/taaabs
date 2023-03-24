import { Atoms } from '@/components'
import { Icon } from '@/components/Atoms/Icon'
import { Theme } from '@/styles/GlobalStyles'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'

export namespace DesktopTopNavigationBar {
  export type Props = {
    user?: {
      username: string
      displayName: string
      avatarUrl?: string
    }
    pageTitle?: string
    breadcrumbs: Array<{ title: string; link: string }>
    onClickSearch: () => void
    onClickTheme: () => void
    onClickSignIn: () => void
    currentTheme: 'LIGHT' | 'DARK' | 'OS'
  }
}

export const DesktopTopNavigationBar: React.FC<DesktopTopNavigationBar.Props> =
  (props) => {
    return (
      <S.container>
        <S.left>
          <S.Left.logo>
            {props.user ? (
              <Atoms.Logo
                text={props.user.username}
                isPrimary={false}
                isLinkingToHomepage={true}
              />
            ) : (
              <Atoms.Logo text="taaabs" isLinkingToHomepage={true} />
            )}
          </S.Left.logo>
          {props.breadcrumbs.length > 0 && (
            <S.Left.breadcrumbs>
              {props.breadcrumbs.map((item) => (
                <>
                  <S.Left.Breadcrumbs.link href={item.link}>
                    {item.title}
                  </S.Left.Breadcrumbs.link>
                  <S.Left.Breadcrumbs.arrow>
                    <Icon variant={'GREATER_THAN'} />
                  </S.Left.Breadcrumbs.arrow>
                </>
              ))}
            </S.Left.breadcrumbs>
          )}
          {props.pageTitle && (
            <S.Left.pageTitle>{props.pageTitle}</S.Left.pageTitle>
          )}
        </S.left>
        <S.right>
          {!props.user ? (
            <S.Right.guest>
              <S.Right.Guest.nav>
                <ul>
                  <li>
                    <Link href="/about">About</Link>
                  </li>
                  <li>
                    <Link href="/discover">Discover</Link>
                  </li>
                </ul>
              </S.Right.Guest.nav>
              <S.Right.User.button>
                <Icon variant="SEARCH" />
              </S.Right.User.button>
              <S.Right.User.button>
                <Icon variant="SUN" />
              </S.Right.User.button>
              <S.Right.Guest.signInButton onClick={props.onClickSignIn}>
                Sign in
              </S.Right.Guest.signInButton>
            </S.Right.guest>
          ) : (
            <S.Right.user>
              <S.Right.User.button>
                <Icon variant="SEARCH" />
              </S.Right.User.button>
              <S.Right.User.button>
                <Icon variant="SUN" />
              </S.Right.User.button>
              <S.Right.User.button>
                {props.user.avatarUrl ? (
                  <img src={props.user.avatarUrl} />
                ) : (
                  <Icon variant="USER" />
                )}
              </S.Right.User.button>
            </S.Right.user>
          )}
        </S.right>
      </S.container>
    )
  }

namespace S {
  const buttonBase = css`
    display: inline-flex;
    align-items: center;
    border-radius: var(${Theme.BORDER_RADIUS_10});
    font-size: 16px;
    font-weight: var(${Theme.FONT_WEIGHT_INTER_MEDIUM});
    height: var(${Theme.BUTTON_HEIGHT_40});
    padding: 0 10px;
  `
  export const container = styled.div`
    display: flex;
    justify-content: space-between;
  `
  export const left = styled.div`
    display: flex;
    align-items: center;
  `
  export namespace Left {
    export const logo = styled.div`
      margin-right: var(${Theme.SPACER_16});
    `
    export const breadcrumbs = styled.div`
      display: flex;
      gap: var(${Theme.SPACER_8});
      margin-right: var(${Theme.SPACER_8});
    `
    export namespace Breadcrumbs {
      export const link = styled(Link)`
        ${buttonBase}
        background-color: var(${Theme.COLOR_NEUTRAL_50});
        @media (hover: hover) {
          :hover {
            background-color: var(${Theme.COLOR_NEUTRAL_100});
          }
        }
      `
      export const arrow = styled.div`
        display: flex;
        align-items: center;
        & > div svg {
          width: 8px;
          fill: var(${Theme.COLOR_NEUTRAL_200});
        }
      `
    }
    export const pageTitle = styled.div`
      font-size: 16px;
      font-weight: var(${Theme.FONT_WEIGHT_INTER_MEDIUM});
    `
  }
  export const right = styled.div`
    display: flex;
    gap: var(${Theme.SPACER_8});
  `
  export namespace Right {
    export const guest = styled.div`
      display: flex;
      gap: var(${Theme.SPACER_8});
    `
    export namespace Guest {
      export const nav = styled.nav`
        ul {
          display: flex;
        }
        a {
          font-size: var(${Theme.FONT_SIZE_16});
          font-weight: var(${Theme.FONT_WEIGHT_INTER_MEDIUM});
          text-underline-offset: 2px;
          display: flex;
          height: var(${Theme.BUTTON_HEIGHT_40});
          align-items: center;
          padding: 0 var(${Theme.SPACER_8});
          @media (hover: hover) {
            &:hover {
              text-decoration: underline;
              text-decoration-thickness: 1.5px;
            }
          }
        }
      `
      export const signInButton = styled.button`
        ${buttonBase}
        background-color: var(${Theme.COLOR_BRAND});
        color: var(${Theme.COLOR_WHITE});
        @media (hover: hover) {
          &:hover {
            background-color: var(${Theme.COLOR_PRIMARY_900});
          }
        }
      `
    }
    export const user = styled.div`
      display: flex;
      gap: var(${Theme.SPACER_8});
    `
    export namespace User {
      export const button = styled.button`
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
    }
  }
}
