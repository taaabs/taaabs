import { Theme } from '@/styles/GlobalStyles'
import styled from '@emotion/styled'

export type LogoProps = {
  type: 'simple' | 'wide'
}

export const Logo: React.FC<LogoProps> = ({ type }) => {
  const otherTab = ({ showLine }: { showLine: boolean }) => (
    <Styled.OtherTab>
      <Styled.otherTab.Circle />
      <Styled.otherTab.Line isTransparent={!showLine} />
    </Styled.OtherTab>
  )

  return (
    <S.Container>
      <S.LetterBox.Container type={type}>
        <span>T</span>
        {type == 'wide' && <Styled.letterBox.Corner />}
      </S.LetterBox.Container>
      {type == 'wide' && (
        <>
          {otherTab({ showLine: true })}
          {otherTab({ showLine: true })}
          {otherTab({ showLine: false })}
        </>
      )}
    </S.Container>
  )
}

namespace S {
  export const Container = styled.div`
    display: inline-flex;
    height: 4.8rem;
  `
  export namespace LetterBox {
    type ContainerProps = { type: 'simple' | 'wide' }
    export const Container = styled.div<ContainerProps>`
      color: var(${Theme.COLOR_WHITE});
      background: var(${Theme.COLOR_ACCENT});
      width: 4.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3.2rem;
      border-radius: 1rem;
      border-bottom-right-radius: ${({ type }) =>
        type == 'wide' ? '0' : '1rem'};
      font-family: var(${Theme.FONT_FAMILY_SERIF});
      position: relative;
      z-index: 3;
      > ${S.LetterBox.Corner} {
        color: red;
      }
    `
    export const Corner = styled.div`
      position: absolute;
      bottom: 0;
      right: -1.1rem;
      width: 1.1rem;
      height: 1.1rem;
      background: var(${Theme.COLOR_ACCENT});
      &:after {
        content: '';
        position: absolute;
        background: var(${Theme.COLOR_100});
        width: 1.1rem;
        height: 1.1rem;
        border-bottom-left-radius: 1.1rem;
      }
    `
  }
}

const Styled = {
  Container: styled.div`
    display: inline-flex;
    height: 4.8rem;
  `,
  LetterBox: styled.div<{ type: 'simple' | 'wide' }>`
    color: var(${Theme.COLOR_WHITE});
    background: var(${Theme.COLOR_ACCENT});
    width: 4.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3.2rem;
    border-radius: 1rem;
    border-bottom-right-radius: ${({ type }) =>
      type == 'wide' ? '0' : '1rem'};
    font-family: var(${Theme.FONT_FAMILY_SERIF});
    position: relative;
    z-index: 3;
    > {
      color: red;
    }
  `,
  letterBox: {
    Corner: styled.div`
      position: absolute;
      bottom: 0;
      right: -1.1rem;
      width: 1.1rem;
      height: 1.1rem;
      background: var(${Theme.COLOR_ACCENT});
      &:after {
        content: '';
        position: absolute;
        background: var(${Theme.COLOR_100});
        width: 1.1rem;
        height: 1.1rem;
        border-bottom-left-radius: 1.1rem;
      }
    `,
  },
  OtherTab: styled.div`
    height: 100%;
    display: flex;
    width: 6.5rem;
    justify-content: right;
    align-items: center;
    border-radius: 1rem;
    background-color: var(${Theme.COLOR_100});
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
  otherTab: {
    Circle: styled.div`
      width: 2.5rem;
      height: 2.5rem;
      background-color: var(${Theme.COLOR_WHITE});
      margin-right: 0.8rem;
      border-radius: 2.5rem;
    `,
    Line: styled.div<{ isTransparent: boolean }>`
      opacity: ${({ isTransparent }) => (isTransparent ? '0' : '1')};
      width: 0.15rem;
      height: 2.5rem;
      background-color: var(${Theme.COLOR_200});
    `,
  },
}
