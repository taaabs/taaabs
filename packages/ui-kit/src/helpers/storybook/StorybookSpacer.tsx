import { sharedValues } from '@/constants'
import { mq } from '@/styles/constants'
import styled from '@emotion/styled'

export const StorybookSpacer: React.FC = () => {
  return <$Container />
}

const $Container = styled.div`
  height: ${sharedValues.spacer[16]}px;
  ${mq.at768} {
    height: ${sharedValues.spacer[40]}px;
  }
`
