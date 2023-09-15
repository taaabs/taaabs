import { updateSearchParam } from '@/utils/update-query-param'
import { Sortby } from '@shared/types/modules/bookmarks/sortby'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'

export const use_sortby_view_options = () => {
  const query_params = use_shallow_search_params()
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
    updated_query_params = updateSearchParam(
      query_params,
      's',
      sortby == BookmarksFetchingDefaults.Common.sortby
        ? undefined
        : Object.values(Sortby).indexOf(sortby).toString(),
    )

    if (query_params.get('gte')) {
      updated_query_params = updateSearchParam(updated_query_params, 'gte')
    }

    if (query_params.get('lte')) {
      updated_query_params = updateSearchParam(updated_query_params, 'lte')
    }

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  return { current_sortby, set_sortby_query_param }
}
