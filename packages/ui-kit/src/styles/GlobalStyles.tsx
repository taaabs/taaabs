import { css } from '@emotion/react'

export enum Theme {
  FONT_FAMILY_SANS = '--font-family-sans',
  FONT_FAMILY_SERIF = '--font-family-serif',
  FONT_SIZE_BODY_12 = '--font-size-body-12',
  FONT_SIZE_BODY_14 = '--font-size-body-14',
  FONT_SIZE_BODY_16 = '--font-size-body-16',
  FONT_SIZE_BODY_18 = '--font-size-body-18',
  FONT_SIZE_BODY_20 = '--font-size-body-20',
  BORDER_RADIUS_4 = '--border-radius-4',
  BORDER_RADIUS_10 = '--border-radius-10',
  BORDER_RADIUS_12 = '--border-radius-12',
  BORDER_RADIUS_14 = '--border-radius-14',
  COLOR_WHITE = '--color-white',
  COLOR_BLACK = '--color-black',
  COLOR_TEXT = '--color-text',
  COLOR_ACCENT = '--color-accent',
  COLOR_50 = '--color-50',
  COLOR_100 = '--color-100',
  COLOR_200 = '--color-200',
  PADDING_15 = '--padding-15',
  PADDING_40 = '--padding-40',
  PADDING_60 = '--padding-60',
  BORDER_100 = '--border-100',
  ANIMATION_DURATION = '--animation-duration',
}

type ThemeMap = {
  [key in Theme]: string
}

const defaultTheme: ThemeMap = {
  [Theme.FONT_FAMILY_SANS]: 'Inter, sans-serif',
  [Theme.FONT_FAMILY_SERIF]: 'Alice, serif',
  [Theme.FONT_SIZE_BODY_12]: '1.2rem',
  [Theme.FONT_SIZE_BODY_14]: '1.4rem',
  [Theme.FONT_SIZE_BODY_16]: '1.6rem',
  [Theme.FONT_SIZE_BODY_18]: '1.8rem',
  [Theme.FONT_SIZE_BODY_20]: '2rem',
  [Theme.BORDER_RADIUS_4]: '4px',
  [Theme.BORDER_RADIUS_10]: '10px',
  [Theme.BORDER_RADIUS_12]: '12px',
  [Theme.BORDER_RADIUS_14]: '14px',
  [Theme.COLOR_WHITE]: '#FFF',
  [Theme.COLOR_BLACK]: '#000',
  [Theme.COLOR_TEXT]: '#1D1D1F',
  [Theme.COLOR_ACCENT]: '#0944BA',
  [Theme.COLOR_50]: '#F7F7F7',
  [Theme.COLOR_100]: '#ECECEC',
  [Theme.COLOR_200]: '#DFDFDF',
  [Theme.PADDING_15]: '15px',
  [Theme.PADDING_40]: '40px',
  [Theme.PADDING_60]: '60px',
  [Theme.BORDER_100]: `2px solid var(${Theme.COLOR_100})`,
  [Theme.ANIMATION_DURATION]: '.15s',
}

export const globalStyles = css`
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
    ${css(defaultTheme)}
  }

  body {
    font-family: var(${Theme.FONT_FAMILY_SANS});
    line-height: 1.5;
    font-size: 1.4rem;
    color: var(${Theme.COLOR_TEXT});
    background: var(${Theme.COLOR_50});
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
