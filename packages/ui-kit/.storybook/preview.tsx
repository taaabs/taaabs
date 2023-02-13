import React from 'react'
import { ThemeWithGlobalStylesProvider } from '../src/providers'

export const decorators = [
  (Story) => (
    <ThemeWithGlobalStylesProvider>
      <Story />
    </ThemeWithGlobalStylesProvider>
  ),
]

export const parameters = {
  layout: 'fullscreen',
}
