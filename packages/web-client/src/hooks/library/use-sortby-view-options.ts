import { update_query_params } from '@/utils/update-query-params'
import { Sortby } from '@shared/types/modules/bookmarks/sortby'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useSearchParams } from 'next/navigation'

export const use_sortby_view_options = () => {
  const query_params = useSearchParams()
  const [current_sortby, set_current_sortby] = useState<Sortby>(
    Object.values(Sortby)[
      parseInt(
        query_params.get('s') ||
          Object.values(Sortby)
            .indexOf(BookmarksFetchingDefaults.Common.sortby)
            .toString(),
      )
    ],
  )

  useUpdateEffect(() => {
    const query_sortby = query_params.get('s')

    if (
      query_sortby != Object.values(Sortby).indexOf(current_sortby).toString()
    ) {
      set_current_sortby(
        Object.values(Sortby)[
          parseInt(
            query_sortby ||
              Object.values(Sortby)
                .indexOf(BookmarksFetchingDefaults.Common.sortby)
                .toString(),
          )
        ],
      )
    }
  }, [query_params])

  const set_sortby_query_param = (sortby: Sortby) => {
    let updated_query_params: any
    updated_query_params = update_query_params(
      query_params,
      's',
      sortby == BookmarksFetchingDefaults.Common.sortby
        ? undefined
        : Object.values(Sortby).indexOf(sortby).toString(),
    )

    updated_query_params = update_query_params(updated_query_params, 'lte')
    updated_query_params = update_query_params(updated_query_params, 'gte')

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

  return { current_sortby, set_sortby_query_param }
}
