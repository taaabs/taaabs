import { css, createGlobalStyle } from 'styled-components'

export const theme = {
  font: {
    sans: '--font-sans',
    serif: '--font-serif',
  },
  colors: {
    white: '--color-white',
    black: '--color-black',
    text: '--color-text',
    accent: '--color-accent',
    '50': '--color-50',
    '100': '--color-100',
    '200': '--color-200',
  },
  margin: {
    '1.5rem': '--margin-1-5rem',
    '4rem': '--margin-4rem',
    '6rem': '--margin-6rem',
  },
}

const defaultTheme = css({
  [theme.font.sans]: 'Inter, sans-serif',
  [theme.font.serif]: 'Alice, serif',
  [theme.colors.white]: '#FFF',
  [theme.colors.black]: '#000',
  [theme.colors.text]: '#1D1D1F',
  [theme.colors.accent]: '#0944BA',
  [theme.colors['50']]: '#F7F7F7',
  [theme.colors['100']]: '#ECECEC',
  [theme.colors['200']]: '#DFDFDF',
  [theme.margin['1.5rem']]: '1.5rem',
  [theme.margin['4rem']]: '4rem',
  [theme.margin['6rem']]: '6rem',
})

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Alice&display=swap');

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
    ${defaultTheme}
  }

  body {
    font-family: var(${theme.font.sans});
    line-height: 1.5;
    font-size: 1.4rem;
    color: var(${theme.colors.text});
    background: var(${theme.colors['50']});
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
