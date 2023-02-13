import { css } from '@emotion/react'

const breakpoints = {
  '480': '480px',
  '768': '768px',
  '992': '992px',
  '1250': '1250px',
}

type CSSParams = Parameters<typeof css>

const keys = Object.keys(breakpoints) as Array<keyof typeof breakpoints>

const reducer = (type: 'min' | 'max') =>
  keys.reduce((accumulator, label) => {
    accumulator[label] = (...args: CSSParams) => {
      return css`
        @media (${type}-width: calc(${breakpoints[label]} - ${type == 'max'
            ? '1px'
            : '0px'})) {
          ${css(...args)};
        }
      `
    }
    return accumulator
  }, {} as Record<keyof typeof breakpoints, Function>)

export const to = reducer('max')
export const at = reducer('min')
