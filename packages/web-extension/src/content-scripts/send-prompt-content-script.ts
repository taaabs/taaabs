import { AssistantName } from '@/constants/assistants'
import browser from 'webextension-polyfill'
import { is_message } from '@/utils/is-message'

// When testing each supported assistant, make sure to test both, desktop and mobile screens.

const is_open_webui = document.title.includes('Open WebUI')

browser.runtime.onMessage.addListener(async (message, _, __) => {
  if (is_message(message) && message.action == 'send-prompt') {
    const assistant_name = message.assistant_name

    await AssistantBugMitigation.on_load({ assistant_name })

    // Handle image upload if present
    if (message.image) {
      await handle_image_upload({
        assistant_name,
        image: message.image,
      })
    }

    // Send prompt
    const prompt = message.plain_text
      ? `<instruction>\n${message.prompt}\n</instruction>\n<text>\n${message.plain_text}\n</text>`
      : message.prompt
    send_prompt({ prompt, assistant_name })
  }
})

const handle_image_upload = async (params: {
  assistant_name: AssistantName
  image: string
}) => {
  let file_input_selector = 'input[type="file"]'
  if (params.assistant_name == 'mistral') {
    file_input_selector = 'input[type="file"][name="img-upload"]'
  }

  // In OpenWebUI and ChatGPT file input is not immediately available
  if (is_open_webui || params.assistant_name == 'chatgpt') {
    await new Promise(async (resolve) => {
      while (!document.querySelector(file_input_selector)) {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(true)
          }, 100)
        })
      }
      resolve(null)
    })
  }

  const file_input = document.querySelector(
    file_input_selector,
  ) as HTMLInputElement
  if (file_input) {
    const blob = await fetch(params.image).then((res) => res.blob())
    const file = new File([blob], 'image.png', { type: 'image/png' })
    const data_transfer = new DataTransfer()
    data_transfer.items.add(file)
    file_input.files = data_transfer.files
    file_input.dispatchEvent(new Event('change', { bubbles: true }))
    if (params.assistant_name == 'chatgpt') {
      await new Promise(async (resolve) => {
        while (
          document.querySelector('button[data-testid="send-button"][disabled]')
        ) {
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve(true)
            }, 100)
          })
        }
        resolve(null)
      })
    } else if (params.assistant_name == 'claude') {
      await new Promise(async (resolve) => {
        while (
          !document.querySelector(
            '.hover\\:scale-105.transition.p-1.rounded-full.-translate-y-1\\/2.-translate-x-1\\/2.hover\\:text-oncolor-100.hover\\:bg-danger-100.bg-bg-000.text-text-500.border-border-200.border-0\\.5',
          )
        ) {
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve(true)
            }, 100)
          })
        }
        resolve(null)
      })
    } else if (params.assistant_name == 'mistral') {
      await new Promise(async (resolve) => {
        while (
          !document.querySelector(
            '.object-cover.rounded-md.max-w-full.w-full.max-h-full.h-full',
          )
        ) {
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve(true)
            }, 100)
          })
        }
        resolve(null)
      })
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 500)
      })
    } else if (is_open_webui) {
      await new Promise(async (resolve) => {
        while (!document.querySelector('img[alt="input"]')) {
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve(true)
            }, 100)
          })
        }
        resolve(null)
      })
    }
  }
}

const send_prompt = async (params: {
  prompt: string
  assistant_name: AssistantName
}) => {
  try {
    const input_element = AssistantBugMitigation.get_input_element(
      params.assistant_name,
    )

    if (input_element && input_element.isContentEditable) {
      // Handle contenteditable element
      input_element.innerText = params.prompt

      // Dispatch input and change events
      input_element.dispatchEvent(new Event('input', { bubbles: true }))
      input_element.dispatchEvent(new Event('change', { bubbles: true }))

      const form = input_element.closest('form')

      if (params.assistant_name == 'gemini') {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(true)
          }, 0)
        })
        ;(
          document.querySelector('mat-icon[fonticon="send"]') as HTMLElement
        ).click()
      } else if (params.assistant_name == 'claude') {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(true)
          }, 500)
        })
        ;(
          document.querySelector(
            'fieldset > div:first-child button',
          ) as HTMLElement
        ).click()
      } else if (form) {
        setTimeout(() => {
          form.requestSubmit()
        }, 0)
      } else {
        const enter_event = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
        })
        input_element.dispatchEvent(enter_event)
      }
    } else if (input_element && input_element.tagName == 'TEXTAREA') {
      // Handle input or textarea element
      ;(input_element as HTMLTextAreaElement).value = params.prompt

      // Dispatch input and change events
      input_element.dispatchEvent(new Event('input', { bubbles: true }))
      input_element.dispatchEvent(new Event('change', { bubbles: true }))

      const form = input_element.closest('form')
      if (form) {
        setTimeout(() => {
          form.requestSubmit()
        }, 0)
      } else if (params.assistant_name == 'cohere') {
        ;(
          document.querySelector(
            '.hover\\:bg-mushroom-100.text-mushroom-800.ease-in-out.transition.rounded.justify-center.items-center.flex-shrink-0.flex.md\\:my-4.ml-1.my-2.w-8.h-8',
          ) as HTMLElement
        )?.click()
      } else if (params.assistant_name == 'mistral') {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(true)
          }, 0)
        })
        ;(
          document.querySelector(
            'button[aria-label="Send question"]',
          ) as HTMLElement
        ).click()
      } else if (params.assistant_name == 'grok') {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(true)
          }, 0)
        })
        ;(
          document.querySelector(
            'button[aria-label="Grok something"]',
          ) as HTMLElement
        ).click()
      } else if (params.assistant_name == 'aistudio') {
        await new Promise(async (resolve) => {
          while (
            document.querySelector('run-button > button[aria-disabled="true"]')
          ) {
            await new Promise((resolve) => {
              setTimeout(() => {
                resolve(true)
              }, 100)
            })
          }
          resolve(null)
        })
        setTimeout(() => {
          ;(
            document.querySelector('run-button > button') as HTMLElement
          )?.click()
        }, 0)
      } else {
        const enter_event = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
        })
        input_element.dispatchEvent(enter_event)
      }
    } else {
      throw new Error()
    }
  } catch {
    setTimeout(() => send_prompt(params), 100)
  }
}

namespace AssistantBugMitigation {
  export const on_load = async (params: { assistant_name: AssistantName }) => {
    // AI Studio and Mistral needs a little time before are ready to take a prompt.
    if (params.assistant_name == 'mistral') {
      await new Promise(async (resolve) => {
        while (
          document.querySelector(
            'template[data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING"]',
          )
        ) {
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve(true)
            }, 100)
          })
        }
        resolve(null)
      })
    } else if (params.assistant_name == 'copilot') {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 2000)
      })
    }
  }

  export const get_input_element = (assistant_name: AssistantName) => {
    let active_element = document.activeElement as HTMLElement

    const chatbot_selectors: Partial<Record<AssistantName, string>> = {
      claude: 'div[contenteditable=true] > p',
      mistral: 'textarea',
      gemini: 'div[role="textbox"]', // Needed in mobile viewport
      grok: 'textarea', // Needed in mobile viewport
      deepseek: 'textarea', // Needed in mobile viewport
    }

    const selector = chatbot_selectors[assistant_name]
    if (selector) {
      active_element = document.querySelector(selector) as HTMLElement
    }

    return active_element
  }
}
