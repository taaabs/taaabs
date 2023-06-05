import styled from '@emotion/styled'
import { Theme } from '@web-ui/styles/components/GlobalStyles'
import { Blurhash } from 'react-blurhash'
import { styles } from '@web-ui/styles/constants'

export namespace ButtonAvatarTypes {
  export type Props = {
    onClick: () => void
    url: string
    blurhash: string
  }
}

export const ButtonAvatar: React.FC<ButtonAvatarTypes.Props> = (props) => {
  return (
    <_.container onClick={props.onClick}>
      <_.blurHash>
        <Blurhash hash={props.blurhash} />
      </_.blurHash>
      <img src={props.url} />
    </_.container>
  )
}

namespace _ {
  export const container = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    ${styles.transition[100]('all')}
    ${styles.buttonSize[40]}
    @media (hover: hover) {
      :hover {
        background-color: var(${Theme.BUTTON_OUTLINED_ICON_BACKGROUND_HOVER});
        border-color: var(${Theme.BORDER_COLOR_PRIMARY});
        > img {
          filter: brightness(90%);
        }
      }
    }
    :has(img) {
      border: none;
    }
    > img {
      width: 100%;
      height: 100%;
      ${styles.transition[100]('all')};
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
