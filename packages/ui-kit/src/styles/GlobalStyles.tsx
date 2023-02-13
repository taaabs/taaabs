import { css, Global } from '@emotion/react'

export const theme = {
  colors: {
    white: '--color-white',
    black: '--color-black',
    text: '--color-text',
    accentDefault: '--color-accent-default',
    gray50: '--color-gray-50',
    gray100: '--color-gray-100',
    gray200: '--color-gray-200',
  },
}

const vars = css({
  [theme.colors.white]: '#FFF',
  [theme.colors.black]: '#000',
  [theme.colors.text]: '#1D1D1F',
  [theme.colors.accentDefault]: '#0944BA',
  [theme.colors.gray50]: '#F7F7F7',
  [theme.colors.gray100]: '#ECECEC',
  [theme.colors.gray200]: '#DFDFDF',
})

const globalStyles = css`
  #__next {
    min-height: 100vh;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    font-size: 62.5%;
  }

  :root {
    ${vars}
  }

  body {
    font-family: sans-serif;
    line-height: 1.5;
    font-size: 1.4rem;
    color: var(${theme.colors.text});
    background: var(${theme.colors.gray50});
    @media (min-width: 768px) {
      font-size: 1.6rem;
    }
  }

  body,
  h1,
  h1,
  h3,
  h4,
  p,
  figure,
  blockquote,
  dl,
  dd {
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ol,
  ul {
    list-style: none;
  }

  ul {
    margin: 0;
    padding-inline-start: 0;
  }

  img,
  picture {
    max-width: 100%;
    display: block;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  button {
    background: none;
    border: none;
    padding: 0;
  }
`

export const GlobalStyles = () => <Global styles={globalStyles} />
