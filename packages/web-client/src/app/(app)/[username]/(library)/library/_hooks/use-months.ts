import { useParams } from 'next/navigation'
import { useLibraryDispatch, useLibrarySelector } from './store'
import { useEffect, useState } from 'react'
import { MonthsParams } from '@repositories/modules/months/domain/types/months.params'
import { LibraryFilter } from '@shared/types/common/library-filter'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useShallowSearchParams } from '@/hooks/use-push-state-listener'
import { monthsActions } from '@repositories/stores/user-public/library/months/months.slice'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

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
  const [selectedTags, setSelectedTags] = useState<string[]>([])
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
      setLastQueryFilter(queryFilter)
      getMonthsParams.filter =
        Object.values(LibraryFilter)[parseInt(queryFilter)]
    }

    dispatch(monthsActions.getMonths({ apiUrl, params: getMonthsParams }))
  }

  useUpdateEffect(() => {
    const queryTags = queryParams.get('t')
    const queryFilter = queryParams.get('f')
    if (queryTags != lastQueryTags || queryFilter != lastQueryFilter) {
      getMonths()
    }

    const queryYyyyGte = queryParams.get('gte')
    const queryYyyyLte = queryParams.get('lte')

    if (
      queryYyyyGte != lastQueryYyyymmGte ||
      queryYyyyLte != lastQueryYyyymmLte
    ) {
      setLastQueryYyyymmGte(queryYyyyGte)
      setLastQueryYyyymmLte(queryYyyyLte)
      dispatch(
        monthsActions.setYyyymmGte(parseInt(queryYyyyGte || '0') || null),
      )
      dispatch(
        monthsActions.setYyyymmLte(parseInt(queryYyyyLte || '0') || null),
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
      sessionStorage.setItem('monthsData', JSON.stringify(monthsData))
    }

    if (tagsOfBookmarkCreation) {
      sessionStorage.setItem(
        'tagsOfBookmarkCreation',
        JSON.stringify(tagsOfBookmarkCreation),
      )
      sessionStorage.setItem(
        'tagsOfUrlCreation',
        JSON.stringify(tagsOfUrlCreation),
      )
    }
  }, [monthsData, tagsOfBookmarkCreation, tagsOfUrlCreation])

  useEffect(() => {
    const previousQueryParams = sessionStorage.getItem('queryParams')

    if (queryParams.toString() == previousQueryParams) {
      const monthsData = sessionStorage.getItem('monthsData')
      if (monthsData) {
        dispatch(monthsActions.setData(JSON.parse(monthsData)))

        const tagsOfBookmarkCreation = sessionStorage.getItem(
          'tagsOfBookmarkCreation',
        )
        const tagsOfUrlCreation = sessionStorage.getItem('tagsOfUrlCreation')

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
      sessionStorage.removeItem('monthsData')
      sessionStorage.removeItem('tagsOfBookmarkCreation')
      sessionStorage.removeItem('tagsOfUrlCreation')
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
