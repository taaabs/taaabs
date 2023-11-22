import { Meta } from '@storybook/react'
import { LibrarySearch } from './library-search'
import { StorybookSpacer } from '@web-ui/helpers/storybook/storybook-spacer'

export default {
  component: LibrarySearch,
} as Meta

export const Primary = () => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ width: 500 }}>
      <LibrarySearch
        placeholder={'Search in all bookmarks'}
        search_string={''}
        hints={[]}
        on_click_hint={() => {}}
        on_click_recent_hint_remove={() => {}}
        on_click_clear_search_string={() => {}}
      />
      <StorybookSpacer />
      <LibrarySearch
        placeholder={'Search in all bookmarks'}
        search_string={'hania'}
        hints={[
          { text: 'hania rani', type: 'recent' },
          { text: 'hania rani live', type: 'new' },
          { text: 'hania rani leaving', type: 'new' },
        ]}
        on_click_hint={() => {}}
        on_click_recent_hint_remove={() => {}}
        on_click_clear_search_string={() => {}}
      />
    </div>
  </div>
)
