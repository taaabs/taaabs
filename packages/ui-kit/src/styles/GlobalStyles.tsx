import { css } from '@emotion/react'
import { mq } from './mediaQueries'

export enum Theme {
  FONT_FAMILY_SANS = '--font-family-sans',
  FONT_FAMILY_SERIF = '--font-family-serif',
  FONT_SIZE_BODY_12 = '--font-size-body-12',
  FONT_SIZE_BODY_14 = '--font-size-body-14',
  FONT_SIZE_BODY_16 = '--font-size-body-16',
  FONT_SIZE_BODY_18 = '--font-size-body-18',
  FONT_SIZE_BODY_20 = '--font-size-body-20',
  FONT_WEIGHT_MEDIUM = '--font-weight-medium',
  FONT_WEIGHT_SEMIBOLD = '--font-weight-semibold',
  FONT_WEIGHT_BOLD = '--font-weight-bold',
  BORDER_RADIUS_4 = '--border-radius-4',
  BORDER_RADIUS_10 = '--border-radius-10',
  BORDER_RADIUS_12 = '--border-radius-12',
  BORDER_RADIUS_14 = '--border-radius-14',
  COLOR_WHITE = '--color-white',
  COLOR_BLACK = '--color-black',
  COLOR_TEXT = '--color-text',
  COLOR_TEXT_VARIANT = '--color-text-variant',
  COLOR_TEXT_DIMMED = '--color-text-dimmed',
  COLOR_ACCENT = '--color-accent',
  COLOR_50 = '--color-50',
  COLOR_100 = '--color-100',
  COLOR_200 = '--color-200',
  PADDING_8 = '--padding-8',
  PADDING_15 = '--padding-15',
  PADDING_40 = '--padding-40',
  PADDING_60 = '--padding-60',
  BORDER_100 = '--border-100',
  BUTTON_HEIGHT_46 = '--button-height-46',
  ANIMATION_DURATION_150 = '--animation-duration-15',
  ANIMATION_DURATION_300 = '--animation-duration-300',
  TRANSITION_TIMING_FUNCTION = '--transition-timing-function',
  TRANSITION_HOVER = '--transition-hover',
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
  [Theme.FONT_WEIGHT_MEDIUM]: '500',
  [Theme.FONT_WEIGHT_SEMIBOLD]: '600',
  [Theme.FONT_WEIGHT_BOLD]: '700',
  [Theme.BORDER_RADIUS_4]: '4px',
  [Theme.BORDER_RADIUS_10]: '10px',
  [Theme.BORDER_RADIUS_12]: '12px',
  [Theme.BORDER_RADIUS_14]: '14px',
  [Theme.COLOR_WHITE]: '#FFF',
  [Theme.COLOR_BLACK]: '#1F1F1F',
  [Theme.COLOR_TEXT]: '#202020',
  [Theme.COLOR_TEXT_VARIANT]: '#444746',
  [Theme.COLOR_TEXT_DIMMED]: '#747474',
  [Theme.COLOR_ACCENT]: '#0944BA',
  [Theme.COLOR_50]: '#FAFAFA',
  [Theme.COLOR_100]: '#EAEAEA',
  [Theme.COLOR_200]: '#D1D1D1',
  [Theme.PADDING_8]: '8px',
  [Theme.PADDING_15]: '15px',
  [Theme.PADDING_40]: '40px',
  [Theme.PADDING_60]: '60px',
  [Theme.BORDER_100]: `2px solid var(${Theme.COLOR_100})`,
  [Theme.BUTTON_HEIGHT_46]: '46px',
  [Theme.ANIMATION_DURATION_150]: '150ms',
  [Theme.ANIMATION_DURATION_300]: '300ms',
  [Theme.TRANSITION_TIMING_FUNCTION]: 'ease-in-out',
  [Theme.TRANSITION_HOVER]: 'all 150ms ease-in-out',
}

export const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');
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
    cursor: pointer;
  }

  // Slideout - start
  .slideout-open,
  .slideout-open body,
  .slideout-open .slideout-panel {
    ${mq.to992} {
      overflow: hidden;
      border-color: var(${Theme.COLOR_100});
    }
  }
  .slideout-open .slideout-menu {
    ${mq.to992} {
      display: block;
    }
  }
  // Slideout - end

  // Simplebar - start
  .simplebar-scrollbar:before {
    background: var(${Theme.COLOR_200});
    left: 5px;
    right: 2px;
  }
  .simplebar-scrollbar.simplebar-visible:before {
    opacity: 1;
  }
  // Simplebar - end
`
