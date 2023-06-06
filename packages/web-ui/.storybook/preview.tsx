import React from 'react'
import { GlobalStylesProvider } from '../src/providers'

import '../src/styles/style.scss'

export const decorators = [
  (Story) => (
    // <GlobalStylesProvider>
    <Story />
    // </GlobalStylesProvider>
  ),
]

export const parameters = {
  layout: 'fullscreen',
}
