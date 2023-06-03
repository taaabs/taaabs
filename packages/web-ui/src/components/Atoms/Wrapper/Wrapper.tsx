import { sharedValues } from '@web-ui/constants'
import { mq } from '@web-ui/styles/constants'
import { css } from '@emotion/react'

export type WrapperProps = {
  children?: React.ReactNode
}

export const Wrapper: React.FC<WrapperProps> = (props) => {
  return (
    <div
      css={css`
        width: 100%;
        max-width: ${sharedValues.siteMaxWidth}px;
        margin: 0 auto;
        padding: 0 ${sharedValues.distance[16]}px;
        ${mq.at1200} {
          padding: 0 ${sharedValues.distance[40]}px;
        }
      `}
    >
      {props.children}
    </div>
  )
}
