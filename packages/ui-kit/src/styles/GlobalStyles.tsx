import { css, Global } from '@emotion/react'

export const theme = {
  colors: {
    fgDefault: '--color-fg-default',
    bgDefault: '--color-bg-default',
    canvasDefault: '--color-canvas-default',
    canvasInset: '--color-canvas-inset',
  },
}

const vars = css({
  [theme.colors.fgDefault]: '#000',
  [theme.colors.bgDefault]: '#FFF',
  [theme.colors.canvasDefault]: '#F7F7F7',
  [theme.colors.canvasInset]: '#F2F2F2',
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
