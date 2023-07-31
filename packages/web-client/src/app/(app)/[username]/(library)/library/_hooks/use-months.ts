import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useLibraryDispatch, useLibrarySelector } from './store'
import { monthsActions } from '@repositories/stores/other-user/library/months/months.slice'
import { useEffect, useState } from 'react'
import { MonthsParams } from '@repositories/modules/months/domain/types/months.params'
import { LibraryFilter } from '@shared/types/common/library-filter'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { updateQueryParam } from '@/utils/update-query-param'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export const useMonths = () => {
  const router = useRouter()
  const queryParams = useSearchParams()
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

  const addTagToQueryParams = (tag: string) => {
    let tags = ''
    const queryTags = queryParams.get('t')
    if (queryTags) {
      tags = queryTags + `,${tag}`
    } else {
      tags = tag
    }
    const updatedQueryParams = updateQueryParam(queryParams, 't', tags)
    router.push(`/${params.username}/library?${updatedQueryParams}`, {
      scroll: false,
    })
  }

  const removeTagFromQueryParams = (tag: string) => {
    const updatedQueryParams = updateQueryParam(
      queryParams,
      't',
      selectedTags.filter((t) => t != tag).join(','),
    )

    router.push(`/${params.username}/library?${updatedQueryParams}`, {
      scroll: false,
    })
  }

  const setGteLteQueryParams = ({ gte, lte }: { gte: number; lte: number }) => {
    let updatedQueryParams: any
    updatedQueryParams = updateQueryParam(queryParams, 'gte', `${gte}`)
    updatedQueryParams = updateQueryParam(updatedQueryParams, 'lte', `${lte}`)

    router.push(`/${params.username}/library?${updatedQueryParams}`, {
      scroll: false,
    })
  }

  const clearGteLteQueryParams = () => {
    let updatedQueryParams: any
    updatedQueryParams = updateQueryParam(queryParams, 'gte', '')
    updatedQueryParams = updateQueryParam(updatedQueryParams, 'lte', '')

    router.push(`/${params.username}/library?${updatedQueryParams}`, {
      scroll: false,
    })
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
      setSelectedTags(queryTags.split(','))
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
    const monthsData = sessionStorage.getItem('monthsData')
    if (monthsData) {
      dispatch(monthsActions.setData(JSON.parse(monthsData)))
    } else {
      getMonths()
    }

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
    setGteLteQueryParams,
    clearGteLteQueryParams,
    tagsOfBookmarkCreation,
    tagsOfUrlCreation,
    addTagToQueryParams,
    selectedTags,
    removeTagFromQueryParams,
  }
}
