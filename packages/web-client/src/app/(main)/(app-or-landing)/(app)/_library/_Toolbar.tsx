import { useContext } from 'react'
import { Toolbar as Ui_app_library_Toolbar } from '@web-ui/components/app/library/Toolbar'
import { Filter } from '@/types/library/filter'
import { LocalDb } from '@/providers/LocalDbProvider'
import { Dictionary } from '@/dictionaries/dictionary'
import { LibraryContext } from './Library'

namespace _Toolbar {
  export type Props = {
    local_db: LocalDb
    dictionary: Dictionary
  }
}

export const _Toolbar: React.FC<_Toolbar.Props> = (props) => {
  const {
    bookmarks_hook,
    counts_hook,
    filter_view_options_hook,

    username,
    is_fetching_first_bookmarks,
  } = useContext(LibraryContext)

  return (
    <Ui_app_library_Toolbar
      toggleable_buttons={[
        {
          label: props.dictionary.app.library.toolbar.starred,
          is_toggled:
            filter_view_options_hook.current_filter == Filter.STARRED ||
            filter_view_options_hook.current_filter ==
              Filter.STARRED_UNSORTED ||
            filter_view_options_hook.current_filter ==
              Filter.ARCHIVED_STARRED ||
            filter_view_options_hook.current_filter ==
              Filter.ARCHIVED_STARRED_UNSORTED,
          on_click: () => {
            if (
              is_fetching_first_bookmarks ||
              bookmarks_hook.is_fetching_more_bookmarks ||
              counts_hook.is_fetching
            )
              return

            let filter = Filter.NONE
            if (filter_view_options_hook.current_filter == Filter.NONE) {
              filter = Filter.STARRED
            } else if (
              filter_view_options_hook.current_filter == Filter.STARRED
            ) {
              filter = Filter.NONE
            } else if (
              filter_view_options_hook.current_filter == Filter.STARRED_UNSORTED
            ) {
              filter = Filter.UNSORTED
            } else if (
              filter_view_options_hook.current_filter == Filter.ARCHIVED_STARRED
            ) {
              filter = Filter.ARCHIVED
            } else if (
              filter_view_options_hook.current_filter ==
              Filter.ARCHIVED_STARRED_UNSORTED
            ) {
              filter = Filter.ARCHIVED_UNSORTED
            } else if (
              filter_view_options_hook.current_filter == Filter.UNSORTED
            ) {
              filter = Filter.STARRED_UNSORTED
            } else if (
              filter_view_options_hook.current_filter == Filter.ARCHIVED
            ) {
              filter = Filter.ARCHIVED_STARRED
            } else if (
              filter_view_options_hook.current_filter ==
              Filter.ARCHIVED_UNSORTED
            ) {
              filter = Filter.ARCHIVED_STARRED_UNSORTED
            }
            filter_view_options_hook.set_filter_query_param(filter)
          },
        },
        ...(!username
          ? [
              {
                label: props.dictionary.app.library.toolbar.unsorted,
                is_toggled:
                  filter_view_options_hook.current_filter == Filter.UNSORTED ||
                  filter_view_options_hook.current_filter ==
                    Filter.STARRED_UNSORTED ||
                  filter_view_options_hook.current_filter ==
                    Filter.ARCHIVED_UNSORTED ||
                  filter_view_options_hook.current_filter ==
                    Filter.ARCHIVED_STARRED_UNSORTED,
                on_click: () => {
                  if (
                    is_fetching_first_bookmarks ||
                    bookmarks_hook.is_fetching_more_bookmarks ||
                    counts_hook.is_fetching
                  )
                    return

                  let filter = Filter.NONE
                  if (filter_view_options_hook.current_filter == Filter.NONE) {
                    filter = Filter.UNSORTED
                  } else if (
                    filter_view_options_hook.current_filter == Filter.UNSORTED
                  ) {
                    filter = Filter.NONE
                  } else if (
                    filter_view_options_hook.current_filter ==
                    Filter.STARRED_UNSORTED
                  ) {
                    filter = Filter.STARRED
                  } else if (
                    filter_view_options_hook.current_filter ==
                    Filter.ARCHIVED_UNSORTED
                  ) {
                    filter = Filter.ARCHIVED
                  } else if (
                    filter_view_options_hook.current_filter ==
                    Filter.ARCHIVED_STARRED_UNSORTED
                  ) {
                    filter = Filter.ARCHIVED_STARRED
                  } else if (
                    filter_view_options_hook.current_filter == Filter.STARRED
                  ) {
                    filter = Filter.STARRED_UNSORTED
                  } else if (
                    filter_view_options_hook.current_filter == Filter.ARCHIVED
                  ) {
                    filter = Filter.ARCHIVED_UNSORTED
                  } else if (
                    filter_view_options_hook.current_filter ==
                    Filter.ARCHIVED_STARRED
                  ) {
                    filter = Filter.ARCHIVED_STARRED_UNSORTED
                  }
                  filter_view_options_hook.set_filter_query_param(filter)
                },
              },
            ]
          : []),
        {
          label: props.dictionary.app.library.toolbar.archived,
          is_toggled:
            filter_view_options_hook.current_filter == Filter.ARCHIVED ||
            filter_view_options_hook.current_filter ==
              Filter.ARCHIVED_STARRED ||
            filter_view_options_hook.current_filter ==
              Filter.ARCHIVED_UNSORTED ||
            filter_view_options_hook.current_filter ==
              Filter.ARCHIVED_STARRED_UNSORTED,
          on_click: () => {
            if (
              is_fetching_first_bookmarks ||
              bookmarks_hook.is_fetching_more_bookmarks ||
              counts_hook.is_fetching
            )
              return

            let filter = Filter.NONE

            if (filter_view_options_hook.current_filter == Filter.NONE) {
              filter = Filter.ARCHIVED
            } else if (
              filter_view_options_hook.current_filter == Filter.STARRED
            ) {
              filter = Filter.ARCHIVED_STARRED
            } else if (
              filter_view_options_hook.current_filter == Filter.UNSORTED
            ) {
              filter = Filter.ARCHIVED_UNSORTED
            } else if (
              filter_view_options_hook.current_filter == Filter.STARRED_UNSORTED
            ) {
              filter = Filter.ARCHIVED_STARRED_UNSORTED
            } else if (
              filter_view_options_hook.current_filter == Filter.ARCHIVED
            ) {
              filter = Filter.NONE
            } else if (
              filter_view_options_hook.current_filter == Filter.ARCHIVED_STARRED
            ) {
              filter = Filter.STARRED
            } else if (
              filter_view_options_hook.current_filter ==
              Filter.ARCHIVED_UNSORTED
            ) {
              filter = Filter.UNSORTED
            } else if (
              filter_view_options_hook.current_filter ==
              Filter.ARCHIVED_STARRED_UNSORTED
            ) {
              filter = Filter.STARRED_UNSORTED
            }

            filter_view_options_hook.set_filter_query_param(filter)
          },
        },
      ]}
    />
  )
}
