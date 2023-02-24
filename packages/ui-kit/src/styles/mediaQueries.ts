import { css } from '@emotion/react'

type CSSParams = Parameters<typeof css>

function mediaQueryBuilder(type: 'min' | 'max' | 'only', width: number, nextWidth?: number) {
  return (...styles: any) => {
    if (type == 'only') {
      if (nextWidth !== undefined) {
        return css`
          @media (min-width: ${width}px) and (max-width: calc(${nextWidth}px - 0.02px)) {
            ${css(styles)};
          }
        `
      } else {
        return css`
          @media (min-width: ${width}px) {
            ${css(styles)};
          }
        `
      }
    } else {
      return css`
        @media (${type}-width: calc(${width}px - ${type == 'max' ? '0.02px' : '0px'})) {
          ${css(styles)};
        }
      `
    }
  }
}

const breakpoints = [576, 768, 992, 1200, 1400]

export const mq = {
  at576: mediaQueryBuilder('min', breakpoints[0]),
  to576: mediaQueryBuilder('max', breakpoints[0]),
  only576: mediaQueryBuilder('only', breakpoints[0], breakpoints[1]),
  at768: mediaQueryBuilder('min', breakpoints[1]),
  to768: mediaQueryBuilder('max', breakpoints[1]),
  only768: mediaQueryBuilder('only', breakpoints[1], breakpoints[2]),
  at992: mediaQueryBuilder('min', breakpoints[2]),
  to992: mediaQueryBuilder('max', breakpoints[2]),
  only992: mediaQueryBuilder('only', breakpoints[2], breakpoints[3]),
  at1200: mediaQueryBuilder('min', breakpoints[3]),
  to1200: mediaQueryBuilder('max', breakpoints[3]),
  only1200: mediaQueryBuilder('only', breakpoints[3], breakpoints[4]),
  at1400: mediaQueryBuilder('min', breakpoints[4]),
  to1400: mediaQueryBuilder('max', breakpoints[4]),
  only1400: mediaQueryBuilder('only', breakpoints[4]),
}
