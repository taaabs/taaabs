import { Meta } from '@storybook/react'
import { Search } from './Search'
import { StorybookSpacer } from '@web-ui/helpers/storybook'
import { SortBy } from '@shared/types/modules/bookmarks/sort-by'

export default {
  component: LibrarySearch,
} as Meta

export const Primary = () => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ width: 500 }}>
      <LibrarySearch
        search_string={''}
        hints={undefined}
        on_click_hint={() => {}}
        on_click_recent_hint_remove={() => {}}
        is_loading={false}
        on_change={() => {}}
        on_focus={() => {}}
        on_submit={() => {}}
        on_blur={() => {}}
        on_clear_click={() => {}}
        is_focused={false}
        is_slash_shortcut_disabled={false}
        on_click_get_help={() => {}}
        sort_by={SortBy.CREATED_AT}
        toggle_full_text={() => {}}
        translations={{
          footer_tip: 'Lorem ipsum',
          get_help_link: 'Lorem',
          one_moment_please: 'One moment, please...',
          to_search: 'to search',
          type: 'Type',
          placeholder: {
            default: 'a',
            full_text: 'b',
          },
        }}
      />
      <StorybookSpacer />
      <LibrarySearch
        search_string={'lorem ipsum'}
        hints={undefined}
        on_click_hint={() => {}}
        on_click_recent_hint_remove={() => {}}
        is_loading={false}
        on_change={() => {}}
        on_focus={() => {}}
        on_submit={() => {}}
        on_blur={() => {}}
        on_clear_click={() => {}}
        results_count={2137}
        is_focused={false}
        is_slash_shortcut_disabled={false}
        on_click_get_help={() => {}}
        sort_by={SortBy.CREATED_AT}
        toggle_full_text={() => {}}
        translations={{
          footer_tip: 'Lorem ipsum',
          get_help_link: 'Lorem',
          one_moment_please: 'One moment, please...',
          to_search: 'to search',
          type: 'Type',
          placeholder: {
            default: 'a',
            full_text: 'b',
          },
        }}
      />
      <StorybookSpacer />
      <LibrarySearch
        search_string={'lorem site:lorem.com ipsum site:ipsum.com'}
        hints={undefined}
        on_click_hint={() => {}}
        on_click_recent_hint_remove={() => {}}
        is_loading={false}
        on_change={() => {}}
        on_focus={() => {}}
        on_submit={() => {}}
        on_blur={() => {}}
        on_clear_click={() => {}}
        results_count={2137}
        is_focused={false}
        is_slash_shortcut_disabled={false}
        on_click_get_help={() => {}}
        sort_by={SortBy.CREATED_AT}
        toggle_full_text={() => {}}
        translations={{
          footer_tip: 'Lorem ipsum',
          get_help_link: 'Lorem',
          one_moment_please: 'One moment, please...',
          to_search: 'to search',
          type: 'Type',
          placeholder: {
            default: 'a',
            full_text: 'b',
          },
        }}
      />
      <StorybookSpacer />
      <LibrarySearch
        search_string={'lorem ipsum'}
        hints={undefined}
        on_click_hint={() => {}}
        on_click_recent_hint_remove={() => {}}
        is_loading={false}
        on_change={() => {}}
        on_focus={() => {}}
        on_submit={() => {}}
        on_blur={() => {}}
        on_clear_click={() => {}}
        results_count={0}
        is_focused={false}
        is_slash_shortcut_disabled={false}
        on_click_get_help={() => {}}
        sort_by={SortBy.CREATED_AT}
        toggle_full_text={() => {}}
        translations={{
          footer_tip: 'Lorem ipsum',
          get_help_link: 'Lorem',
          one_moment_please: 'One moment, please...',
          to_search: 'to search',
          type: 'Type',
          placeholder: {
            default: 'a',
            full_text: 'b',
          },
        }}
      />
      <StorybookSpacer />
      <LibrarySearch
        search_string={'lorem site:lorem.com ipsum site:ipsum.com'}
        hints={undefined}
        on_click_hint={() => {}}
        on_click_recent_hint_remove={() => {}}
        is_loading={false}
        on_change={() => {}}
        on_focus={() => {}}
        on_submit={() => {}}
        on_blur={() => {}}
        on_clear_click={() => {}}
        results_count={0}
        is_focused={false}
        is_slash_shortcut_disabled={false}
        on_click_get_help={() => {}}
        sort_by={SortBy.CREATED_AT}
        toggle_full_text={() => {}}
        translations={{
          footer_tip: 'Lorem ipsum',
          get_help_link: 'Lorem',
          one_moment_please: 'One moment, please...',
          to_search: 'to search',
          type: 'Type',
          placeholder: {
            default: 'a',
            full_text: 'b',
          },
        }}
      />
      <StorybookSpacer />
      <LibrarySearch
        search_string={'xyz'}
        hints={undefined}
        on_click_hint={() => {}}
        on_click_recent_hint_remove={() => {}}
        is_loading={false}
        on_change={() => {}}
        on_focus={() => {}}
        on_submit={() => {}}
        on_blur={() => {}}
        on_clear_click={() => {}}
        is_focused={false}
        is_slash_shortcut_disabled={false}
        on_click_get_help={() => {}}
        sort_by={SortBy.CREATED_AT}
        toggle_full_text={() => {}}
        translations={{
          footer_tip: 'Lorem ipsum',
          get_help_link: 'Lorem',
          one_moment_please: 'One moment, please...',
          to_search: 'to search',
          type: 'Type',
          placeholder: {
            default: 'a',
            full_text: 'b',
          },
        }}
      />
      <StorybookSpacer />
      <LibrarySearch
        search_string={''}
        hints={undefined}
        on_click_hint={() => {}}
        on_click_recent_hint_remove={() => {}}
        is_loading={true}
        on_change={() => {}}
        on_focus={() => {}}
        on_submit={() => {}}
        on_blur={() => {}}
        on_clear_click={() => {}}
        is_focused={false}
        is_slash_shortcut_disabled={false}
        on_click_get_help={() => {}}
        sort_by={SortBy.CREATED_AT}
        toggle_full_text={() => {}}
        translations={{
          footer_tip: 'Lorem ipsum',
          get_help_link: 'Lorem',
          one_moment_please: 'One moment, please...',
          to_search: 'to search',
          type: 'Type',
          placeholder: {
            default: 'a',
            full_text: 'b',
          },
        }}
      />
      <StorybookSpacer />
      <LibrarySearch
        search_string={'mid'}
        hints={[
          {
            search_string: 'mid',
            completion: 'dle',
            type: 'recent',
          },
          {
            search_string: 'mid',
            completion: 'point',
            type: 'new',
          },
        ]}
        on_click_hint={() => {}}
        on_click_recent_hint_remove={() => {}}
        is_loading={false}
        on_change={() => {}}
        on_focus={() => {}}
        on_submit={() => {}}
        on_blur={() => {}}
        on_clear_click={() => {}}
        is_focused={true}
        is_slash_shortcut_disabled={false}
        on_click_get_help={() => {}}
        sort_by={SortBy.CREATED_AT}
        toggle_full_text={() => {}}
        translations={{
          footer_tip: 'Lorem ipsum',
          get_help_link: 'Lorem',
          one_moment_please: 'One moment, please...',
          to_search: 'to search',
          type: 'Type',
          placeholder: {
            default: 'a',
            full_text: 'b',
          },
        }}
      />
      <StorybookSpacer />
      <StorybookSpacer />
      <StorybookSpacer />
      <LibrarySearch
        search_string={'mid'}
        hints={[]}
        on_click_hint={() => {}}
        on_click_recent_hint_remove={() => {}}
        is_loading={false}
        on_change={() => {}}
        on_focus={() => {}}
        on_submit={() => {}}
        on_blur={() => {}}
        on_clear_click={() => {}}
        is_focused={true}
        is_slash_shortcut_disabled={false}
        on_click_get_help={() => {}}
        sort_by={SortBy.CREATED_AT}
        toggle_full_text={() => {}}
        translations={{
          footer_tip: 'Lorem ipsum',
          get_help_link: 'Lorem',
          one_moment_please: 'One moment, please...',
          to_search: 'to search',
          type: 'Type',
          placeholder: {
            default: 'a',
            full_text: 'b',
          },
        }}
      />
    </div>
  </div>
)
