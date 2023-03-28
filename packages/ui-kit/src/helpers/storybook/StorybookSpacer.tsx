import { Theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

export const StorybookSpacer: React.FC = () => {
  return <$Container />
}

const $Container = styled.div`
  height: var(${Theme.SPACER_16});
  ${mq.at768} {
    height: var(${Theme.SPACER_40});
  }
`
