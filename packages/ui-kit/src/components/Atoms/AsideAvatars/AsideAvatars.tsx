import { Theme } from '@/styles/GlobalStyles'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

export namespace AsideAvatars {
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

export const AsideAvatars: React.FC<AsideAvatars.Props> = (props) => {
  const buildAvatar = (avatar: AsideAvatars.Avatar) =>
    avatar.imageUrl ? (
      <S.inner.avatar.$>
        <S.inner.avatar.withImage.$>
          <img src={avatar.imageUrl} />
        </S.inner.avatar.withImage.$>
        {avatar.isActive && <S.inner.indicator.$ />}
      </S.inner.avatar.$>
    ) : (
      <S.inner.avatar.$>
        <S.inner.avatar.withoutImage.$>
          <span>
            {avatar.displayName
              .split(' ')
              .map((word) => word.substring(0, 1))
              .slice(0, 3)
              .join(' ')}
          </span>
        </S.inner.avatar.withoutImage.$>
        {avatar.isActive && <S.inner.indicator.$ />}
      </S.inner.avatar.$>
    )

  return (
    <S.container.$>
      <SimpleBar style={{ height: '100vh' }} autoHide={false}>
        <S.inner.$>
          <S.inner.logo.$>
            <S.inner.logo.button.$>
              <span>T</span>
              {props.isLogoActive && <S.inner.indicator.$ />}
            </S.inner.logo.button.$>
          </S.inner.logo.$>
          {props.tempAvatar && (
            <S.inner.tempAvatarWrapper.$>
              {buildAvatar(props.tempAvatar)}
            </S.inner.tempAvatarWrapper.$>
          )}
          {props.pinnedAvatars.map((pinnedAvatar) => buildAvatar(pinnedAvatar))}
        </S.inner.$>
      </SimpleBar>
    </S.container.$>
  )
}

namespace S {
  export const container = {
    $: styled.div`
      background-color: var(${Theme.COLOR_WHITE});
      border-right: 1px solid var(${Theme.COLOR_100});
      width: calc(
        var(${Theme.PADDING_8}) * 2 + var(${Theme.BUTTON_HEIGHT_46}) + 1px
      );
    `,
  }
  const avatarBase = css`
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
  export const inner = {
    $: styled.div`
      padding: var(${Theme.PADDING_8}) 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    `,
    indicator: {
      $: styled.div`
        position: absolute;
        height: 22px;
        width: 4px;
        border-top-right-radius: var(${Theme.BORDER_RADIUS_10});
        border-bottom-right-radius: var(${Theme.BORDER_RADIUS_10});
        background-color: var(${Theme.COLOR_ACCENT});
        left: 0;
        top: 0;
        transform: translate(-8px, 50%);
      `,
    },
    logo: {
      $: styled.div`
        border-bottom: 1px solid var(${Theme.COLOR_100});
        padding-bottom: var(${Theme.PADDING_8});
      `,
      button: {
        $: styled.button`
          ${avatarBase}
          background-color: var(${Theme.COLOR_ACCENT});
          & span {
            color: var(${Theme.COLOR_WHITE});
            font-family: var(${Theme.FONT_FAMILY_SERIF});
            font-size: 32px;
          }
          &:hover {
            ${buttonHover}
          }
        `,
      },
    },
    tempAvatarWrapper: {
      $: styled.div`
        background: red;
      `,
    },
    avatar: {
      $: styled.div`
        position: relative;
      `,
      withImage: {
        $: styled.button`
          ${avatarBase}
          overflow: hidden;
          & > img {
            object-fit: cover;
          }
          &:hover {
            ${buttonHover}
          }
        `,
      },
      withoutImage: {
        $: styled.button`
          ${avatarBase}
          outline: 1px solid var(${Theme.COLOR_200});
          outline-offset: -1px;
          & > span {
            font-weight: var(${Theme.FONT_WEIGHT_SEMIBOLD});
            letter-spacing: -0.1rem;
          }
          &:hover {
            outline-color: var(${Theme.COLOR_100});
          }
        `,
      },
    },
  }
}
