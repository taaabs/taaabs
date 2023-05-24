import { sharedValues } from '@/constants'
import { mq } from '@/styles/constants'
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
        padding: 0 ${sharedValues.spacer[16]}px;
        ${mq.at1200} {
          padding: 0 ${sharedValues.spacer[40]}px;
        }
      `}
    >
      {props.children}
    </div>
  )
}
