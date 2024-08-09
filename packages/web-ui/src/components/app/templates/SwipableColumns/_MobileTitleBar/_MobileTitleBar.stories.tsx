import React from 'react'
import { _MobileTitleBar } from './_MobileTitleBar'

export default {
  component: _MobileTitleBar,
}

export const Primary = () => (
  <_MobileTitleBar
    swipe_left_on_click={() => {}}
    swipe_right_on_click={() => {}}
    text="lorem"
  />
)
