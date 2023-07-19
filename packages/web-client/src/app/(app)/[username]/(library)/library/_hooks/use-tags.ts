import { useEffect, useState } from 'react'
import { useLibraryDispatch, useLibrarySelector } from './store'
import { useSearchParams } from 'next/navigation'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { monthsActions } from '@repositories/stores/other-user/library/months/months.slice'
import { OrderBy } from '@shared/types/modules/bookmarks/order-by'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'

export const useTags = () => {
  const queryParams = useSearchParams()
  const dispatch = useLibraryDispatch()
  const { data, tags } = useLibrarySelector((state) => state.months)
  const [yymmStart, setYymmStart] = useState<number | null>(null)
  const [yymmEnd, setYymmEnd] = useState<number | null>(null)
  const [lastQueryOrderBy, setLastQueryOrderBy] = useState<string | null>(null)

  const processTags = ({ orderBy }: { orderBy?: OrderBy }) => {
    dispatch(
      monthsActions.processTags({
        orderBy: orderBy ? orderBy : BookmarksFetchingDefaults.Common.orderBy,
        yymmStart: yymmStart || undefined,
        yymmEnd: yymmEnd || undefined,
      }),
    )
  }

  useUpdateEffect(() => {
    setYymmStart(null)
    setYymmEnd(null)
    processTags({})
  }, [data])

  useUpdateEffect(() => {
    if (tags) {
      sessionStorage.setItem('tags', JSON.stringify(tags))
    }
  }, [tags])

  useUpdateEffect(() => {
    const queryOrderBy = queryParams.get('b')
    if (queryOrderBy && queryOrderBy != lastQueryOrderBy) {
      setLastQueryOrderBy(queryOrderBy)
      processTags({ orderBy: Object.values(OrderBy)[parseInt(queryOrderBy)] })
    }
  }, [queryParams])

  useEffect(() => {
    const tags = sessionStorage.getItem('tags')
    if (tags) {
      dispatch(monthsActions.setTags(JSON.parse(tags)))
    }

    return () => {
      sessionStorage.removeItem('tags')
    }
  }, [])

  return { yymmStart, setYymmStart, yymmEnd, setYymmEnd }
}
