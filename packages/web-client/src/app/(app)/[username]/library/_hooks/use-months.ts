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
  const [lastQueryTags, setLastQueryTags] = useState<string | null>(null)
  const [lastQueryFilter, setLastQueryFilter] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [lastQueryYyyymmGte, setLastQueryYyyymmGte] = useState<string | null>(
    null,
  )
  const [lastQueryYyyymmLte, setLastQueryYyyymmLte] = useState<string | null>(
    null,
  )

  const get_months = () => {
    const get_monthsParams: MonthsParams.Public = {
      username: params.username as string,
    }

    const queryTags = query_params.get('t')
    setLastQueryTags(queryTags)
    if (queryTags) {
      get_monthsParams.tags = queryTags.split(',')
    }

    const queryFilter = query_params.get('f')
    setLastQueryFilter(queryFilter)
    if (queryFilter) {
      get_monthsParams.filter =
        Object.values(LibraryFilter)[parseInt(queryFilter)]
    }

    dispatch(
      months_actions.get_months({
        query_params: get_monthsParams,
        api_url: process.env.NEXT_PUBLIC_API_URL,
      }),
    )
  }

  useEffect(() => {
    const queryTags = query_params.get('t')
    const queryFilter = query_params.get('f')
    if (queryTags != lastQueryTags || queryFilter != lastQueryFilter) {
      get_months()
    }

    const queryYyyymmGte = query_params.get('gte')
    const queryYyyymmLte = query_params.get('lte')

    if (
      queryYyyymmGte != lastQueryYyyymmGte ||
      queryYyyymmLte != lastQueryYyyymmLte
    ) {
      setLastQueryYyyymmGte(queryYyyymmGte)
      setLastQueryYyyymmLte(queryYyyymmLte)
      dispatch(
        months_actions.set_yyyymm_gte(parseInt(queryYyyymmGte || '0') || null),
      )
      dispatch(
        months_actions.set_yyyymm_lte(parseInt(queryYyyymmLte || '0') || null),
      )
    }
  }, [query_params])

  useEffect(() => {
    const queryTags = query_params.get('t')
    if (!queryTags && selectedTags.length > 0) {
      setSelectedTags([])
    } else if (queryTags && queryTags != selectedTags.join(',')) {
      const selectedTags = queryTags.split(',').map((t) => parseInt(t))
      setSelectedTags(selectedTags)
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
    selectedTags,
  }
}
