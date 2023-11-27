import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'
import { update_query_params } from '@/utils/update-query-params'
import { LibraryFilter } from '@shared/types/common/library-filter'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useState } from 'react'

export const use_filter_view_options = () => {
  const query_params = use_shallow_search_params()
  const [current_filter, set_current_filter] = useState<LibraryFilter>(
    Object.values(LibraryFilter)[
      parseInt(
        query_params.get('f') ||
          Object.values(LibraryFilter)
            .indexOf(BookmarksFetchingDefaults.Common.filter)
            .toString(),
      )
    ],
  )

  useUpdateEffect(() => {
    const query_filter = query_params.get('f')

    if (
      query_filter !=
      Object.values(LibraryFilter).indexOf(current_filter).toString()
    ) {
      set_current_filter(
        Object.values(LibraryFilter)[
          parseInt(
            query_filter ||
              Object.values(LibraryFilter)
                .indexOf(BookmarksFetchingDefaults.Common.filter)
                .toString(),
          )
        ],
      )
    }
  }, [query_params])

  const set_filter_query_param = (filter: LibraryFilter) => {
    const updated_query_params = update_query_params(
      query_params,
      'f',
      filter == BookmarksFetchingDefaults.Common.filter
        ? undefined
        : Object.values(LibraryFilter).indexOf(filter).toString(),
    )

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  const clear_selected_stars = (filter: LibraryFilter) => {
    alert('TODO')
  }

  const clear_unread = (filter: LibraryFilter) => {
    alert('TODO')
  }

  return {
    current_filter,
    set_filter_query_param,
    clear_selected_stars,
    clear_unread,
  }
}
