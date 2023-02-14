import { theme } from '@/styles/GlobalStyles'
import { css } from '@emotion/react'

export type UiAtoLogoProps = {
  type: 'simple' | 'wide'
}

export const UiAtoLogo: React.FC<UiAtoLogoProps> = ({ type }) => {
  return (
    <div css={[styles.outer]}>
      <div css={[styles.t]}>T</div>
    </div>
  )
}

const styles = {
  outer: css`
    display: inline-flex;
    height: 4.8rem;
  `,
  t: css`
    color: var(${theme.colors.white});
    background: var(${theme.colors.accent});
    width: 4.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
  `,
}
