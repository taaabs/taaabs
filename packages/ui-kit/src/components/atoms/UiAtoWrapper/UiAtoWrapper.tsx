import { mq } from '@/styles/mediaQueries'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

export type UiAtoWrapperProps = {
  children?: React.ReactNode
}

export const UiAtoWrapper: React.FC<UiAtoWrapperProps> = (props) => {
  return <div css={[container]}>{props.children}</div>
}

const container = css`
  width: 100%;
  margin: 0 auto;
  padding: 0 1.5rem;
  max-width: 125rem;
  ${mq.at768(css`
    padding: 0 4rem;
  `)}
`
