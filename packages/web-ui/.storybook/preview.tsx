import React from 'react'
import { GlobalStylesProvider } from '../src/providers'

export const decorators = [
  (Story) => (
    <GlobalStylesProvider>
      <Story />
    </GlobalStylesProvider>
  ),
]

export const parameters = {
  layout: 'fullscreen',
}
