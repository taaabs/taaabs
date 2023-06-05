import { sharedValues } from '@web-ui/constants'
import { Theme } from '@web-ui/styles/components/GlobalStyles'
import { styles } from '@web-ui/styles/constants'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Icon } from '@web-ui/components/Atoms/Icon'

export namespace _MobileTitleBarTypes {
  export type Props = {
    swipeLeftOnClick?: () => void
    swipeRightOnClick?: () => void
    topLineText: string
    bottomLineText: string
  }
}

export const _MobileTitleBar = (props: _MobileTitleBarTypes.Props) => {
  return (
    <_.container>
      <_.iconLeft onClick={props.swipeLeftOnClick}>
        <Icon variant={'MOBILE_TITLE_BAR_MENU'} />
      </_.iconLeft>
      <_.title>
        <span>{props.topLineText}</span>
        <span>{props.bottomLineText}</span>
      </_.title>
      <_.iconRight onClick={props.swipeRightOnClick}>
        <Icon variant={'MOBILE_TITLE_BAR_VIEW_OPTIONS'} />
      </_.iconRight>
    </_.container>
  )
}

namespace _ {
  export const container = styled.div`
    border-bottom: var(${Theme.BORDER_PRIMARY});
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: ${sharedValues.appBar}px;
    background-color: var(${Theme.HEADER_TRANSPARENT_BACKGROUND});
    ${styles.backdropFilter.desktopHeader}
  `
  const iconCommon = css`
    display: flex;
    align-items: center;
    padding: 0 ${sharedValues.distance[16]}px;
    align-self: stretch;
  `
  export const iconLeft = styled.button`
    ${iconCommon}
    > div > svg {
      ${styles.iconSize[20]}
    }
  `
  export const iconRight = styled.button`
    ${iconCommon}
    > div > svg {
      ${styles.iconSize[26]}
    }
  `
  export const title = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(${Theme.TITLE_BAR_BACKGROUND});
    padding: ${sharedValues.distance[3]}px ${sharedValues.distance[24]}px
      ${sharedValues.distance[1]}px ${sharedValues.distance[24]}px;
    border-radius: ${sharedValues.distance[999]}px;
    span:first-of-type {
      color: var(${Theme.TITLE_BAR_PRIMARY_FOREGROUND});
      ${styles.fontSize[17].px};
      ${styles.fontFamily.plusJakartaSans}
      ${styles.fontWeight.plusJakartaSans.semiBold}
    }
    span:last-of-type {
      color: var(${Theme.TITLE_BAR_SECONDARY_FOREGROUND});
      ${styles.fontSize[13].px};
      margin-top: -1px;
    }
  `
}
