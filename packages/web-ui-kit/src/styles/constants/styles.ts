import { css } from '@emotion/react'
import { createStyleObject } from '@capsizecss/core'
import interMetrics from '@capsizecss/metrics/inter'

const capsizeInter13 = createStyleObject({
  fontSize: 13,
  leading: 10,
  fontMetrics: interMetrics,
})

const capsizeInter15 = createStyleObject({
  fontSize: 15,
  leading: 20,
  fontMetrics: interMetrics,
})

const capsizeInter17 = createStyleObject({
  fontSize: 17,
  leading: 24,
  fontMetrics: interMetrics,
})

export const s = {
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
  capsize: {
    inter13: css`
      ${capsizeInter13}
    `,
    inter15: css`
      ${capsizeInter15}
    `,
    inter17: css`
      ${capsizeInter17}
    `,
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
