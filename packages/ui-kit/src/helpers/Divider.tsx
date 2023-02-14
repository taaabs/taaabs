import { theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import { css } from '@emotion/react'

export const Divider: React.FC = () => {
  return <div css={[container]} />
}

const container = css`
  height: var(${theme.margin['1.5rem']});
  ${mq.at768(css`
    height: var(${theme.margin['4rem']});
  `)}
`
