import { useEffect, useState } from 'react'
import { useLibraryDispatch, useLibrarySelector } from './store'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { monthsActions } from '@repositories/stores/other-user/library/months/months.slice'
import { OrderBy } from '@shared/types/modules/bookmarks/order-by'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import { updateQueryParam } from '@/utils/update-query-param'

export const useTags = ({
  initYyyymmGte,
  initYyyymmLte,
}: {
  initYyyymmGte: number | null
  initYyyymmLte: number | null
}) => {
  const router = useRouter()
  const params = useParams()
  const queryParams = useSearchParams()
  const dispatch = useLibraryDispatch()
  const { data, tags } = useLibrarySelector((state) => state.months)
  const [yyyymmGte, setYyyymmGte] = useState<number | null>(initYyyymmGte)
  const [yyyymmLte, setYyyymmLte] = useState<number | null>(initYyyymmLte)
  const [lastQueryOrderBy, setLastQueryOrderBy] = useState<string | null>(null)

  useUpdateEffect(() => {
    if (yyyymmGte && yyyymmLte) {
      const queryYyyymmGte = queryParams.get('gte')
      if (!queryYyyymmGte) {
        setYyyymmGte(null)
      }

      const queryYyyymmLte = queryParams.get('lte')
      if (!queryYyyymmLte) {
        setYyyymmLte(null)
      }
    }
  }, [queryParams])

  useUpdateEffect(() => {
    let updatedQueryParams: any
    if (yyyymmGte && yyyymmLte) {
      updatedQueryParams = updateQueryParam(queryParams, 'gte', `${yyyymmGte}`)
      updatedQueryParams = updateQueryParam(
        updatedQueryParams,
        'lte',
        `${yyyymmLte}`,
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
  }, [yyyymmGte, yyyymmLte])

  const processTags = ({ orderBy }: { orderBy?: OrderBy }) => {
    dispatch(
      monthsActions.processTags({
        orderBy: orderBy ? orderBy : BookmarksFetchingDefaults.Common.orderBy,
        yyyymmGte: yyyymmGte || undefined,
        yyyymmLte: yyyymmLte || undefined,
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

  return { yyyymmGte, setYyyymmGte, yyyymmLte, setYyyymmLte }
}
