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
        is_loading={false}
        on_change={() => {}}
        on_focus={() => {}}
        on_submit={() => {}}
        yields_no_results={false}
      />
      <LibrarySearch
        placeholder={'Search in all bookmarks'}
        search_string={'xyz'}
        hints={[]}
        on_click_hint={() => {}}
        on_click_recent_hint_remove={() => {}}
        on_click_clear_search_string={() => {}}
        is_loading={false}
        on_change={() => {}}
        on_focus={() => {}}
        on_submit={() => {}}
        yields_no_results={true}
      />
      <LibrarySearch
        placeholder={'Search in all bookmarks'}
        search_string={''}
        hints={[]}
        on_click_hint={() => {}}
        on_click_recent_hint_remove={() => {}}
        on_click_clear_search_string={() => {}}
        is_loading={true}
        on_change={() => {}}
        on_focus={() => {}}
        on_submit={() => {}}
        yields_no_results={false}
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
        is_loading={false}
        on_change={() => {}}
        on_focus={() => {}}
        on_submit={() => {}}
        yields_no_results={false}
      />
    </div>
  </div>
)
