import { useParams } from 'next/navigation'
import { use_library_dispatch, use_library_selector } from './store'
import { useEffect, useState } from 'react'
import { MonthsParams } from '@repositories/modules/months/domain/types/months.params'
import { LibraryFilter } from '@shared/types/common/library-filter'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'
import { months_actions } from '@repositories/stores/user-public/library/months/months.slice'

export const use_months = () => {
  const query_params = use_shallow_search_params()
  const params = useParams()
  const dispatch = use_library_dispatch()
  const {
    months_data,
    months_of_bookmark_creation,
    is_getting_months_data,
    tags_of_bookmark_creation,
  } = use_library_selector((state) => state.months)
  const { bookmarks } = use_library_selector((state) => state.bookmarks)
  const [last_query_tags, set_last_query_tags] = useState<string | null>(null)
  const [last_query_filter, set_last_query_filter] = useState<string | null>(
    null,
  )
  const [selected_tags, set_selected_tags] = useState<number[]>([])
  const [last_query_yyyymm_gte, set_last_query_yyyymm_gte] = useState<
    string | null
  >(null)
  const [last_query_yyyymm_lte, set_last_query_yyyymm_lte] = useState<
    string | null
  >(null)

  const get_months = () => {
    const get_monthsParams: MonthsParams.Public = {
      username: params.username as string,
    }

    const query_tags = query_params.get('t')
    set_last_query_tags(query_tags)
    if (query_tags) {
      get_monthsParams.tags = query_tags.split(',')
    }

    const query_filter = query_params.get('f')
    set_last_query_filter(query_filter)
    if (query_filter) {
      get_monthsParams.filter =
        Object.values(LibraryFilter)[parseInt(query_filter)]
    }

    dispatch(
      months_actions.get_months({
        query_params: get_monthsParams,
        api_url: process.env.NEXT_PUBLIC_API_URL,
      }),
    )
  }

  useEffect(() => {
    const query_tags = query_params.get('t')
    const query_filter = query_params.get('f')
    if (query_tags != last_query_tags || query_filter != last_query_filter) {
      get_months()
    }

    const query_yyyymm_gte = query_params.get('gte')
    const query_yyyymm_lte = query_params.get('lte')

    if (
      query_yyyymm_gte != last_query_yyyymm_gte ||
      query_yyyymm_lte != last_query_yyyymm_lte
    ) {
      set_last_query_yyyymm_gte(query_yyyymm_gte)
      set_last_query_yyyymm_lte(query_yyyymm_lte)
      dispatch(
        months_actions.set_yyyymm_gte(
          parseInt(query_yyyymm_gte || '0') || null,
        ),
      )
      dispatch(
        months_actions.set_yyyymm_lte(
          parseInt(query_yyyymm_lte || '0') || null,
        ),
      )
    }
  }, [query_params])

  useEffect(() => {
    const query_tags = query_params.get('t')
    if (!query_tags && selected_tags.length > 0) {
      set_selected_tags([])
    } else if (query_tags && query_tags != selected_tags.join(',')) {
      const selected_tags = query_tags.split(',').map((t) => parseInt(t))
      set_selected_tags(selected_tags)
    }
  }, [bookmarks])

  useUpdateEffect(() => {
    if (months_data) {
      sessionStorage.setItem(
        `months_data_${query_params.toString()}`,
        JSON.stringify(months_data),
      )
    }

    if (tags_of_bookmark_creation) {
      sessionStorage.setItem(
        `tags_of_bookmark_creation_${query_params.toString()}`,
        JSON.stringify(tags_of_bookmark_creation),
      )
    }
  }, [months_data, tags_of_bookmark_creation])

  useEffect(() => {
    const months_data = sessionStorage.getItem(
      `months_data_${query_params.toString()}`,
    )
    if (months_data) {
      dispatch(months_actions.set_data(JSON.parse(months_data)))

      const tags_of_bookmark_creation = sessionStorage.getItem(
        `tags_of_bookmark_creation_${query_params.toString()}`,
      )
      const tags_of_url_creation = sessionStorage.getItem(
        `tags_of_url_creation_${query_params.toString()}`,
      )

      if (tags_of_bookmark_creation) {
        dispatch(
          months_actions.set_tags_of_bookmark_creation(
            JSON.parse(tags_of_bookmark_creation),
          ),
        )
      }

      if (tags_of_url_creation) {
        dispatch(
          months_actions.set_tags_of_url_creation(
            JSON.parse(tags_of_url_creation),
          ),
        )
      }
    } else {
      get_months()
    }

    return () => {
      for (const key in sessionStorage) {
        if (key.substring(0, 10) == 'months_data') {
          sessionStorage.removeItem(key)
        } else if (key.substring(0, 22) == 'tags_of_bookmark_creation') {
          sessionStorage.removeItem(key)
        } else if (key.substring(0, 17) == 'tags_of_url_creation') {
          sessionStorage.removeItem(key)
        }
      }
    }
  }, [])

  return {
    months_of_bookmark_creation,
    is_getting_months_data,
    tags_of_bookmark_creation,
    selected_tags,
  }
}