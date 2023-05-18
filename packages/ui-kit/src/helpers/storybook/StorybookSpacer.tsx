import { sharedValues } from '@/constants'
import { mq } from '@/styles/mediaQueries'
import styled from '@emotion/styled'

export const StorybookSpacer: React.FC = () => {
  return <$Container />
}

const $Container = styled.div`
  height: ${sharedValues.numeric.spacer[16]}px;
  ${mq.at768} {
    height: ${sharedValues.numeric.spacer[40]}px;
  }
`
