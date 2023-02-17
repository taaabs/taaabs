import { Atoms } from '@/components'
import { theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import styled, { css } from 'styled-components'

export type LayoutSidebarProps = {}

export const LayoutSidebar: React.FC<LayoutSidebarProps> = (props) => {
  return (
    <$Container>
      <$Backdrop isVisible={false} />
      <$Topbar._>
        <$Topbar.Left._>
          <Atoms.Logo type="simple" />
          <$Topbar.collapseSidebarIcon>HOME</$Topbar.collapseSidebarIcon>
          {`COLLECTION > COLLECTION > COLLECTION`}
        </$Topbar.Left._>
        <$Topbar.Right._>NOTIFICATIONS | NIGHT MODE | USER</$Topbar.Right._>
      </$Topbar._>
      <$Sidebar.container>
        <$Sidebar.inner>
          <$Sidebar.asideLeft>L</$Sidebar.asideLeft>
          <$Sidebar.asideRight>R</$Sidebar.asideRight>
        </$Sidebar.inner>
        <$Sidebar.copyright>
          &copy; 2023 Taaabs · Privacy Policy
        </$Sidebar.copyright>
      </$Sidebar.container>

      <$Main>hi</$Main>
    </$Container>
  )
}

const $Container = styled.div`
  min-height: 100vh;
`

const $Backdrop = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 100;
  background: rgba(0, 0, 0, 0.16);
  transition-duration: ${theme.animation.duration};
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0s;
  transition-property: opacity, visibility;
  ${({ isVisible }) => css`
    opacity: ${isVisible ? 1 : 0};
    visibility: ${isVisible ? 'visible' : 'hidden'};
  `}
`

const topBarIconHeight = 4.8
const topBarPadding = 1.5
const topBarHeight = topBarIconHeight + topBarPadding * 2

const $Topbar = {
  _: styled.header`
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    top: 0;
    width: 100%;
    height: ${topBarHeight}rem;
    background-color: var(${theme.colors[50]});
    padding: 0 ${topBarPadding}rem;
    ${mq.at576(css`
      padding: 0 var(${theme.padding['4rem']});
    `)}
  `,
  Left: {
    _: styled.div`
      display: flex;
      align-items: center;
      gap: 1.5rem;
    `,
  },
  Right: {
    _: styled.div``,
  },
  collapseSidebarIcon: styled.div`
    width: ${topBarIconHeight}rem;
    height: ${topBarIconHeight}rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(${theme.colors[100]});
    border-radius: 1rem;
  `,
}

const sidebarAside = css`
  border-radius: 1rem;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: var(${theme.border[100]});
  background-color: var(${theme.colors[50]});
  padding: var(${theme.padding['1.5rem']});
`

const $Sidebar = {
  container: styled.div`
    display: flex;
    flex-direction: column;
    position: fixed;
    top: ${topBarHeight}rem;
    left: var(${theme.padding['4rem']});
    height: calc(100vh - ${topBarHeight}rem);
    width: 30rem;
    z-index: 101;
  `,
  inner: styled.div`
    flex-grow: 1;
    position: relative;
  `,
  asideLeft: styled.div`
    ${sidebarAside};
    transform: scale(0.98) translateX(-1.2rem);
  `,
  asideRight: styled.div`
    ${sidebarAside};
  `,
  copyright: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(${theme.padding['4rem']});
    font-size: var(${theme.fontSize.body['1.2']});
    opacity: 0.4;
  `,
}

const $Main = styled.main`
  height: 4000px;
`
