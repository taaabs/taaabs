import { useParams } from 'next/navigation'
import { useLibraryDispatch, useLibrarySelector } from './store'
import { useEffect, useState } from 'react'
import { MonthsParams } from '@repositories/modules/months/domain/types/months.params'
import { LibraryFilter } from '@shared/types/common/library-filter'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useShallowSearchParams } from '@web-ui/hooks/use-shallow-search-params'
import { monthsActions } from '@repositories/stores/user-public/library/months/months.slice'

export const useMonths = () => {
  const queryParams = useShallowSearchParams()
  const params = useParams()
  const dispatch = useLibraryDispatch()
  const {
    monthsData,
    monthsOfBookmarkCreation,
    isGettingMonthsData,
    tagsOfBookmarkCreation,
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
        `monthsData_${queryParams.toString()}`,
        JSON.stringify(monthsData),
      )
    }

    if (tagsOfBookmarkCreation) {
      sessionStorage.setItem(
        `tagsOfBookmarkCreation_${queryParams.toString()}`,
        JSON.stringify(tagsOfBookmarkCreation),
      )
    }
  }, [monthsData, tagsOfBookmarkCreation])

  useEffect(() => {
    const monthsData = sessionStorage.getItem(
      `monthsData_${queryParams.toString()}`,
    )
    if (monthsData) {
      dispatch(monthsActions.setData(JSON.parse(monthsData)))

      const tagsOfBookmarkCreation = sessionStorage.getItem(
        `tagsOfBookmarkCreation_${queryParams.toString()}`,
      )
      const tagsOfUrlCreation = sessionStorage.getItem(
        `tagsOfUrlCreation_${queryParams.toString()}`,
      )

      if (tagsOfBookmarkCreation) {
        dispatch(
          monthsActions.setTagsOfBookmarkCreation(
            JSON.parse(tagsOfBookmarkCreation),
          ),
        )
      }
    } else {
      getMonths()
    }

    return () => {
      for (const key in sessionStorage) {
        if (key.substring(0, 10) == 'monthsData') {
          sessionStorage.removeItem(key)
        } else if (key.substring(0, 22) == 'tagsOfBookmarkCreation') {
          sessionStorage.removeItem(key)
        } else if (key.substring(0, 17) == 'tagsOfUrlCreation') {
          sessionStorage.removeItem(key)
        }
      }
    }
  }, [])

  return {
    monthsOfBookmarkCreation,
    isGettingMonthsData,
    tagsOfBookmarkCreation,
    selectedTags,
  }
}
