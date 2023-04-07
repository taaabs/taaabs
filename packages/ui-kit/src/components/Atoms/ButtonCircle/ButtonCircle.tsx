import styled from '@emotion/styled'
import { Icon } from '../Icon'
import { Theme } from '@/styles/GlobalStyles'
import { Ui } from '@/index'
import { Blurhash } from 'react-blurhash'
import { mq } from '@/styles/mediaQueries'

export namespace ButtonCircle {
  export type Props = {
    iconVariant: Icon.Variant
    onClick?: () => void
    imageUrl?: string
    blurhash?: string
  }
}

export const ButtonCircle: React.FC<ButtonCircle.Props> = (props) => {
  return (
    <S.circleButton>
      {props.imageUrl ? (
        <>
          {props.blurhash && (
            <S.CicrleButton.blurHash>
              <Blurhash hash={props.blurhash} />
            </S.CicrleButton.blurHash>
          )}
          <img src={props.imageUrl} />
        </>
      ) : (
        <Ui.Atoms.Icon variant={props.iconVariant} />
      )}
    </S.circleButton>
  )
}

namespace S {
  export const circleButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: var(${Theme.BORDER_SECONDARY});
    overflow: hidden;
    position: relative;
    width: var(${Theme.BUTTON_HEIGHT_34});
    height: var(${Theme.BUTTON_HEIGHT_34});
    ${mq.at992} {
      width: var(${Theme.BUTTON_HEIGHT_40});
      height: var(${Theme.BUTTON_HEIGHT_40});
    }
    @media (hover: hover) {
      :hover {
        background-color: var(${Theme.COLOR_NEUTRAL_50});
        border-color: var(${Theme.COLOR_NEUTRAL_50});
        > img {
          filter: brightness(90%);
        }
      }
    }
    > div > svg {
      height: 16px;
      width: 16px;
      ${mq.at992} {
        height: 20px;
        width: 20px;
      }
    }
    :has(img) {
      border: none;
    }
    > img {
      width: 100%;
      height: 100%;
      transition: var(${Theme.TRANSITION_HOVER});
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
