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
  margin: var(${Theme['SPACER_16']});
  ${mq.at768} {
    margin: var(${Theme.SPACER_40});
  }
`
