import { css } from '@emotion/react'
import { mq } from './mediaQueries'
import { colors, sharedValues } from '@/constants'

export const enum Theme {
  COLOR_WHITE = '--color-white',
  COLOR_BLACK = '--color-black',
  COLOR_TEXT_NORMAL = '--color-text--normal',
  COLOR_TEXT_VARIANT = '--color-text-variant',
  COLOR_TEXT_DIMMED = '--color-text-dimmed',
  COLOR_PRIMARY_50 = '--color-primary-50',
  COLOR_PRIMARY_800 = '--color-primary-800',
  COLOR_PRIMARY_900 = '--color-primary-900',
  COLOR_NEUTRAL_25 = '--color-neutral-25',
  COLOR_NEUTRAL_50 = '--color-neutral-50',
  COLOR_NEUTRAL_100 = '--color-neutral-100',
  COLOR_NEUTRAL_200 = '--color-neutral-200',
  COLOR_BRAND = '--color-brand',
  COLOR_BORDER_PRIMARY = '--color-border-primary',
  COLOR_BORDER_SECONDARY = '--color-border-secondary',
  BORDER_PRIMARY = '--border-primary',
  BORDER_SECONDARY = '--border-secondary',
  HEADER_BACKGROUND = '--header-background',
  HEADER_TRANSPARENT_BACKGROUND = '--header-transparent-background',
}

type ThemeMap = {
  [key in Theme]: string
}

export const lightTheme: ThemeMap = {
  [Theme.COLOR_WHITE]: '#FFF',
  [Theme.COLOR_BLACK]: '#1F1F1F',
  [Theme.COLOR_TEXT_NORMAL]: '#202020',
  [Theme.COLOR_TEXT_VARIANT]: '#444746',
  [Theme.COLOR_TEXT_DIMMED]: '#747474',
  [Theme.COLOR_PRIMARY_50]: '#EEF4FF',
  [Theme.COLOR_PRIMARY_800]: '#0944BA',
  [Theme.COLOR_PRIMARY_900]: '#023292',
  [Theme.COLOR_NEUTRAL_25]: '#FAFAFA',
  [Theme.COLOR_NEUTRAL_50]: '#F1F1F1',
  [Theme.COLOR_NEUTRAL_100]: '#E6E6E6',
  [Theme.COLOR_NEUTRAL_200]: '#C3C3C3',
  [Theme.COLOR_BRAND]: `var(${Theme.COLOR_PRIMARY_800})`,
  [Theme.COLOR_BORDER_PRIMARY]: '#E7E7E7',
  [Theme.COLOR_BORDER_SECONDARY]: '#F2F2F2',
  [Theme.BORDER_PRIMARY]: `1px solid var(${Theme.COLOR_BORDER_PRIMARY})`,
  [Theme.BORDER_SECONDARY]: `1px solid var(${Theme.COLOR_BORDER_SECONDARY})`,
  [Theme.HEADER_BACKGROUND]: `${colors.white}`,
  [Theme.HEADER_TRANSPARENT_BACKGROUND]: 'rgba(255, 255, 255, 0.8)',
}

export const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  #__next {
    min-height: 100vh;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  ::selection {
    background-color: var(${Theme.COLOR_BRAND});
    color: var(${Theme.COLOR_WHITE});
  }

  html {
    font-size: 62.5%;
    accent-color: var(${Theme.COLOR_BRAND});
    caret-color: var(${Theme.COLOR_BRAND});
    -webkit-tap-highlight-color: transparent;
  }

  :root {
    ${css(lightTheme)}
  }

  body {
    ${sharedValues.styles.fontFamily.inter};
    line-height: 1.5;
    font-size: 1.5rem;
    color: var(${Theme.COLOR_TEXT_NORMAL});
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

  a,
  button {
    ${sharedValues.styles.transition[150]('all')}
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
    background: var(${Theme.COLOR_NEUTRAL_200});
    left: 5px;
    right: 2px;
  }
  .simplebar-scrollbar.simplebar-visible:before {
    opacity: 1;
  }
  // Simplebar - end
`
