import { update_query_params } from '@/utils/update-query-params'
import { LibraryFilter } from '@shared/types/common/library-filter'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

export const use_filter_view_options = () => {
  const query_params = useSearchParams()
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

    for (const key in sessionStorage) {
      if (key.endsWith(`__${updated_query_params}`)) {
        sessionStorage.removeItem(key)
      }
    }

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  const set_filter_query_param_and_clear_others = (filter: LibraryFilter) => {
    const updated_query_params = update_query_params(
      new URLSearchParams(),
      'f',
      filter == BookmarksFetchingDefaults.Common.filter
        ? undefined
        : Object.values(LibraryFilter).indexOf(filter).toString(),
    )

    for (const key in sessionStorage) {
      if (key.endsWith(`__${updated_query_params}`)) {
        sessionStorage.removeItem(key)
      }
    }

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  const clear_selected_stars = () => {
    let updated_query_params: URLSearchParams
    if (
      current_filter == LibraryFilter.OneStarUnread ||
      current_filter == LibraryFilter.TwoStarsUnread ||
      current_filter == LibraryFilter.ThreeStarsUnread
    ) {
      updated_query_params = update_query_params(
        query_params,
        'f',
        Object.values(LibraryFilter).indexOf(LibraryFilter.Unread).toString(),
      )
    } else {
      updated_query_params = update_query_params(query_params, 'f')
    }

    for (const key in sessionStorage) {
      if (key.endsWith(`__${updated_query_params}`)) {
        sessionStorage.removeItem(key)
      }
    }

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  const clear_unread = () => {
    let updated_query_params: URLSearchParams
    if (current_filter == LibraryFilter.OneStarUnread) {
      updated_query_params = update_query_params(
        query_params,
        'f',
        Object.values(LibraryFilter).indexOf(LibraryFilter.OneStar).toString(),
      )
    } else if (current_filter == LibraryFilter.TwoStarsUnread) {
      updated_query_params = update_query_params(
        query_params,
        'f',
        Object.values(LibraryFilter).indexOf(LibraryFilter.TwoStars).toString(),
      )
    } else if (current_filter == LibraryFilter.ThreeStarsUnread) {
      updated_query_params = update_query_params(
        query_params,
        'f',
        Object.values(LibraryFilter)
          .indexOf(LibraryFilter.ThreeStars)
          .toString(),
      )
    } else {
      updated_query_params = update_query_params(query_params, 'f')
    }

    for (const key in sessionStorage) {
      if (key.endsWith(`__${updated_query_params}`)) {
        sessionStorage.removeItem(key)
      }
    }

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  return {
    current_filter,
    set_filter_query_param,
    set_filter_query_param_and_clear_others,
    clear_selected_stars,
    clear_unread,
  }
}
