import { sharedValues } from '@/constants'
import { Ui } from '@/index'
import { Theme } from '@/styles/components/GlobalStyles'
import { mq, s } from '@/styles/constants'
import styled from '@emotion/styled'
import Link from 'next/link'

export const LogoForHeader: React.FC = () => {
  return (
    <_.logo href="/">
      <Ui.Atoms.Icon variant="LOGO" />
      <span>taaabs</span>
    </_.logo>
  )
}

namespace _ {
  export const logo = styled(Link)`
    display: flex;
    align-items: center;
    > span {
      color: var(${Theme.COLOR_TEXT_NORMAL});
      ${s.fontFamily.plusJakartaSans}
      ${s.letterSpacing.logo}
      padding-left: ${sharedValues.distance[10]}px;
      ${s.fontWeight.plusJakartaSans.bold}
      ${s.fontSize[22].px}
      margin-bottom: ${sharedValues.distance[2]}px;
      ${mq.at992} {
        ${s.fontSize[26].px}
        margin-bottom: ${sharedValues.distance[4]}px;
      }
    }
    > div > svg {
      fill: var(${Theme.COLOR_BRAND});
      height: 34px;
      width: auto;
      ${s.transition[100]('fill')}
      ${mq.at992} {
        height: 42px;
      }
    }
  `
}
