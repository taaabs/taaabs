import { css } from '@emotion/react'

export const numeric = {
  siteMaxWidth: 1380,
  headerDesktop: 63,
  headerMobile: 45,
  bottomNavigationBar: 49,
  appBar: 63,
  spacer: {
    8: 8,
    12: 12,
    16: 16,
    20: 20,
    24: 24,
    40: 40,
    60: 60,
  },
}


export const styles = {
  fontFamily: {
    inter: css`
      font-family: 'Inter', sans-serif;
    `,
    plusJakartaSans: css`
      font-family: 'Plus Jakarta Sans', sans-serif;
    `,
  },
  fontSize: {
    13: {
      px: css`
        font-size: 13px;
      `,
      rem: css`
        font-size: 1.3rem;
      `,
    },
    15: {
      px: css`
        font-size: 15px;
      `,
      rem: css`
        font-size: 1.5rem;
      `,
    },
    16: {
      px: css`
        font-size: 16px;
      `,
      rem: css`
        font-size: 1.6rem;
      `,
    },
    17: {
      px: css`
        font-size: 17px;
      `,
      rem: css`
        font-size: 1.7rem;
      `,
    },
    20: {
      px: css`
        font-size: 20px;
      `,
      rem: css`
        font-size: 2rem;
      `,
    },
  },
  fontWeight: {
    inter: {
      medium: css`
        font-weight: 500;
      `,
      semiBold: css`
        font-weight: 600;
      `,
      bold: css`
        font-weight: 700;
      `,
    },
    plusJakartaSans: {
      medium: css`
        font-weight: 500;
      `,
      semiBold: css`
        font-weight: 600;
      `,
      bold: css`
        font-weight: 700;
      `,
    },
  },
  transition: {
    150: (transitionProperty: string) =>
      css`
        transition: ${transitionProperty} 0.15s ease-in-out;
      `,
    300: (transitionProperty: string) =>
      css`
        transition: ${transitionProperty} 0.3s ease-in-out;
      `,
  },
  iconSize: {
    20: css`
      width: 20px;
      height: 20px;
    `,
    24: css`
      width: 24px;
      height: 24px;
    `,
  },
  buttonHeight: {
    34: css`
      height: 34px;
    `,
    40: css`
      height: 40px;
    `,
    46: css`
      height: 46px;
    `,
  },
  buttonSize: {
    34: css`
      height: 34px;
      width: 34px;
    `,
    40: css`
      height: 40px;
      width: 40px;
    `,
  },
  borderRadius: {
    4: css`
      border-radius: 4px;
    `,
    8: css`
      border-radius: 8px;
    `,
    10: css`
      border-radius: 10px;
    `,
    12: css`
      border-radius: 12px;
    `,
    14: css`
      border-radius: 14px;
    `,
    999: css`
      border-radius: 999px;
    `,
  },
  backdropFilter: {
    desktopHeader: css`
      backdrop-filter: saturate(180%) blur(5px);
    `,
  },
}
