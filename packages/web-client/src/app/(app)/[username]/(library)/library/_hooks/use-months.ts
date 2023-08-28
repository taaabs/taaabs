import { useParams } from 'next/navigation'
import { useLibraryDispatch, useLibrarySelector } from './store'
import { useEffect, useState } from 'react'
import { MonthsParams } from '@repositories/modules/months/domain/types/months.params'
import { LibraryFilter } from '@shared/types/common/library-filter'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useShallowSearchParams } from '@/hooks/use-push-state-listener'
import { monthsActions } from '@repositories/stores/user-public/library/months/months.slice'

enum SessionStorageKey {
  QueryParams = 'queryParams',
  MonthsData = 'monthsData',
  TagsOfBookmarkCreation = 'tagsOfBookmarkCreation',
  TagsOfUrlCreation = 'tagsOfUrlCreation',
}

export const useMonths = () => {
  const queryParams = useShallowSearchParams()
  const params = useParams()
  const dispatch = useLibraryDispatch()
  const {
    monthsData,
    monthsOfBookmarkCreation,
    monthsOfUrlCreation,
    isGettingMonthsData,
    tagsOfBookmarkCreation,
    tagsOfUrlCreation,
  } = useLibrarySelector((state) => state.months)
  const { bookmarks } = useLibrarySelector((state) => state.bookmarks)
  const [lastQueryTags, setLastQueryTags] = useState<string | null>(null)
  const [lastQueryFilter, setLastQueryFilter] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [lastQueryYyyymmGte, setLastQueryYyyymmGte] = useState<string | null>(
    null,
  )
  const [lastQueryYyyymmLte, setLastQueryYyyymmLte] = useState<string | null>(
    null,
  )

  const getMonths = () => {
    const getMonthsParams: MonthsParams.Public = {
      username: params.username as string,
    }

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
      monthsActions.getMonths({
        params: getMonthsParams,
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
      }),
    )
  }

  useEffect(() => {
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
        monthsActions.setYyyymmGte(parseInt(queryYyyymmGte || '0') || null),
      )
      dispatch(
        monthsActions.setYyyymmLte(parseInt(queryYyyymmLte || '0') || null),
      )
    }
  }, [queryParams])

  useEffect(() => {
    const queryTags = queryParams.get('t')
    if (!queryTags && selectedTags.length > 0) {
      setSelectedTags([])
    } else if (queryTags && queryTags != selectedTags.join(',')) {
      const selectedTags = queryTags.split(',').map((t) => parseInt(t))
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
        dispatch(monthsActions.setData(JSON.parse(monthsData)))

        const tagsOfBookmarkCreation = sessionStorage.getItem(
          SessionStorageKey.TagsOfBookmarkCreation,
        )
        const tagsOfUrlCreation = sessionStorage.getItem(
          SessionStorageKey.TagsOfUrlCreation,
        )

        if (tagsOfBookmarkCreation && tagsOfUrlCreation) {
          dispatch(
            monthsActions.setTagsOfBookmarkCreation(
              JSON.parse(tagsOfBookmarkCreation),
            ),
          )
          dispatch(
            monthsActions.setTagsOfUrlCreation(JSON.parse(tagsOfUrlCreation)),
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
