import { update_query_params } from '@/utils/update-query-params'
import { Sortby } from '@shared/types/modules/bookmarks/sortby'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useParams, useSearchParams } from 'next/navigation'
import { clear_library_session_storage } from '@/utils/clear_library_session_storage'

export const use_sortby_view_options = () => {
  const query_params = useSearchParams()
  const params = useParams()
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
  // This is set whenever new "first" bookmarks arrive and is neeeded
  // to prevent incorrect date flashing when changing sortby option.
  const [commited_sortby, set_commited_sortby] = useState<Sortby>()

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

    clear_library_session_storage({
      username: params.username as string,
      query_parms: updated_query_params.toString(),
    })

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  return {
    current_sortby,
    set_sortby_query_param,
    commited_sortby,
    set_commited_sortby,
  }
}
