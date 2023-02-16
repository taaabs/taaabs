import { theme } from '@/styles/GlobalStyles'
import styled from 'styled-components'

export type LogoProps = {
  type: 'simple' | 'wide'
}

export const Logo: React.FC<LogoProps> = ({ type }) => {
  const otherTab = ({ showLine }: { showLine: boolean }) => (
    <$OtherTab.container>
      <$OtherTab.circle />
      <$OtherTab.line isTransparent={!showLine} />
    </$OtherTab.container>
  )

  return (
    <$Container>
      <$LetterBox.container type={type}>
        <span>T</span>
        {type == 'wide' && <$LetterBox.corner />}
      </$LetterBox.container>
      {type == 'wide' && (
        <>
          {otherTab({ showLine: true })}
          {otherTab({ showLine: true })}
          {otherTab({ showLine: false })}
        </>
      )}
    </$Container>
  )
}

const $Container = styled.div`
  display: inline-flex;
  height: 5rem;
`

const $LetterBox = {
  container: styled.div<{ type: 'simple' | 'wide' }>`
    color: var(${theme.colors.white});
    background: var(${theme.colors.accent});
    width: 5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3.2rem;
    border-radius: 1rem;
    border-bottom-right-radius: ${({ type }) => (type == 'wide' ? '0' : '1rem')};
    font-family: var(${theme.fontFamily.serif});
    position: relative;
    z-index: 3;
  `,
  corner: styled.div`
    position: absolute;
    bottom: 0;
    right: -1.1rem;
    width: 1.1rem;
    height: 1.1rem;
    background: var(${theme.colors.accent});
    &:after {
      content: '';
      position: absolute;
      background: var(${theme.colors[50]});
      width: 1.1rem;
      height: 1.1rem;
      border-bottom-left-radius: 1.1rem;
    }
  `,
}

const $OtherTab = {
  container: styled.div`
    height: 100%;
    display: flex;
    width: 6.5rem;
    justify-content: right;
    align-items: center;
    border-radius: 1rem;
    background-color: var(${theme.colors[50]});
    margin-left: -2.1rem;
    &:nth-child(1) {
      z-index: 3;
    }
    &:nth-child(2) {
      z-index: 2;
    }
    &:nth-child(3) {
      z-index: 1;
    }
  `,
  circle: styled.div`
    width: 2.5rem;
    height: 2.5rem;
    background-color: var(${theme.colors.white});
    margin-right: 0.8rem;
    border-radius: 2.5rem;
  `,
  line: styled.div<{ isTransparent: boolean }>`
    opacity: ${({ isTransparent }) => (isTransparent ? '0' : '1')};
    width: 0.2rem;
    height: 2.5rem;
    background-color: var(${theme.colors.white});
  `,
}
