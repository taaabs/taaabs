import { theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import styled, { css } from 'styled-components'

export const StorybookSpacer: React.FC = () => {
  return <$Container />
}

const $Container = styled.div`
  height: var(${theme.padding['1.5rem']});
  ${mq.at768(css`
    height: var(${theme.padding['4rem']});
  `)}
`
