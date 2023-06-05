import { sharedValues } from '@web-ui/constants'
import { Theme } from '@web-ui/styles/components/GlobalStyles'
import { mq, styles } from '@web-ui/styles/constants'
import styled from '@emotion/styled'
import Link from 'next/link'
import { Icon } from '@web-ui/components/Atoms/Icon'

export const LogoForHeader: React.FC = () => {
  return (
    <_.logo href="/">
      <Icon variant="LOGO" />
      <span>taaabs</span>
    </_.logo>
  )
}

namespace _ {
  export const logo = styled(Link)`
    display: flex;
    align-items: center;
    span {
      color: var(${Theme.COLOR_TEXT_NORMAL});
      ${styles.fontFamily.plusJakartaSans}
      ${styles.letterSpacing.logo}
      padding-left: ${sharedValues.distance[10]}px;
      ${styles.fontWeight.plusJakartaSans.bold}
      ${styles.fontSize[22].px}
      margin-bottom: ${sharedValues.distance[2]}px;
      ${mq.at992} {
        ${styles.fontSize[26].px}
        margin-bottom: ${sharedValues.distance[4]}px;
      }
    }
    > div > svg {
      fill: var(${Theme.LOGO_BACKGROUND});
      height: 34px;
      width: auto;
      ${styles.transition[100]('fill')}
      ${mq.at992} {
        height: 42px;
      }
    }
  `
}
