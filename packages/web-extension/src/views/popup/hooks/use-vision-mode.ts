import { useEffect, useState } from 'react'
import browser from 'webextension-polyfill'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

export const use_vision_mode = () => {
  const [is_vision_mode, set_is_vision_mode] = useState<boolean>(false)
  const [original_image, set_original_image] = useState<string>()
  const [image, set_image] = useState<string | null>()
  const [is_save_prompt_checked, set_is_save_prompt_checked] =
    useState<boolean>(true)

  const request_screenshot = async () => {
    // Directly capture the current tab without querying first
    const image_data = await browser.tabs.captureVisibleTab(undefined, {
      format: 'png',
    })
    set_original_image(image_data)
    set_image(image_data)
  }

  const enter_vision_mode = () => {
    set_is_vision_mode(true)
    request_screenshot()
  }

  const exit_vision_mode = () => {
    set_is_vision_mode(false)
    set_image(original_image)
  }

  useEffect(() => {
    browser.storage.local
      .get('is_save_prompt_checked')
      .then(({ is_save_prompt_checked }) => {
        if (is_save_prompt_checked !== undefined) {
          set_is_save_prompt_checked(is_save_prompt_checked as boolean)
        }
      })
  }, [])

  useUpdateEffect(() => {
    browser.storage.local.set({
      is_save_prompt_checked: is_save_prompt_checked,
    })
  }, [is_save_prompt_checked])

  return {
    is_vision_mode,
    request_screenshot,
    original_image,
    image,
    set_image,
    enter_vision_mode,
    exit_vision_mode,
    is_save_prompt_checked,
    set_is_save_prompt_checked,
  }
}
