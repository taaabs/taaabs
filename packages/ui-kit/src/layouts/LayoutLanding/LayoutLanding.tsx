import { Atoms } from '@/components'
import { theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import styled, { css } from 'styled-components'

export type LayoutLandingProps = {
  children?: React.ReactNode
  logIn: {
    onClick: () => void
    label: string
  }
  getStarted: {
    onClick: () => void
    label: string
  }
}

export const LayoutLanding: React.FC<LayoutLandingProps> = (props) => {
  return (
    <$Container>
      <$Header.outer>
        <Atoms.Wrapper>
          <$Header.inner>
            <$Header.logoDesktop>
              <Atoms.Logo type="wide" />
            </$Header.logoDesktop>
            <$Header.logoMobile>
              <Atoms.Logo type="simple" />
            </$Header.logoMobile>

            <$Header.actionButtons>
              <$Header.menuItem onClick={props.logIn.onClick}>
                {props.logIn.label}
              </$Header.menuItem>
              <Atoms.Button onClick={props.getStarted.onClick}>
                {props.getStarted.label}
              </Atoms.Button>
            </$Header.actionButtons>
          </$Header.inner>
        </Atoms.Wrapper>
      </$Header.outer>
      <$Main>{props.children}</$Main>
      <$Footer>
        <Atoms.Wrapper>footer</Atoms.Wrapper>
      </$Footer>
    </$Container>
  )
}

const $Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const $Header = {
  outer: styled.header`
    display: flex;
    background: var(${theme.colors['100']});
    height: 8rem;
    align-items: center;
  `,
  inner: styled.div`
    display: flex;
    justify-content: space-between;
  `,
  logoMobile: styled.div`
    ${mq.at576(css`
      display: none;
    `)}
  `,
  logoDesktop: styled.div`
    ${mq.to576(css`
      display: none;
    `)}
  `,
  actionButtons: styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
  `,
  menuItem: styled.button`
    cursor: pointer;
    height: 100%;
    padding: 0 1.5rem;
    font-size: 1.6rem;
    &:hover {
      text-decoration: underline;
      text-decoration-thickness: 2px;
    }
  `,
}

const $Main = styled.main`
  flex: 1;
`

const $Footer = styled.footer`
  background: red;
`
