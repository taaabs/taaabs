import styled from '@emotion/styled'
import { Icon } from '../Icon'
import { Theme } from '@/styles/components/GlobalStyles'
import { Ui } from '@/index'
import { Blurhash } from 'react-blurhash'
import { mq, s } from '@/styles/constants'

export namespace ButtonOutlinedIcon {
  export type Props = {
    onClick: () => void
    iconVariant?: Icon.Variant
    avatar?: {
      url: string
      blurhash: string
    }
  }
}

export const ButtonOutlinedIcon: React.FC<ButtonOutlinedIcon.Props> = (
  props,
) => {
  return (
    <_.circleButton onClick={props.onClick}>
      {props.avatar && (
        <>
          {props.avatar && (
            <_.CicrleButton.blurHash>
              <Blurhash hash={props.avatar.blurhash} />
            </_.CicrleButton.blurHash>
          )}
          <img src={props.avatar.url} />
        </>
      )}
      {!props.avatar && props.iconVariant && (
        <Ui.Atoms.Icon variant={props.iconVariant} />
      )}
    </_.circleButton>
  )
}

namespace _ {
  export const circleButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: var(${Theme.BORDER_SECONDARY});
    overflow: hidden;
    position: relative;
    ${s.buttonSize[34]}
    ${mq.at992} {
      ${s.buttonSize[40]}
    }
    @media (hover: hover) {
      :hover {
        background-color: var(${Theme.COLOR_NEUTRAL_50});
        border-color: var(${Theme.COLOR_BORDER_PRIMARY});
        > img {
          filter: brightness(90%);
        }
      }
    }
    > div > svg {
      height: 16px;
      ${mq.at992} {
        height: 20px;
      }
    }
    :has(img) {
      border: none;
    }
    > img {
      width: 100%;
      height: 100%;
      ${s.transition[100]('all')};
      z-index: 0;
    }
  `
  export namespace CicrleButton {
    export const blurHash = styled.div`
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    `
  }
}
