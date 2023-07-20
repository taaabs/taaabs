import { useEffect, useState } from 'react'
import { useLibraryDispatch, useLibrarySelector } from './store'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { monthsActions } from '@repositories/stores/other-user/library/months/months.slice'
import { OrderBy } from '@shared/types/modules/bookmarks/order-by'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import { updateQueryParam } from '@/utils/update-query-param'

export const useTags = ({
  initYymmStart,
  initYymmEnd,
}: {
  initYymmStart: number | null
  initYymmEnd: number | null
}) => {
  const router = useRouter()
  const params = useParams()
  const queryParams = useSearchParams()
  const dispatch = useLibraryDispatch()
  const { data, tags } = useLibrarySelector((state) => state.months)
  const [yymmStart, setYymmStart] = useState<number | null>(initYymmStart)
  const [yymmEnd, setYymmEnd] = useState<number | null>(initYymmEnd)
  const [lastQueryOrderBy, setLastQueryOrderBy] = useState<string | null>(null)

  useUpdateEffect(() => {
    let updatedQueryParams: any
    if (yymmStart && yymmEnd) {
      updatedQueryParams = updateQueryParam(queryParams, 's', `${yymmStart}`)
      updatedQueryParams = updateQueryParam(
        updatedQueryParams,
        'e',
        `${yymmEnd}`,
      )

      router.push(`/${params.username}/library?${updatedQueryParams}`, {
        scroll: false,
      })

      processTags({
        orderBy: lastQueryOrderBy
          ? Object.values(OrderBy)[parseInt(lastQueryOrderBy)]
          : undefined,
      })
    }
  }, [yymmStart, yymmEnd])

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
