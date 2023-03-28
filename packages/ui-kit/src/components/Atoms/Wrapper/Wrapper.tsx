import { Theme } from '@/styles/GlobalStyles'
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
          padding: 0 var(${Theme.SPACER_16});
        }
        ${mq.at1200} {
          padding: 0 var(${Theme.SPACER_40});
        }
      `}
    >
      {props.children}
    </div>
  )
}
