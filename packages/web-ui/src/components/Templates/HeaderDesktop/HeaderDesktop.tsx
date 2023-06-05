import { sharedValues } from '@web-ui/constants'
import { Theme } from '@web-ui/styles/components/GlobalStyles'
import { styles } from '@web-ui/styles/constants'
import { Wrapper } from '@web-ui/components/Atoms/Wrapper'
import { css } from '@emotion/react'

export namespace HeaderDesktopTypes {
  export type Props = {
    logoSlot: React.ReactNode
    navigationSlot: React.ReactNode
    rightSideSlot?: React.ReactNode
  }
}

export const HeaderDesktop = (props: HeaderDesktopTypes.Props) => {
  return (
    <div
      css={css`
        border-bottom: var(${Theme.BORDER_PRIMARY});
        background-color: var(${Theme.HEADER_TRANSPARENT_BACKGROUND});
        ${styles.backdropFilter.desktopHeader}
        height: ${sharedValues.headerDesktop}px;
      `}
    >
      <Wrapper>
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100%;
            gap: ${sharedValues.distance[40]}px;
          `}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
              gap: ${sharedValues.distance[16]}px;
              height: 100%;
            `}
          >
            {props.logoSlot}
            {props.navigationSlot}
          </div>
          {props.rightSideSlot}
        </div>
      </Wrapper>
    </div>
  )
}
