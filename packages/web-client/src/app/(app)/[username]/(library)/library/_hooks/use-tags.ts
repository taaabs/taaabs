import { useEffect, useState } from 'react'
import { useLibraryDispatch, useLibrarySelector } from './store'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { monthsActions } from '@repositories/stores/other-user/library/months/months.slice'
import { updateQueryParam } from '@/utils/update-query-param'

export const useTags = () => {
  const router = useRouter()
  const params = useParams()
  const queryParams = useSearchParams()
  const dispatch = useLibraryDispatch()
  const {
    monthsData: monthsData,
    tagsOfBookmarkCreation,
    tagsOfUrlCreation,
  } = useLibrarySelector((state) => state.months)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

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
    const queryYyyymmGte = queryParams.get('gte')
    const queryYyyymmLte = queryParams.get('lte')
    if (queryYyyymmGte && queryYyyymmLte) {
      dispatch(
        monthsActions.processTags({
          yyyymmGte: parseInt(queryYyyymmGte),
          yyyymmLte: parseInt(queryYyyymmLte),
        }),
      )
    } else {
      dispatch(monthsActions.processTags({}))
    }
  }, [queryParams])

  useEffect(() => {
    const queryTags = queryParams.get('t')
    if (!queryTags && selectedTags.length > 0) {
      setSelectedTags([])
    } else if (queryTags && queryTags != selectedTags.join(',')) {
      setSelectedTags(queryTags.split(','))
    }
  }, [queryParams])

  useUpdateEffect(() => {
    const yyyymmGte = parseInt(queryParams.get('gte') || '0') || undefined
    const yyyymmLte = parseInt(queryParams.get('lte') || '0') || undefined
    dispatch(
      monthsActions.processTags({
        yyyymmGte,
        yyyymmLte,
      }),
    )
  }, [monthsData])

  useUpdateEffect(() => {
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
  }, [tagsOfBookmarkCreation, tagsOfUrlCreation])

  useEffect(() => {
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
      sessionStorage.removeItem('tagsOfBookmarkCreation')
      sessionStorage.removeItem('tagsOfUrlCreation')
    }
  }, [])

  return {
    setGteLteQueryParams,
    clearGteLteQueryParams,
    tagsOfBookmarkCreation,
    tagsOfUrlCreation,
    addTagToQueryParams,
    selectedTags,
    removeTagFromQueryParams,
  }
}