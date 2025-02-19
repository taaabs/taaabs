import { StorybookMargin } from '@web-ui/helpers/storybook'
import { AssistantSelector } from './AssistantSelector'
import { useState } from 'react'

export default {
  component: AssistantSelector,
}

const ASSISTANTS = [
  {
    name: 'chatgpt',
    label: 'ChatGPT',
    logo_url: 'https://www.google.com/s2/favicons?domain=openai.com&sz=64',
  },
  {
    name: 'gemini',
    label: 'Gemini',
    logo_url:
      'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=64',
  },
  {
    name: 'claude',
    label: 'Claude',
    logo_url: 'https://www.google.com/s2/favicons?domain=claude.ai&sz=64',
  },
]

export const Primary = () => {
  const [selected, set_selected] = useState(ASSISTANTS[0].name)

  return (
    <StorybookMargin>
      <div style={{ display: 'flex' }}>
        <AssistantSelector
          assistants={ASSISTANTS}
          selected_name={selected}
          on_change={set_selected}
        />
      </div>
    </StorybookMargin>
  )
}
