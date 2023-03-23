import { Theme } from '@/styles/GlobalStyles'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

export namespace QuickAccessPanel {
  export type Avatar = {
    imageUrl?: string
    username: string
    displayName: string
    isActive: boolean
  }
  export type Props = {
    isLogoActive: boolean
    tempAvatar?: Avatar
    pinnedAvatars: Avatar[]
  }
}

export const QuickAccessPanel: React.FC<QuickAccessPanel.Props> = (props) => {
  const buildAvatar = (avatar: QuickAccessPanel.Avatar) => (
    <S.Inner.avatar key={avatar.username}>
      {avatar.imageUrl ? (
        <>
          <S.Inner.Avatar.withImage>
            <img src={avatar.imageUrl} />
          </S.Inner.Avatar.withImage>
          {avatar.isActive && <S.Inner.indicator />}
        </>
      ) : (
        <>
          <S.Inner.Avatar.withoutImage>
            <span>
              {avatar.displayName
                .split(' ')
                .map((word) => word.substring(0, 1))
                .slice(0, 3)
                .join(' ')}
            </span>
          </S.Inner.Avatar.withoutImage>
          {avatar.isActive && <S.Inner.indicator />}
        </>
      )}
    </S.Inner.avatar>
  )

  return (
    <S.container>
      <SimpleBar style={{ height: '100vh' }} autoHide={false}>
        <S.inner>
          <S.Inner.logo>
            <span>T</span>
            {props.isLogoActive && <S.Inner.indicator />}
          </S.Inner.logo>
          {props.tempAvatar && buildAvatar(props.tempAvatar)}
          <S.Inner.divider />
          {props.pinnedAvatars.map((pinnedAvatar) => buildAvatar(pinnedAvatar))}
        </S.inner>
      </SimpleBar>
    </S.container>
  )
}

namespace S {
  export const container = styled.div`
    background-color: var(${Theme.COLOR_WHITE});
    border-right: 1px solid var(${Theme.COLOR_NEUTRAL_50});
    width: calc(
      var(${Theme.SPACER_8}) * 2 + var(${Theme.BUTTON_HEIGHT_46}) + 1px
    );
  `
  export const inner = styled.div`
    padding: var(${Theme.SPACER_8}) 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  `
  export namespace Inner {
    const buttonBase = css`
      width: var(${Theme.BUTTON_HEIGHT_46});
      height: var(${Theme.BUTTON_HEIGHT_46});
      border-radius: var(${Theme.BORDER_RADIUS_10});
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(${Theme.TRANSITION_HOVER});
    `
    const buttonHover = css`
      @media (hover: hover) {
        transform: scale(0.96);
      }
    `
    export const divider = styled.div`
      height: 1px;
      background: var(${Theme.COLOR_NEUTRAL_200});
      width: 28px;
    `
    export const indicator = styled.div`
      position: absolute;
      height: 22px;
      width: 4px;
      border-top-right-radius: var(${Theme.BORDER_RADIUS_10});
      border-bottom-right-radius: var(${Theme.BORDER_RADIUS_10});
      background-color: var(${Theme.COLOR_PRIMARY_900});
      left: 0;
      top: 0;
      transform: translate(-8px, 50%);
    `
    export const logo = styled.button`
      ${buttonBase}
      background-color: var(${Theme.COLOR_PRIMARY_900});
      & span {
        color: var(${Theme.COLOR_WHITE});
        font-family: var(${Theme.FONT_FAMILY_SPACE_GROTESK});
        font-size: 32px;
      }
      &:hover {
        ${buttonHover}
      }
    `
    export const avatar = styled.div`
      position: relative;
    `
    export namespace Avatar {
      export const withImage = styled.button`
        ${buttonBase}
        overflow: hidden;
        & > img {
          object-fit: cover;
        }
        &:hover {
          ${buttonHover}
        }
      `
      export const withoutImage = styled.button`
        ${buttonBase}
        outline: 1px solid var(${Theme.COLOR_NEUTRAL_200});
        outline-offset: -1px;
        & > span {
          font-weight: var(${Theme.FONT_WEIGHT_INTER_SEMIBOLD});
          letter-spacing: -0.1rem;
        }
        &:hover {
          outline-color: var(${Theme.COLOR_NEUTRAL_50});
        }
      `
    }
  }
}
