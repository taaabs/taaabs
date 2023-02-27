import { Theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

type MarginProps = {
  children?: React.ReactNode
}

export const StorybookMargin: React.FC<MarginProps> = ({ children }) => {
  return <$Container>{children}</$Container>
}

const $Container = styled.div`
  margin: var(${Theme['PADDING_15']});
  ${mq.at768(css`
    margin: var(${Theme.PADDING_40});
  `)}
`
