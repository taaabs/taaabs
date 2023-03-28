import { css } from '@emotion/react'
import { mq } from './mediaQueries'

export const enum Theme {
  FONT_FAMILY_INTER = '--font-family-inter',
  FONT_FAMILY_SPACE_GROTESK = '--font-family-space-grotesk',
  FONT_SIZE_12_PX = '--font-size-12-px',
  FONT_SIZE_14_PX = '--font-size-14-px',
  FONT_SIZE_16_PX = '--font-size-16-px',
  FONT_SIZE_18_PX = '--font-size-18-px',
  FONT_SIZE_20_PX = '--font-size-20-px',
  FONT_SIZE_12_REM = '--font-size-12',
  FONT_SIZE_14_REM = '--font-size-14',
  FONT_SIZE_16_REM = '--font-size-16',
  FONT_SIZE_18_REM = '--font-size-18',
  FONT_SIZE_20_REM = '--font-size-20',
  FONT_WEIGHT_INTER_MEDIUM = '--font-weight-inter-medium',
  FONT_WEIGHT_INTER_SEMIBOLD = '--font-weight-inter-semibold',
  FONT_WEIGHT_INTER_BOLD = '--font-weight-inter-bold',
  FONT_SPACE_GROTESK_WEIGHT_MEDIUM = '--font-space-grotesk-weight-medium',
  FONT_SPACE_GROTESK_WEIGHT_BOLD = '--font-space-grotesk-weight-bold',
  BORDER_RADIUS_4 = '--border-radius-4',
  BORDER_RADIUS_8 = '--border-radius-8',
  BORDER_RADIUS_10 = '--border-radius-10',
  BORDER_RADIUS_12 = '--border-radius-12',
  BORDER_RADIUS_14 = '--border-radius-14',
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
  SPACER_8 = '--spacer-8',
  SPACER_16 = '--spacer-15',
  SPACER_40 = '--spacer-40',
  SPACER_60 = '--spacer-60',
  BORDER_PRIMARY = '--border-primary',
  BORDER_SECONDARY = '--border-secondary',
  BUTTON_HEIGHT_34 = '--button-height-34',
  BUTTON_HEIGHT_40 = '--button-height-40',
  BUTTON_HEIGHT_46 = '--button-height-46',
  MOBILE_TOP_BAR_HEIGHT = '--mobile-top-bar-height',
  ANIMATION_DURATION_150 = '--animation-duration-150',
  ANIMATION_DURATION_300 = '--animation-duration-300',
  TRANSITION_TIMING_FUNCTION = '--transition-timing-function',
  TRANSITION_HOVER = '--transition-hover',
}

type ThemeMap = {
  [key in Theme]: string
}

const defaultTheme: ThemeMap = {
  [Theme.FONT_FAMILY_INTER]: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Twemoji Country Flags", "Segoe UI Emoji", "Segoe UI Symbol"`,
  [Theme.FONT_FAMILY_SPACE_GROTESK]: `"Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  [Theme.FONT_SIZE_12_PX]: '12px',
  [Theme.FONT_SIZE_14_PX]: '14px',
  [Theme.FONT_SIZE_16_PX]: '16px',
  [Theme.FONT_SIZE_18_PX]: '18px',
  [Theme.FONT_SIZE_20_PX]: '20px',
  [Theme.FONT_SIZE_12_REM]: '1.2rem',
  [Theme.FONT_SIZE_14_REM]: '1.4rem',
  [Theme.FONT_SIZE_16_REM]: '1.6rem',
  [Theme.FONT_SIZE_18_REM]: '1.8rem',
  [Theme.FONT_SIZE_20_REM]: '2rem',
  [Theme.FONT_WEIGHT_INTER_MEDIUM]: '500',
  [Theme.FONT_WEIGHT_INTER_SEMIBOLD]: '600',
  [Theme.FONT_WEIGHT_INTER_BOLD]: '700',
  [Theme.FONT_SPACE_GROTESK_WEIGHT_MEDIUM]: '500',
  [Theme.FONT_SPACE_GROTESK_WEIGHT_BOLD]: '700',
  [Theme.BORDER_RADIUS_4]: '4px',
  [Theme.BORDER_RADIUS_8]: '8px',
  [Theme.BORDER_RADIUS_10]: '10px',
  [Theme.BORDER_RADIUS_12]: '12px',
  [Theme.BORDER_RADIUS_14]: '14px',
  [Theme.COLOR_WHITE]: '#FFF',
  [Theme.COLOR_BLACK]: '#1F1F1F',
  [Theme.COLOR_TEXT_NORMAL]: '#202020',
  [Theme.COLOR_TEXT_VARIANT]: '#444746',
  [Theme.COLOR_TEXT_DIMMED]: '#747474',
  [Theme.COLOR_PRIMARY_50]: '#EEF4FF',
  [Theme.COLOR_PRIMARY_800]: '#0944BA',
  [Theme.COLOR_PRIMARY_900]: '#083a9e',
  [Theme.COLOR_NEUTRAL_25]: '#FAFAFA',
  [Theme.COLOR_NEUTRAL_50]: '#F1F1F1',
  [Theme.COLOR_NEUTRAL_100]: '#E6E6E6',
  [Theme.COLOR_NEUTRAL_200]: '#C3C3C3',
  [Theme.COLOR_BRAND]: `var(${Theme.COLOR_PRIMARY_800})`,
  [Theme.COLOR_BORDER_PRIMARY]: '#E7E7E7',
  [Theme.COLOR_BORDER_SECONDARY]: '#F2F2F2',
  [Theme.SPACER_8]: '8px',
  [Theme.SPACER_16]: '15px',
  [Theme.SPACER_40]: '40px',
  [Theme.SPACER_60]: '60px',
  [Theme.BORDER_PRIMARY]: `1px solid var(${Theme.COLOR_BORDER_PRIMARY})`,
  [Theme.BORDER_SECONDARY]: `1px solid var(${Theme.COLOR_BORDER_SECONDARY})`,
  [Theme.BUTTON_HEIGHT_34]: '34px',
  [Theme.BUTTON_HEIGHT_40]: '40px',
  [Theme.BUTTON_HEIGHT_46]: '46px',
  [Theme.MOBILE_TOP_BAR_HEIGHT]: '62px',
  [Theme.ANIMATION_DURATION_150]: '150ms',
  [Theme.ANIMATION_DURATION_300]: '300ms',
  [Theme.TRANSITION_TIMING_FUNCTION]: 'ease-in-out',
  [Theme.TRANSITION_HOVER]: 'all 150ms ease-in-out',
}

export const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap');

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
  }

  :root {
    ${css(defaultTheme)}
  }

  body {
    font-family: var(${Theme.FONT_FAMILY_INTER});
    line-height: 1.5;
    font-size: 1.4rem;
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
    transition: var(${Theme.TRANSITION_HOVER});
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
      border-color: var(${Theme.COLOR_BORDER_PRIMARY});
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
