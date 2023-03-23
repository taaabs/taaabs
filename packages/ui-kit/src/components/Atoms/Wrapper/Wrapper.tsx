import { mq } from '@/styles/mediaQueries'
import { css } from '@emotion/react'

export type WrapperProps = {
  children?: React.ReactNode
}

export const Wrapper: React.FC<WrapperProps> = (props) => {
  return (
    <div
      css={css`
        ${mq.at992} {
          max-width: 1380px;
          width: 100%;
          margin: 0 auto;
          padding: 0 10px;
        }
        ${mq.at1200} {
          padding: 0 40px;
        }
      `}
    >
      {props.children}
    </div>
  )
}
