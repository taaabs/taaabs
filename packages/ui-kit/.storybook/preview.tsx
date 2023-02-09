import React from 'react'
import { GlobalStyles } from '../../../src/styles/GlobalStyles'

export const decorators = [
  (Story) => (
    <>
      <GlobalStyles />
      <Story />
    </>
  ),
]

export const parameters = {
  layout: 'fullscreen',
}
