import { Theme } from '@/styles/GlobalStyles'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css';

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
      <Styled.Inner.Avatar.WithImage.$>
        <img src={avatar.imageUrl} />
        {avatar.isActive && <Styled.Inner.Indicator.$ />}
      </Styled.Inner.Avatar.WithImage.$>
    ) : (
      <Styled.Inner.Avatar.WithoutImage.$>
        <span>
          {avatar.displayName
            .split(' ')
            .map((word) => word.substring(0, 1))
            .slice(0, 3)
            .join(' ')}
        </span>
        {avatar.isActive && <Styled.Inner.Indicator.$ />}
      </Styled.Inner.Avatar.WithoutImage.$>
    )

  return (
    <Styled.Container.$>
      <SimpleBar style={{ height: '100vh' }} autoHide={false}>
        <Styled.Inner.$>
          <Styled.Inner.Logo.$>
            <span>T</span>
            {props.isLogoActive && <Styled.Inner.Indicator.$ />}
          </Styled.Inner.Logo.$>
          {props.tempAvatar && (
            <Styled.Inner.TempAvatarWrapper.$>
              {buildAvatar(props.tempAvatar)}
            </Styled.Inner.TempAvatarWrapper.$>
          )}
          {props.pinnedAvatars.map((pinnedAvatar) => buildAvatar(pinnedAvatar))}
        </Styled.Inner.$>
      </SimpleBar>
    </Styled.Container.$>
  )
}

namespace Styled {
  export const Container = {
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
    position: relative;
    transition: var(${Theme.TRANSITION_HOVER});
  `
  const buttonHover = css`
    @media (hover: hover) {
      transform: scale(0.96);
    }
  `
  export const Inner = {
    $: styled.div`
      padding: var(${Theme.PADDING_8}) 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    `,
    Indicator: {
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
    Logo: {
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
    TempAvatarWrapper: {
      $: styled.div`
        border-top: 1px solid var(${Theme.COLOR_100});
        border-bottom: 1px solid var(${Theme.COLOR_100});
        padding: var(${Theme.PADDING_8}) 0;
      `,
    },
    Avatar: {
      WithImage: {
        $: styled.button`
          ${avatarBase}
          & > img {
            object-fit: cover;
          }
        `,
      },
      WithoutImage: {
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
