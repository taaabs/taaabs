import { useParams, useSearchParams } from 'next/navigation'
import { useLibraryDispatch, useLibrarySelector } from './store'
import { monthsActions } from '@repositories/stores/other-user/library/months/months.slice'
import { useEffect, useState } from 'react'
import { MonthsParams } from '@repositories/modules/months/domain/types/months.params'
import { LibraryFilter } from '@shared/types/common/library-filter'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export const useMonths = () => {
  const queryParams = useSearchParams()
  const params = useParams()
  const dispatch = useLibraryDispatch()
  const { data, monthsOfBookmarkCreation, monthsOfUrlCreation } =
    useLibrarySelector((state) => state.months)
  const [lastQueryTags, setLastQueryTags] = useState<string | null>(null)
  const [lastQueryFilter, setLastQueryFilter] = useState<string | null>(null)

  const getMonths = () => {
    const getMonthsParams: MonthsParams.Public = {
      username: params.username,
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
  }, [queryParams])

  useUpdateEffect(() => {
    if (data) {
      sessionStorage.setItem('monthsData', JSON.stringify(data))
    }
  }, [data])

  useEffect(() => {
    const monthsData = sessionStorage.getItem('monthsData')
    if (monthsData) {
      dispatch(monthsActions.setData(JSON.parse(monthsData)))
    } else {
      getMonths()
    }

    return () => {
      sessionStorage.removeItem('monthsData')
    }
  }, [])

  return { monthsOfBookmarkCreation, monthsOfUrlCreation }
}
