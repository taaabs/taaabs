import { sharedValues } from '@/constants'
import { mq } from '@/styles/mediaQueries'
import { css } from '@emotion/react'

export type WrapperProps = {
  children?: React.ReactNode
}

export const Wrapper: React.FC<WrapperProps> = (props) => {
  return (
    <div
      css={css`
        width: 100%;
        max-width: 1380px;
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
