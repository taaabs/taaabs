import styled from '@emotion/styled'
import { Icon } from '@web-ui/components/Atoms/Icon'
import { sharedValues } from '@web-ui/constants'
import { Theme } from '@web-ui/styles/components/GlobalStyles'
import { styles } from '@web-ui/styles/constants'

export namespace SearchBoxTypes {
  export type Props = {
    onClick: () => void
    placeholder: string
  }
}

export const SearchBox: React.FC<SearchBoxTypes.Props> = (props) => {
  return (
    <_.container onClick={props.onClick}>
      <Icon variant="SEARCH" />
      <span>{props.placeholder}</span>
    </_.container>
  )
}

namespace _ {
  export const container = styled.button`
    display: flex;
    align-items: center;
    position: relative;
    background-color: var(${Theme.SEARCH_BOX_BACKGROUND});
    ${styles.buttonHeight[40]};
    color: var(${Theme.COLOR_TEXT_DIMMED});
    ${styles.borderRadius[999]}
    border: var(${Theme.BORDER_SECONDARY});
    max-width: 300px;
    width: 100%;
    padding: 0 ${sharedValues.distance[12]}px;
    box-shadow: var(${Theme.SEARCH_BOX_SHADOW});
    ${styles.transition[100]('all')}
    cursor: text;
    overflow: hidden;
    @media (hover: hover) {
      :hover {
        border: var(${Theme.BORDER_PRIMARY});
        box-shadow: var(${Theme.SEARCH_BOX_SHADOW_HOVER});
      }
    }
    svg {
      ${styles.iconSize[20]}
    }
    span {
      white-space: nowrap;
      position: absolute;
      left: ${sharedValues.distance[40]}px;
    }
    ::after {
      position: absolute;
      width: ${sharedValues.distance[40]}px;
      right: 0;
      height: 100%;
      content: '';
      background: linear-gradient(
        to left,
        var(${Theme.HEADER_BACKGROUND}),
        transparent
      );
    }
  `
}
