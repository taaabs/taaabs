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
        hints={undefined}
        on_click_hint={() => {}}
        on_click_recent_hint_remove={() => {}}
        on_click_clear_search_string={() => {}}
        is_loading={false}
        on_change={() => {}}
        on_focus={() => {}}
        on_submit={() => {}}
        on_blur={() => {}}
        on_clear_click={() => {}}
      />
      <StorybookSpacer />
      <LibrarySearch
        placeholder={'Search in all bookmarks'}
        search_string={'lorem ipsum'}
        hints={undefined}
        on_click_hint={() => {}}
        on_click_recent_hint_remove={() => {}}
        on_click_clear_search_string={() => {}}
        is_loading={false}
        on_change={() => {}}
        on_focus={() => {}}
        on_submit={() => {}}
        on_blur={() => {}}
        on_clear_click={() => {}}
        results_count={2137}
      />
      <LibrarySearch
        placeholder={'Search in all bookmarks'}
        search_string={'lorem ipsum'}
        hints={undefined}
        on_click_hint={() => {}}
        on_click_recent_hint_remove={() => {}}
        on_click_clear_search_string={() => {}}
        is_loading={false}
        on_change={() => {}}
        on_focus={() => {}}
        on_submit={() => {}}
        on_blur={() => {}}
        on_clear_click={() => {}}
        results_count={0}
      />
      <StorybookSpacer />
      <LibrarySearch
        placeholder={'Search in all bookmarks'}
        search_string={'xyz'}
        hints={undefined}
        on_click_hint={() => {}}
        on_click_recent_hint_remove={() => {}}
        on_click_clear_search_string={() => {}}
        is_loading={false}
        on_change={() => {}}
        on_focus={() => {}}
        on_submit={() => {}}
        on_blur={() => {}}
        on_clear_click={() => {}}
      />
      <StorybookSpacer />
      <LibrarySearch
        placeholder={'Search in all bookmarks'}
        search_string={''}
        hints={undefined}
        on_click_hint={() => {}}
        on_click_recent_hint_remove={() => {}}
        on_click_clear_search_string={() => {}}
        is_loading={true}
        on_change={() => {}}
        on_focus={() => {}}
        on_submit={() => {}}
        on_blur={() => {}}
        on_clear_click={() => {}}
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
        on_blur={() => {}}
        on_clear_click={() => {}}
      />
    </div>
  </div>
)
