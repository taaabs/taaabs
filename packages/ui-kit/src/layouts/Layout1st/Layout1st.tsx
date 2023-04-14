import { mq } from '@/styles/mediaQueries'
import styled from '@emotion/styled'

export namespace Layout1st {
  export type Props = {
    slotHeaderDesktop: React.ReactNode
    slotHeaderMobile: React.ReactNode
    slotBottomNavigationBarMobile: React.ReactNode
    children?: React.ReactNode
  }
}

export const Layout1st: React.FC<Layout1st.Props> = (props) => {
  return (
    <>
      <S.header>
        <S.Header.desktop>{props.slotHeaderDesktop}</S.Header.desktop>
        <S.Header.mobile>{props.slotHeaderMobile}</S.Header.mobile>
      </S.header>
      {props.children}
      <S.bottomNavigationBarMobile>
        {props.slotBottomNavigationBarMobile}
      </S.bottomNavigationBarMobile>
    </>
  )
}

namespace S {
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
  export const bottomNavigationBarMobile = styled.div`
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 2;
    ${mq.at992} {
      display: none;
    }
  `
}
