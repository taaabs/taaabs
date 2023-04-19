import { sharedValues } from '@/constants'
import { Theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import styled from '@emotion/styled'

export const StorybookSpacer: React.FC = () => {
  return <$Container />
}

const $Container = styled.div`
  height: ${sharedValues.distance[16]}px;
  ${mq.at768} {
    height: var(${Theme.SPACER_40});
  }
`
