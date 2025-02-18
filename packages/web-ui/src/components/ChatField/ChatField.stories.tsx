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
        context={[
          {
            id: '1',
            title: 'Atom - Wikipedia, wolna encyklopedia',
            is_pinned: true,
          },
          {
            id: '2',
            title: 'Molecule - Wikipedia, wolna encyklopedia',
            is_pinned: false,
          },
        ]}
      />
      <StorybookSpacer />
      <ChatField
        value={value}
        placeholder="Ask anything!"
        on_change={set_value}
        context={[
          {
            id: '2',
            title: 'Molecule - Wikipedia, wolna encyklopedia',
            is_pinned: false,
          },
        ]}
      />
      <StorybookSpacer />
      <ChatField
        value={value}
        placeholder="Ask anything!"
        on_change={set_value}
        context={[]}
      />
    </StorybookMargin>
  )
}
