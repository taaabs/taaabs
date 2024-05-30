import { useParams, useSearchParams } from 'next/navigation'
import {
  use_library_dispatch,
  use_library_selector,
} from '../../stores/library'
import { useContext, useEffect, useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { counts_actions } from '@repositories/stores/library/counts/counts.slice'
import { Counts_Params } from '@repositories/modules/counts/domain/types/counts.params'
import { browser_storage } from '@/constants/browser-storage'
import { Filter } from '@/types/library/filter'
import { search_params_keys } from '@/constants/search-params-keys'
import { AuthContext } from '@/app/auth-provider'
import { use_is_hydrated } from '@shared/hooks'

export const use_counts = () => {
  const auth_context = useContext(AuthContext)!
  const is_hydrated = use_is_hydrated()
  const search_params = useSearchParams()
  const { username }: { username?: string } = useParams()
  const dispatch = use_library_dispatch()
  const { counts_data, months, tags, is_fetching, should_refetch } =
    use_library_selector((state) => state.counts)
  const { bookmarks } = use_library_selector((state) => state.bookmarks)
  const [last_query_tags, set_last_query_tags] = useState<string>()
  const [last_query_filter, set_last_query_filter] = useState<string>()
  const [last_query_refresh_trigger, set_last_query_refresh_trigger] =
    useState<string>()
  const [selected_tags_, set_selected_tags] = useState<number[]>([])
  const [last_query_yyyymm_gte, set_last_query_yyyymm_gte] = useState<string>()
  const [last_query_yyyymm_lte, set_last_query_yyyymm_lte] = useState<string>()

  const get_counts_ = () => {
    if (!username) {
      const request_params: Counts_Params.Authorized = {}

      const query_newly_created_bookmark_id = search_params.get(
        search_params_keys.new_bookmark_results_refetch_trigger,
      )
      set_last_query_refresh_trigger(
        query_newly_created_bookmark_id || undefined,
      )

      const query_tags = search_params.get(search_params_keys.tags)
      set_last_query_tags(query_tags || undefined)
      if (query_tags) {
        request_params.tags = query_tags.split(',')
      }

      const query_filter = search_params.get(search_params_keys.filter)
      set_last_query_filter(query_filter || undefined)
      if (query_filter) {
        request_params.starred_only =
          Object.values(Filter)[parseInt(query_filter)] == Filter.STARRED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.STARRED_UNSORTED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED_UNSORTED ||
          undefined

        request_params.unsorted_only =
          Object.values(Filter)[parseInt(query_filter)] == Filter.UNSORTED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.STARRED_UNSORTED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_UNSORTED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED_UNSORTED ||
          undefined

        request_params.is_archived =
          Object.values(Filter)[parseInt(query_filter)] == Filter.ARCHIVED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_UNSORTED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED_UNSORTED ||
          undefined
      }

      sessionStorage.setItem(
        browser_storage.session_storage.library.last_authorized_counts_params,
        JSON.stringify(request_params),
      )
      dispatch(
        counts_actions.get_authorized_counts({
          request_params,
          ky: auth_context.ky_instance,
          encryption_key: auth_context.auth_data!.encryption_key,
        }),
      )
    } else {
      const request_params: Counts_Params.Public = {
        username,
      }

      const query_tags = search_params.get(search_params_keys.tags)
      set_last_query_tags(query_tags || undefined)
      if (query_tags) {
        request_params.tags = query_tags.split(',')
      }

      const query_filter = search_params.get(search_params_keys.filter)
      set_last_query_filter(query_filter || undefined)
      if (query_filter) {
        request_params.starred_only =
          Object.values(Filter)[parseInt(query_filter)] == Filter.STARRED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.STARRED_UNSORTED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED_UNSORTED ||
          undefined

        request_params.is_archived =
          Object.values(Filter)[parseInt(query_filter)] == Filter.ARCHIVED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_UNSORTED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED_UNSORTED ||
          undefined
      }

      dispatch(
        counts_actions.get_public_counts({
          request_params,
          ky: auth_context.ky_instance,
        }),
      )
    }
  }

  useUpdateEffect(() => {
    const tags = sessionStorage.getItem(
      browser_storage.session_storage.library.tags({
        username,
        search_params: search_params.toString(),
      }),
    )

    if (tags) {
      dispatch(counts_actions.set_tags(JSON.parse(tags)))
    }

    const query_tags = search_params.get(search_params_keys.tags)
    const query_filter = search_params.get(search_params_keys.filter)
    const query_refresh_trigger = search_params.get('r') // Set after bookmark creation.
    if (
      query_tags != last_query_tags ||
      query_filter != last_query_filter ||
      query_refresh_trigger != last_query_refresh_trigger
    ) {
      get_counts_()
    }

    const query_yyyymm_gte = search_params.get(
      search_params_keys.greater_than_equal,
    )
    const query_yyyymm_lte = search_params.get(
      search_params_keys.less_than_equal,
    )

    if (
      query_yyyymm_gte != last_query_yyyymm_gte ||
      query_yyyymm_lte != last_query_yyyymm_lte
    ) {
      set_last_query_yyyymm_gte(query_yyyymm_gte || undefined)
      set_last_query_yyyymm_lte(query_yyyymm_lte || undefined)
      dispatch(
        counts_actions.set_yyyymm_gte(
          parseInt(query_yyyymm_gte || '0') || undefined,
        ),
      )
      dispatch(
        counts_actions.set_yyyymm_lte(
          parseInt(query_yyyymm_lte || '0') || undefined,
        ),
      )
    }
  }, [search_params])

  useEffect(() => {
    const query_tags = search_params.get(search_params_keys.tags)
    if (!query_tags && selected_tags_.length > 0) {
      set_selected_tags([])
    } else if (query_tags && query_tags != selected_tags_.join(',')) {
      const selected_tags = query_tags.split(',').map((t) => parseInt(t))
      set_selected_tags(selected_tags)
    }
  }, [bookmarks])

  useUpdateEffect(() => {
    if (tags) {
      sessionStorage.setItem(
        browser_storage.session_storage.library.tags({
          username,
          search_params: search_params.toString(),
        }),
        JSON.stringify(tags),
      )
    }
  }, [counts_data, tags])

  useUpdateEffect(() => {
    const tags = sessionStorage.getItem(
      browser_storage.session_storage.library.tags({
        username,
        search_params: search_params.toString(),
      }),
    )

    if (tags) {
      dispatch(counts_actions.set_tags(JSON.parse(tags)))
    }

    get_counts_()
  }, [is_hydrated])

  return {
    get_counts_,
    months,
    is_fetching,
    tags,
    selected_tags_,
    should_refetch,
  }
}
