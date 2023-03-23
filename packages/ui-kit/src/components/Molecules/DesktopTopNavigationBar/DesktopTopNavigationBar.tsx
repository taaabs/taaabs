import { Atoms } from '@/components'
import { Icon } from '@/components/Atoms/Icon'
import { Theme } from '@/styles/GlobalStyles'
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
              <Atoms.Logo text={props.user.username} isPrimary={false} />
            ) : (
              <Atoms.Logo text="taaabs" />
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
        <S.right>right</S.right>
      </S.container>
    )
  }

namespace S {
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
        display: inline-flex;
        align-items: center;
        background-color: var(${Theme.COLOR_NEUTRAL_50});
        border-radius: var(${Theme.BORDER_RADIUS_10});
        font-size: 18px;
        font-weight: var(${Theme.FONT_WEIGHT_SEMIBOLD});
        height: var(${Theme.BUTTON_HEIGHT_40});
        padding: 0 10px;
        @media (hover: hover) {
          :hover {
            background-color: var(${Theme.COLOR_NEUTRAL_100});
          }
        }
      `
      export const arrow = styled.div`
        display: flex;
        align-items: center;
        svg {
          width: 8px;
          fill: var(${Theme.COLOR_NEUTRAL_200});
        }
      `
    }
    export const pageTitle = styled.div`
      font-size: 18px;
      font-weight: var(${Theme.FONT_WEIGHT_SEMIBOLD});
    `
  }
  export const right = styled.div`
    display: flex;
    gap: var(${Theme.SPACER_8});
  `
}
