import { theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import styled, { css } from 'styled-components'

type MarginProps = {
  children?: React.ReactNode
}

export const StorybookMargin: React.FC<MarginProps> = ({ children }) => {
  return <$Container>{children}</$Container>
}

const $Container = styled.div`
  margin: var(${theme.padding['1.5rem']});
  ${mq.at768(css`
    margin: var(${theme.padding['4rem']});
  `)}
`
