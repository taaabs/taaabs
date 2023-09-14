import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'
import { useLibraryDispatch, useLibrarySelector } from './store'
import { MonthsParams } from '@repositories/modules/months/domain/types/months.params'
import { useEffect, useState } from 'react'
import { LibraryFilter } from '@shared/types/common/library-filter'
import { months_actions } from '@repositories/stores/user-authorized/library/months/months.slice'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

enum SessionStorageKey {
  QueryParams = 'queryParams',
  MonthsData = 'monthsData',
  TagsOfBookmarkCreation = 'tagsOfBookmarkCreation',
  TagsOfUrlCreation = 'tagsOfUrlCreation',
}

export const useMonths = () => {
  const queryParams = use_shallow_search_params()
  const dispatch = useLibraryDispatch()
  const {
    months_data: monthsData,
    months_of_bookmark_creation: monthsOfBookmarkCreation,
    months_of_url_creation: monthsOfUrlCreation,
    is_getting_months_data: isGettingMonthsData,
    tags_of_bookmark_creation: tagsOfBookmarkCreation,
    tags_of_url_creation: tagsOfUrlCreation,
  } = useLibrarySelector((state) => state.months)
  const { bookmarks } = useLibrarySelector((state) => state.bookmarks)
  const [lastQueryTags, setLastQueryTags] = useState<string | null>(null)
  const [lastQueryFilter, setLastQueryFilter] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [lastQueryYyyymmGte, setLastQueryYyyymmGte] = useState<string | null>(
    null,
  )
  const [lastQueryYyyymmLte, setLastQueryYyyymmLte] = useState<string | null>(
    null,
  )

  const getMonths = () => {
    const getMonthsParams: MonthsParams.Authorized = {}

    const queryTags = queryParams.get('t')
    setLastQueryTags(queryTags)
    if (queryTags) {
      getMonthsParams.tags = queryTags.split(',')
    }

    const queryFilter = queryParams.get('f')
    setLastQueryFilter(queryFilter)
    if (queryFilter) {
      getMonthsParams.filter =
        Object.values(LibraryFilter)[parseInt(queryFilter)]
    }

    dispatch(
      months_actions.getMonths({
        params: getMonthsParams,
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
      }),
    )
  }

  useUpdateEffect(() => {
    const queryTags = queryParams.get('t')
    const queryFilter = queryParams.get('f')
    if (queryTags != lastQueryTags || queryFilter != lastQueryFilter) {
      getMonths()
    }

    const queryYyyymmGte = queryParams.get('gte')
    const queryYyyymmLte = queryParams.get('lte')

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
  }, [queryParams])

  useEffect(() => {
    const queryTags = queryParams.get('t')
    if (!queryTags && selectedTags.length > 0) {
      setSelectedTags([])
    } else if (queryTags && queryTags != selectedTags.join(',')) {
      const selectedTags = queryTags.split(',')
      setSelectedTags(selectedTags)
    }
  }, [bookmarks])

  useUpdateEffect(() => {
    if (monthsData) {
      sessionStorage.setItem(
        SessionStorageKey.MonthsData,
        JSON.stringify(monthsData),
      )
    }

    if (tagsOfBookmarkCreation) {
      sessionStorage.setItem(
        SessionStorageKey.TagsOfBookmarkCreation,
        JSON.stringify(tagsOfBookmarkCreation),
      )
      sessionStorage.setItem(
        SessionStorageKey.TagsOfUrlCreation,
        JSON.stringify(tagsOfUrlCreation),
      )
    }
  }, [monthsData, tagsOfBookmarkCreation, tagsOfUrlCreation])

  useEffect(() => {
    const previousQueryParams = sessionStorage.getItem(
      SessionStorageKey.QueryParams,
    )

    if (queryParams.toString() == previousQueryParams) {
      const monthsData = sessionStorage.getItem(SessionStorageKey.MonthsData)
      if (monthsData) {
        dispatch(months_actions.set_data(JSON.parse(monthsData)))

        const tagsOfBookmarkCreation = sessionStorage.getItem(
          SessionStorageKey.TagsOfBookmarkCreation,
        )
        const tagsOfUrlCreation = sessionStorage.getItem(
          SessionStorageKey.TagsOfUrlCreation,
        )

        if (tagsOfBookmarkCreation && tagsOfUrlCreation) {
          dispatch(
            months_actions.set_tags_of_bookmark_creation(
              JSON.parse(tagsOfBookmarkCreation),
            ),
          )
          dispatch(
            months_actions.set_tags_of_url_creation(JSON.parse(tagsOfUrlCreation)),
          )
        }
      } else {
        getMonths()
      }
    } else {
      getMonths()
    }

    return () => {
      sessionStorage.removeItem(SessionStorageKey.MonthsData)
      sessionStorage.removeItem(SessionStorageKey.TagsOfBookmarkCreation)
      sessionStorage.removeItem(SessionStorageKey.TagsOfUrlCreation)
    }
  }, [])

  return {
    monthsOfBookmarkCreation,
    monthsOfUrlCreation,
    isGettingMonthsData,
    tagsOfBookmarkCreation,
    tagsOfUrlCreation,
    selectedTags,
  }
}
