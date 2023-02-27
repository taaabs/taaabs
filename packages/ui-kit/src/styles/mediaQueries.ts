const breakpoints = [576, 768, 992, 1200, 1400]

export const mq = {
  at576: `@media (min-width: ${breakpoints[0]}px)`,
  to576: `@media (max-width: ${breakpoints[0]}px)`,
  at768: `@media (min-width: ${breakpoints[1]}px)`,
  to768: `@media (max-width: ${breakpoints[1]}px)`,
  only768: `@media (min-width: ${breakpoints[0]}px) and (max-width: ${
    breakpoints[1] - 0.02
  }px)`,
  at992: `@media (min-width: ${breakpoints[2]}px)`,
  to992: `@media (max-width: ${breakpoints[2]}px)`,
  only992: `@media (min-width: ${breakpoints[2]}px) and (max-width: ${
    breakpoints[3] - 0.02
  }px)`,
  at1200: `@media (min-width: ${breakpoints[3]}px)`,
  to1200: `@media (max-width: ${breakpoints[3]}px)`,
  only1200: `@media (min-width: ${breakpoints[3]}px) and (max-width: ${
    breakpoints[4] - 0.02
  }px)`,
  at1400: `@media (min-width: ${breakpoints[4]}px)`,
  to1400: `@media (max-width: ${breakpoints[4]}px)`,
}
