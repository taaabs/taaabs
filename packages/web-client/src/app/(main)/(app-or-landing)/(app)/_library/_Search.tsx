import { SortBy } from '@shared/types/modules/bookmarks/sort-by'
import { useContext } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search as Ui_app_library_Search } from '@web-ui/components/app/library/Search'
import { clear_library_session_storage } from '@/utils/clear_library_session_storage'
import { ModalContext } from '@/providers/ModalProvider'
import { LocalDb } from '@/providers/LocalDbProvider'
import { Dictionary } from '@/dictionaries/dictionary'
import { LibraryContext } from './Library'

namespace _Search {
  export type Props = {
    local_db: LocalDb
    dictionary: Dictionary
  }
}

export const _Search: React.FC<_Search.Props> = (props) => {
  const modal_context = useContext(ModalContext)
  const {
    bookmarks_hook,
    counts_hook,
    search_hook,
    tag_view_options_hook,
    sort_by_view_options_hook,

    username,
    is_archived_filter,
    search_cache_to_be_cleared,
  } = useContext(LibraryContext)
  const search_params = useSearchParams()

  return (
    <Ui_app_library_Search
      search_string={search_hook.search_string}
      is_full_text={search_hook.is_full_text}
      toggle_full_text={() =>
        search_hook.set_is_full_text(!search_hook.is_full_text)
      }
      is_loading={props.local_db.is_initializing || false}
      loading_progress_percentage={props.local_db.indexed_bookmarks_percentage}
      hints={
        !props.local_db.is_initializing
          ? search_hook.hints?.map((hint) => ({
              type: hint.type,
              completion: hint.completion,
              search_string: hint.search_string,
            }))
          : undefined
      }
      hints_set_at_timestamp={search_hook.hints_set_at_timestamp}
      queried_at_timestamp={search_hook.queried_at_timestamp}
      on_click_hint={(i) => {
        const search_string =
          search_hook.search_string + search_hook.hints![i].completion
        search_hook.set_search_string(search_string)
        search_hook.get_result({ search_string: search_string })
      }}
      on_click_recent_hint_remove={(i) => {
        const search_string =
          search_hook.hints![i].search_string + search_hook.hints![i].completion
        search_hook.remove_recent_hint({ search_string: search_string })
      }}
      is_focused={search_hook.is_search_focused}
      on_focus={async () => {
        if (props.local_db.is_initializing) return

        search_hook.set_is_search_focused(true)
        search_hook.set_selected_tag_ids(tag_view_options_hook.selected_tags)
        search_hook.set_selected_tags(
          counts_hook.selected_tags
            .filter((id) => {
              if (!bookmarks_hook.bookmarks || !bookmarks_hook.bookmarks[0])
                return false
              return (
                bookmarks_hook.bookmarks[0].tags?.findIndex(
                  (tag) => tag.id == id,
                ) != -1
              )
            })
            .map((id) => {
              const name = bookmarks_hook.bookmarks![0].tags!.find(
                (tag) => tag.id == id,
              )!.name

              return name
            }),
        )

        if (search_cache_to_be_cleared.current) {
          await props.local_db.init({
            is_archived: is_archived_filter,
            force_reinitialization: true,
            include_visited_at:
              sort_by_view_options_hook.current_sort_by == SortBy.VISITED_AT ||
              undefined,
            include_points:
              sort_by_view_options_hook.current_sort_by == SortBy.POPULARITY ||
              undefined,
          })
          search_cache_to_be_cleared.current = false
        } else if (
          !username ||
          (username &&
            ((!is_archived_filter && !props.local_db.db) ||
              (is_archived_filter && !props.local_db.archived_db)))
        ) {
          await props.local_db.init({
            is_archived: is_archived_filter,
          })
        }
        search_hook.get_hints()
      }}
      on_change={(value) => {
        if (props.local_db.is_initializing) return
        search_hook.set_search_string(value)
      }}
      on_submit={async () => {
        if (
          props.local_db.is_initializing ||
          !search_hook.search_string.trim() ||
          search_hook.count == 0
        )
          return
        if (search_hook.is_full_text) {
          await search_hook.get_result_full_text({
            search_string: search_hook.search_string,
          })
        } else {
          await search_hook.get_result({
            search_string: search_hook.search_string,
          })
        }
      }}
      on_blur={() => {
        search_hook.clear_hints()
        search_hook.set_is_search_focused(false)
      }}
      results_count={search_hook.search_string ? search_hook.count : undefined}
      on_clear_click={() => {
        search_hook.reset()
        clear_library_session_storage({
          username,
          search_params: search_params.toString(),
        })
        window.history.pushState(
          {},
          '',
          window.location.pathname + `?${search_params.toString()}`,
        )
      }}
      is_slash_shortcut_disabled={modal_context.is_open}
      on_click_get_help={() => {}}
      sort_by={sort_by_view_options_hook.current_sort_by}
      translations={{
        placeholder: {
          default: props.dictionary.app.library.search.placeholder.default,
          full_text: props.dictionary.app.library.search.placeholder.full_text,
        },
        footer_tip: props.dictionary.app.library.search.footer_tip,
        get_help_link: props.dictionary.app.library.search.get_help,
        type: props.dictionary.app.library.search.type,
        to_search: props.dictionary.app.library.search.to_search,
        one_moment_please:
          props.dictionary.app.library.search.one_moment_please,
      }}
    />
  )
}
