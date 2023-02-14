import { UiAtoButton } from '@/components/atoms/UiAtoButton'
import { UiAtoWrapper } from '@/components/atoms/UiAtoWrapper'
import { theme } from '@/styles/GlobalStyles'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

export type UiLayoutLandingProps = {
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

export const UiLayoutLanding: React.FC<UiLayoutLandingProps> = (props) => {
  return (
    <$Container>
      <$Header.outer>
        <UiAtoWrapper>
          <$Header.inner>
            <div>logo11</div>
            <$Header.actionButtons>
              <button css={$Header.menuItem} onClick={props.logIn.onClick}>
                {props.logIn.label}
              </button>
              <UiAtoButton onClick={props.getStarted.onClick}>{props.getStarted.label}</UiAtoButton>
            </$Header.actionButtons>
          </$Header.inner>
        </UiAtoWrapper>
      </$Header.outer>
      <$Main>{props.children}</$Main>
      <$Footer>
        <UiAtoWrapper>footer</UiAtoWrapper>
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
  actionButtons: styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
  `,
  menuItem: css`
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
