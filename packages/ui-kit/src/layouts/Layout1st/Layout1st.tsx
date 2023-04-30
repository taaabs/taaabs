import { mq } from '@/styles/mediaQueries'
import styled from '@emotion/styled'

export namespace Layout1st {
  export type Props = {
    slotHeaderDesktop: React.ReactNode
    slotHeaderMobile: React.ReactNode
    slotBottomNavigationBar: React.ReactNode
    slotFooterDesktop: React.ReactNode
    children?: React.ReactNode
  }
}

export const Layout1st: React.FC<Layout1st.Props> = (props) => {
  return (
    <>
      <$.header>
        <$.Header.desktop>{props.slotHeaderDesktop}</$.Header.desktop>
        <$.Header.mobile>{props.slotHeaderMobile}</$.Header.mobile>
      </$.header>
      {props.children}
      <$.footerDesktop>{props.slotFooterDesktop}</$.footerDesktop>
      <$.bottomNavigationBar>
        {props.slotBottomNavigationBar}
      </$.bottomNavigationBar>
    </>
  )
}

namespace $ {
  export const header = styled.header`
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 3;
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
  export const bottomNavigationBar = styled.div`
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 2;
    ${mq.at992} {
      display: none;
    }
  `
}
