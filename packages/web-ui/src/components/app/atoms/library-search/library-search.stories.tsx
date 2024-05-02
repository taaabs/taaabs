import { Meta } from '@storybook/react'
import { LibrarySearch } from './library-search'
import { StorybookSpacer } from '@web-ui/helpers/storybook'

export default {
  component: LibrarySearch,
} as Meta

export const Primary = () => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ width: 500 }}>
      <LibrarySearch
        placeholder_={'Search in all bookmarks'}
        search_string_={''}
        hints_={undefined}
        on_click_hint_={() => {}}
        on_click_recent_hint_remove_={() => {}}
        is_loading_={false}
        on_change_={() => {}}
        on_focus_={() => {}}
        on_submit_={() => {}}
        on_blur_={() => {}}
        on_clear_click_={() => {}}
        is_focused_={false}
        is_slash_shortcut_disabled_={false}
        on_click_get_help_={() => {}}
        translations_={{
          footer_tip_: 'Lorem ipsum',
          get_help_link_: 'Lorem',
        }}
      />
      <StorybookSpacer />
      <LibrarySearch
        placeholder_={'Search in all bookmarks'}
        search_string_={'lorem ipsum'}
        hints_={undefined}
        on_click_hint_={() => {}}
        on_click_recent_hint_remove_={() => {}}
        is_loading_={false}
        on_change_={() => {}}
        on_focus_={() => {}}
        on_submit_={() => {}}
        on_blur_={() => {}}
        on_clear_click_={() => {}}
        results_count_={2137}
        is_focused_={false}
        is_slash_shortcut_disabled_={false}
        on_click_get_help_={() => {}}
        translations_={{
          footer_tip_: 'Lorem ipsum',
          get_help_link_: 'Lorem',
        }}
      />
      <StorybookSpacer />
      <LibrarySearch
        placeholder_={'Search in all bookmarks'}
        search_string_={'lorem site:lorem.com ipsum site:ipsum.com'}
        hints_={undefined}
        on_click_hint_={() => {}}
        on_click_recent_hint_remove_={() => {}}
        is_loading_={false}
        on_change_={() => {}}
        on_focus_={() => {}}
        on_submit_={() => {}}
        on_blur_={() => {}}
        on_clear_click_={() => {}}
        results_count_={2137}
        is_focused_={false}
        is_slash_shortcut_disabled_={false}
        on_click_get_help_={() => {}}
        translations_={{
          footer_tip_: 'Lorem ipsum',
          get_help_link_: 'Lorem',
        }}
      />
      <StorybookSpacer />
      <LibrarySearch
        placeholder_={'Search in all bookmarks'}
        search_string_={'lorem ipsum'}
        hints_={undefined}
        on_click_hint_={() => {}}
        on_click_recent_hint_remove_={() => {}}
        is_loading_={false}
        on_change_={() => {}}
        on_focus_={() => {}}
        on_submit_={() => {}}
        on_blur_={() => {}}
        on_clear_click_={() => {}}
        results_count_={0}
        is_focused_={false}
        is_slash_shortcut_disabled_={false}
        on_click_get_help_={() => {}}
        translations_={{
          footer_tip_: 'Lorem ipsum',
          get_help_link_: 'Lorem',
        }}
      />
      <StorybookSpacer />
      <LibrarySearch
        placeholder_={'Search in all bookmarks'}
        search_string_={'lorem site:lorem.com ipsum site:ipsum.com'}
        hints_={undefined}
        on_click_hint_={() => {}}
        on_click_recent_hint_remove_={() => {}}
        is_loading_={false}
        on_change_={() => {}}
        on_focus_={() => {}}
        on_submit_={() => {}}
        on_blur_={() => {}}
        on_clear_click_={() => {}}
        results_count_={0}
        is_focused_={false}
        is_slash_shortcut_disabled_={false}
        on_click_get_help_={() => {}}
        translations_={{
          footer_tip_: 'Lorem ipsum',
          get_help_link_: 'Lorem',
        }}
      />
      <StorybookSpacer />
      <LibrarySearch
        placeholder_={'Search in all bookmarks'}
        search_string_={'xyz'}
        hints_={undefined}
        on_click_hint_={() => {}}
        on_click_recent_hint_remove_={() => {}}
        is_loading_={false}
        on_change_={() => {}}
        on_focus_={() => {}}
        on_submit_={() => {}}
        on_blur_={() => {}}
        on_clear_click_={() => {}}
        is_focused_={false}
        is_slash_shortcut_disabled_={false}
        on_click_get_help_={() => {}}
        translations_={{
          footer_tip_: 'Lorem ipsum',
          get_help_link_: 'Lorem',
        }}
      />
      <StorybookSpacer />
      <LibrarySearch
        placeholder_={'Search in all bookmarks'}
        search_string_={''}
        hints_={undefined}
        on_click_hint_={() => {}}
        on_click_recent_hint_remove_={() => {}}
        is_loading_={true}
        on_change_={() => {}}
        on_focus_={() => {}}
        on_submit_={() => {}}
        on_blur_={() => {}}
        on_clear_click_={() => {}}
        is_focused_={false}
        is_slash_shortcut_disabled_={false}
        on_click_get_help_={() => {}}
        translations_={{
          footer_tip_: 'Lorem ipsum',
          get_help_link_: 'Lorem',
        }}
      />
      <StorybookSpacer />
      <LibrarySearch
        placeholder_={'Search in all bookmarks'}
        search_string_={'mid'}
        hints_={[
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
        on_click_hint_={() => {}}
        on_click_recent_hint_remove_={() => {}}
        is_loading_={false}
        on_change_={() => {}}
        on_focus_={() => {}}
        on_submit_={() => {}}
        on_blur_={() => {}}
        on_clear_click_={() => {}}
        is_focused_={true}
        is_slash_shortcut_disabled_={false}
        on_click_get_help_={() => {}}
        translations_={{
          footer_tip_: 'Lorem ipsum',
          get_help_link_: 'Lorem',
        }}
      />
      <StorybookSpacer />
      <StorybookSpacer />
      <StorybookSpacer />
      <LibrarySearch
        placeholder_={'Search in all bookmarks'}
        search_string_={'mid'}
        hints_={[]}
        on_click_hint_={() => {}}
        on_click_recent_hint_remove_={() => {}}
        is_loading_={false}
        on_change_={() => {}}
        on_focus_={() => {}}
        on_submit_={() => {}}
        on_blur_={() => {}}
        on_clear_click_={() => {}}
        is_focused_={true}
        is_slash_shortcut_disabled_={false}
        on_click_get_help_={() => {}}
        translations_={{
          footer_tip_: 'Lorem ipsum',
          get_help_link_: 'Lorem',
        }}
      />
    </div>
  </div>
)
