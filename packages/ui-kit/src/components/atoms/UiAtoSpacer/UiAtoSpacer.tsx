import { theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import { css } from '@emotion/react'

export const UiAtoSpacer: React.FC = () => {
  return <div css={[container]} />
}

const container = css`
  height: 4rem;
  ${mq.at768(css`
    height: 6rem;
  `)}
  ${mq.at1200(css`
    height: 8rem;
  `)}
`
