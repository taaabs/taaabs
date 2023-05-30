import { css } from '@emotion/react'
import { mq } from '../../constants/mediaQueries'
import { colors, s } from '@/styles/constants'

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
  BOOKMARK_BACKGROUND = '--bookmark-background',
  BOOKMARK_LINK = '--bookmark-link',
  BOOKMARK_SITE_FOREGROUND = '--bookmark-site-foreground',
  BOOKMARK_TAG_BORDER_COLOR = '--bookmark-tag-border-color',
  BOOKMARK_TAG_BACKGROUND = '--bookmark-tag-background',
  BOOKMARK_TAG_FOREGROUND = '--bookmark-tag-foreground',
  BOOKMARK_TAG_HOVER_BORDER_COLOR = '--bookmark-tag-hover-border-color',
  BOOKMARK_TAG_HOVER_BACKGROUND = '--bookmark-tag-hover-background',
  BOOKMARK_TAG_HOVER_FOREGROUND = '--bookmark-tag-hover-foreground',
  BOOKMARK_NSFW = '--bookmark-nsfw',
  BOOKMARK_STARRED_TITLE_HIGHLIGHT = '--bookmark-starred-title-highlight',
  BOOKMARK_ACTION_FILL = '--bookmark-action-fill',
  BOOKMARK_ACTION_FILL_HOVER = '--bookmark-action-fill-hover',
  TITLE_BAR_BACKGROUND = '--title-bar-background',
  TITLE_BAR_PRIMARY_TEXT = '--title-bar-primary-text',
  TITLE_BAR_SECONDARY_TEXT = '--title-bar-secondary-text',
}

type ThemeMap = {
  [key in Theme]: string
}

export const lightTheme: ThemeMap = {
  [Theme.COLOR_WHITE]: '#FFF',
  [Theme.COLOR_BLACK]: colors.neutral[950],
  [Theme.COLOR_TEXT_NORMAL]: colors.neutral[900],
  [Theme.COLOR_TEXT_VARIANT]: colors.neutral[700],
  [Theme.COLOR_TEXT_DIMMED]: colors.neutral[500],
  [Theme.COLOR_PRIMARY_50]: '#EEF4FF',
  [Theme.COLOR_PRIMARY_800]: '#0944BA',
  [Theme.COLOR_PRIMARY_900]: '#023292',
  [Theme.COLOR_NEUTRAL_25]: '#FAFAFA',
  [Theme.COLOR_NEUTRAL_50]: '#F1F1F1',
  [Theme.COLOR_NEUTRAL_100]: '#E6E6E6',
  [Theme.COLOR_NEUTRAL_200]: '#C3C3C3',
  [Theme.COLOR_BRAND]: colors.blue[800],
  [Theme.COLOR_BORDER_PRIMARY]: colors.neutral[200],
  [Theme.COLOR_BORDER_SECONDARY]: colors.neutral[100],
  [Theme.BORDER_PRIMARY]: `1px solid var(${Theme.COLOR_BORDER_PRIMARY})`,
  [Theme.BORDER_SECONDARY]: `1px solid var(${Theme.COLOR_BORDER_SECONDARY})`,
  [Theme.HEADER_BACKGROUND]: colors.white,
  [Theme.HEADER_TRANSPARENT_BACKGROUND]: 'rgba(255, 255, 255, 0.8)',
  [Theme.BOOKMARK_BACKGROUND]: colors.white,
  [Theme.BOOKMARK_SITE_FOREGROUND]: colors.amber[800],
  [Theme.BOOKMARK_LINK]: colors.blue[800],
  [Theme.BOOKMARK_TAG_BORDER_COLOR]: colors.green[100],
  [Theme.BOOKMARK_TAG_BACKGROUND]: colors.green[50],
  [Theme.BOOKMARK_TAG_FOREGROUND]: colors.green[600],
  [Theme.BOOKMARK_TAG_HOVER_BORDER_COLOR]: colors.green[200],
  [Theme.BOOKMARK_TAG_HOVER_BACKGROUND]: colors.green[100],
  [Theme.BOOKMARK_TAG_HOVER_FOREGROUND]: colors.green[700],
  [Theme.BOOKMARK_NSFW]: colors.red[600],
  [Theme.BOOKMARK_STARRED_TITLE_HIGHLIGHT]: colors.amber[100],
  [Theme.BOOKMARK_ACTION_FILL]: colors.neutral[400],
  [Theme.BOOKMARK_ACTION_FILL_HOVER]: colors.neutral[600],
  [Theme.TITLE_BAR_BACKGROUND]: colors.blue[50],
  [Theme.TITLE_BAR_PRIMARY_TEXT]: colors.blue[800],
  [Theme.TITLE_BAR_SECONDARY_TEXT]: colors.blue[500],
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
    ${s.fontFamily.inter};
    line-height: 1.4;
    font-size: 15px;
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
    cursor: pointer;
  }

  a,
  button {
    ${s.transition[100]('all')}
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
      touch-action: manipulation; // https://github.com/Mango/slideout/issues/205#issuecomment-823927561
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
