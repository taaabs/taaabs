import { css } from '@emotion/react'
import { createStyleObject } from '@capsizecss/core'
import interMetrics from '@capsizecss/metrics/inter'

const capsizeInter13 = createStyleObject({
  fontSize: 13,
  lineGap: 6,
  fontMetrics: interMetrics,
})

const capsizeInter15 = createStyleObject({
  fontSize: 15,
  lineGap: 10,
  fontMetrics: interMetrics,
})

const capsizeInter17 = createStyleObject({
  fontSize: 17,
  lineGap: 12,
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
    22: {
      px: css`
        font-size: 22px;
      `,
      rem: css`
        font-size: 2.2rem;
      `,
    },
    26: {
      px: css`
        font-size: 26px;
      `,
      rem: css`
        font-size: 2.6rem;
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
    inter13: {
      px: css(capsizeInter13),
      rem: css({
        '::before': capsizeInter13['::before'],
        '::after': capsizeInter13['::after'],
        fontSize: `${parseFloat(capsizeInter13.fontSize.slice(0, -2)) / 10}rem`,
        lineHeight: `${
          parseFloat(capsizeInter13.lineHeight.slice(0, -2)) / 10
        }rem`,
      }),
    },
    inter15: {
      px: css(capsizeInter15),
      rem: css({
        '::before': capsizeInter15['::before'],
        '::after': capsizeInter15['::after'],
        fontSize: `${parseFloat(capsizeInter15.fontSize.slice(0, -2)) / 10}rem`,
        lineHeight: `${
          parseFloat(capsizeInter15.lineHeight.slice(0, -2)) / 10
        }rem`,
      }),
    },
    inter17: {
      px: css(capsizeInter17),
      rem: css({
        '::before': capsizeInter17['::before'],
        '::after': capsizeInter17['::after'],
        fontSize: `${parseFloat(capsizeInter17.fontSize.slice(0, -2)) / 10}rem`,
        lineHeight: `${
          parseFloat(capsizeInter17.lineHeight.slice(0, -2)) / 10
        }rem`,
      }),
    },
  },
  transition: {
    100: (transitionProperty: string) =>
      css`
        transition: ${transitionProperty} 0.1s linear;
      `,
    300: (transitionProperty: string) =>
      css`
        transition: ${transitionProperty} 0.3s ease-in-out;
      `,
  },
  iconSize: {
    18: css`
      width: 18px;
      height: 18px;
    `,
    20: css`
      width: 20px;
      height: 20px;
    `,
    24: css`
      width: 24px;
      height: 24px;
    `,
    26: css`
      width: 26px;
      height: 26px;
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
