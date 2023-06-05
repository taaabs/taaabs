import { sharedValues } from '@web-ui/constants'
import { Theme } from '@web-ui/styles/components/GlobalStyles'
import { css } from '@emotion/react'

export namespace HeaderMobileTypes {
  export type Props = {
    navigationSlot: React.ReactNode
    logoSlot: React.ReactNode
  }
}

export const HeaderMobile: React.FC<HeaderMobileTypes.Props> = (props) => {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: ${sharedValues.distance[16]}px;
        padding-right: ${sharedValues.distance[10]}px;
        border-bottom: var(${Theme.BORDER_PRIMARY});
        height: ${sharedValues.headerMobile}px;
        background-color: var(${Theme.HEADER_BACKGROUND});
      `}
    >
      {props.logoSlot}
      {props.navigationSlot}
    </div>
  )
}
