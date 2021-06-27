type BreakpointVals = {
  small: number
  medium: number
  large: number
}

type Breakpoints = {
  smallUp: string
  mediumUp: string
  largeUp: string
}

export const breakpointVals: BreakpointVals = {
  small: 480,
  medium: 768,
  large: 1108
}

export const breakpoints: Breakpoints = {
  smallUp: `(min-width: ${breakpointVals.small + 1}px)`,
  mediumUp: `(min-width: ${breakpointVals.medium + 1}px)`,
  largeUp: `(min-width: ${breakpointVals.large + 1}px)`
}

const mq =
  (breakpoint: string) =>
  (content: string): string =>
    `
    @media ${breakpoint} {
      ${content}
    }
  `

export const mqSmallUp = mq(breakpoints.smallUp)
export const mqMediumUp = mq(breakpoints.mediumUp)
export const mqLargeUp = mq(breakpoints.largeUp)

export default mq
