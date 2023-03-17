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
    <S.Inner.Avatar.Wrapper key={avatar.username}>
      {avatar.imageUrl ? (
        <>
          <S.Inner.Avatar.WithImage>
            <img src={avatar.imageUrl} />
          </S.Inner.Avatar.WithImage>
          {avatar.isActive && <S.Inner.Indicator />}
        </>
      ) : (
        <>
          <S.Inner.Avatar.WithoutImage>
            <span>
              {avatar.displayName
                .split(' ')
                .map((word) => word.substring(0, 1))
                .slice(0, 3)
                .join(' ')}
            </span>
          </S.Inner.Avatar.WithoutImage>
          {avatar.isActive && <S.Inner.Indicator />}
        </>
      )}
    </S.Inner.Avatar.Wrapper>
  )

  return (
    <S.Container>
      <SimpleBar style={{ height: '100vh' }} autoHide={false}>
        <S.Inner.Container>
          <S.Inner.Logo>
            <span>T</span>
            {props.isLogoActive && <S.Inner.Indicator />}
          </S.Inner.Logo>
          {props.tempAvatar && buildAvatar(props.tempAvatar)}
          <S.Inner.Divider />
          {props.pinnedAvatars.map((pinnedAvatar) => buildAvatar(pinnedAvatar))}
        </S.Inner.Container>
      </SimpleBar>
    </S.Container>
  )
}

namespace S {
  export const Container = styled.div`
    background-color: var(${Theme.COLOR_WHITE});
    border-right: 1px solid var(${Theme.COLOR_100});
    width: calc(
      var(${Theme.PADDING_8}) * 2 + var(${Theme.BUTTON_HEIGHT_46}) + 1px
    );
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
    export const Container = styled.div`
      padding: var(${Theme.PADDING_8}) 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    `
    export const Divider = styled.div`
      height: 1px;
      background: var(${Theme.COLOR_200});
      width: var(${Theme.BUTTON_HEIGHT_46});
    `
    export const Indicator = styled.div`
      position: absolute;
      height: 22px;
      width: 4px;
      border-top-right-radius: var(${Theme.BORDER_RADIUS_10});
      border-bottom-right-radius: var(${Theme.BORDER_RADIUS_10});
      background-color: var(${Theme.COLOR_ACCENT});
      left: 0;
      top: 0;
      transform: translate(-8px, 50%);
    `
    export const Logo = styled.button`
      ${buttonBase}
      background-color: var(${Theme.COLOR_ACCENT});
      & span {
        color: var(${Theme.COLOR_WHITE});
        font-family: var(${Theme.FONT_FAMILY_SERIF});
        font-size: 32px;
      }
      &:hover {
        ${buttonHover}
      }
    `
    export namespace Avatar {
      export const Wrapper = styled.div`
        position: relative;
      `
      export const WithImage = styled.button`
        ${buttonBase}
        overflow: hidden;
        & > img {
          object-fit: cover;
        }
        &:hover {
          ${buttonHover}
        }
      `
      export const WithoutImage = styled.button`
        ${buttonBase}
        outline: 1px solid var(${Theme.COLOR_200});
        outline-offset: -1px;
        & > span {
          font-weight: var(${Theme.FONT_WEIGHT_SEMIBOLD});
          letter-spacing: -0.1rem;
        }
        &:hover {
          outline-color: var(${Theme.COLOR_100});
        }
      `
    }
  }
}
