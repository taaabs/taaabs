import { useState } from 'react'
import browser from 'webextension-polyfill'

export const use_vision_mode = () => {
  const [is_vision_mode, set_is_vision_mode] = useState<boolean>(false)
  const [original_image, set_original_image] = useState<string>()
  const [image, set_image] = useState<string | null>()

  const request_screenshot = async () => {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    })
    if (tab.id) {
      const image_data = await browser.tabs.captureVisibleTab(tab.windowId, {
        format: 'png',
      })
      set_original_image(image_data)
      set_image(image_data)
    }
  }

  const enter_vision_mode = () => {
    set_is_vision_mode(true)
    request_screenshot()
  }

  const exit_vision_mode = () => {
    set_is_vision_mode(false)
    set_image(original_image)
  }

  return {
    is_vision_mode,
    request_screenshot,
    original_image,
    image,
    set_image,
    enter_vision_mode,
    exit_vision_mode,
  }
}
