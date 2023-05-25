import { mq } from '@/styles/constants'
import styled from '@emotion/styled'

export namespace LayoutRoot {
  export type Props = {
    slotHeaderDesktop: React.ReactNode
    slotHeaderMobile: React.ReactNode
    slotBottomNavigationBar: React.ReactNode
    slotFooterDesktop: React.ReactNode
    children?: React.ReactNode
  }
}

export const LayoutRoot: React.FC<LayoutRoot.Props> = (props) => {
  return (
    <>
      <_.header>
        <_.Header.desktop>{props.slotHeaderDesktop}</_.Header.desktop>
        <_.Header.mobile>{props.slotHeaderMobile}</_.Header.mobile>
      </_.header>
      {props.children}
      <_.footerDesktop>{props.slotFooterDesktop}</_.footerDesktop>
      <_.mobileBottomNavigationBar>
        {props.slotBottomNavigationBar}
      </_.mobileBottomNavigationBar>
    </>
  )
}

namespace _ {
  export const header = styled.header`
    position: fixed;
    z-index: 1;
    top: 0;
    width: 100%;
  `
  export namespace Header {
    export const desktop = styled.div`
      ${mq.to992} {
        display: none;
      }
    `
    export const mobile = styled.div`
      ${mq.at992} {
        display: none;
      }
    `
  }
  export const footerDesktop = styled.div`
    ${mq.to992} {
      display: none;
    }
  `
  export const mobileBottomNavigationBar = styled.div`
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 2;
    ${mq.at992} {
      display: none;
    }
  `
}
