import { theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import { css } from '@emotion/react'

type MarginProps = {
  children?: React.ReactNode
}

export const StorybookMargin: React.FC<MarginProps> = ({ children }) => {
  return <div css={[container]}>{children}</div>
}

const container = css`
  margin: var(${theme.margin['1.5rem']});
  ${mq.at768(css`
    margin: var(${theme.margin['4rem']});
  `)}
`
