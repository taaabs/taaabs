import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { ChatField } from './ChatField'
import { useState } from 'react'

export default {
  component: ChatField,
}

export const Primary = () => {
  const [value, set_value] = useState('')

  return (
    <StorybookMargin>
      <ChatField
        value={value}
        placeholder="Ask anything!"
        on_change={set_value}
        on_submit={() => {
          alert('Submit!')
        }}
        on_website_click={(url) => {
          alert(`Website clicked: ${url}`)
        }}
        on_pin_click={(url) => {
          alert(`Pin clicked: ${url}`)
        }}
        websites={[
          {
            url: 'https://en.wikipedia.org/wiki/Atom',
            title: 'Atom - Wikipedia, wolna encyklopedia',
            length: 1000,
            is_pinned: true,
            is_enabled: true,
          },
          {
            url: 'https://en.wikipedia.org/wiki/Molecule',
            title: 'Molecule - Wikipedia, wolna encyklopedia',
            length: 1000,
            is_pinned: false,
            is_enabled: true,
          },
        ]}
      />
      <StorybookSpacer />
      <ChatField
        value={value}
        placeholder="Ask anything!"
        on_change={set_value}
        on_submit={() => {
          alert('Submit!')
        }}
        on_website_click={(url) => {
          alert(`Website clicked: ${url}`)
        }}
        on_pin_click={(url) => {
          alert(`Pin clicked: ${url}`)
        }}
        websites={[
          {
            url: 'https://en.wikipedia.org/wiki/Molecule',
            title: 'Molecule - Wikipedia, wolna encyklopedia',
            length: 1000,
            is_pinned: false,
            is_enabled: false,
          },
        ]}
      />
      <StorybookSpacer />
      <ChatField
        value={value}
        placeholder="Ask anything!"
        on_change={set_value}
        on_submit={() => {
          alert('Submit!')
        }}
        on_website_click={(url) => {
          alert(`Website clicked: ${url}`)
        }}
        on_pin_click={(url) => {
          alert(`Pin clicked: ${url}`)
        }}
        websites={[]}
      />
    </StorybookMargin>
  )
}
