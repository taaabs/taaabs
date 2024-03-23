import { GivePoints_UseCase } from '@repositories/modules/points/domain/usecases/give-points.use-case'
import { Points_DataSourceImpl } from '@repositories/modules/points/infrastructure/data-sources/points.data-source-impl'
import { Points_RepositoryImpl } from '@repositories/modules/points/infrastructure/repositories/points.repository-impl'
import { useState } from 'react'
import { toast } from 'react-toastify'
import useDebouncedCallback from 'beautiful-react-hooks/useDebouncedCallback'
import { useSearchParams } from 'next/navigation'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { system_values } from '@shared/constants/system-values'
import { use_library_dispatch } from '@/stores/library'
import { bookmarks_actions } from '@repositories/stores/library/bookmarks/bookmarks.slice'
import { CheckTotalGivenPoints_UseCase } from '@repositories/modules/points/domain/usecases/check-total-given-points.use-case'

// This logic works only because of referential nature of "points_given" obejct. It works but could be moved to redux.
export const use_points = () => {
  const dispatch = use_library_dispatch()
  const search_params = useSearchParams()
  const username = 'test_user'
  const [points_given, set_points_given] = useState<{
    [bookmark_id: string]: number
  }>({})
  const [is_fetching_given_amount, set_is_fetching_given_amount] =
    useState(false)

  useUpdateEffect(() => {
    set_points_given({})
  }, [search_params])

  const submit_points_debounced = useDebouncedCallback(
    async (params: { bookmark_id: number; points: number }) => {
      const data_source = new Points_DataSourceImpl(
        process.env.NEXT_PUBLIC_API_URL,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhQmNEZSIsImlhdCI6MTcxMDM1MjExNn0.ZtpENZ0tMnJuGiOM-ttrTs5pezRH-JX4_vqWDKYDPWY',
      )
      const repository = new Points_RepositoryImpl(data_source)
      const give_points = new GivePoints_UseCase(repository)
      try {
        await give_points.invoke({
          receiver_username: username,
          points: params.points,
          bookmark_id: params.bookmark_id,
        })
      } catch {
        toast.error('Something went wrong, try again later')
      }
    },
    [],
    250,
  )

  const give_point = async (params: { bookmark_id: number }) => {
    if (is_fetching_given_amount) return

    let given_overall = 0

    if (points_given[params.bookmark_id]) {
      given_overall = points_given[params.bookmark_id]
    } else {
      set_is_fetching_given_amount(true)
      const data_source = new Points_DataSourceImpl(
        process.env.NEXT_PUBLIC_API_URL,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhQmNEZSIsImlhdCI6MTcxMDM1MjExNn0.ZtpENZ0tMnJuGiOM-ttrTs5pezRH-JX4_vqWDKYDPWY',
      )
      const repository = new Points_RepositoryImpl(data_source)
      const check_given_points_amount = new CheckTotalGivenPoints_UseCase(
        repository,
      )
      try {
        given_overall = await check_given_points_amount.invoke({
          receiver_username: username,
          bookmark_id: params.bookmark_id,
        })
      } catch {
        toast.error('Something went wrong, try again later')
      }
    }

    if (given_overall == system_values.bookmark.points.limit_per_user) {
      toast.info(
        `You can add up to ${system_values.bookmark.points.limit_per_user} points`,
      )
      return
    }

    set_points_given({
      [params.bookmark_id]: given_overall + 1,
    })

    set_is_fetching_given_amount(false)
    submit_points_debounced({
      bookmark_id: params.bookmark_id,
      points: given_overall + 1,
    })
    dispatch(bookmarks_actions.add_point({ bookmark_id: params.bookmark_id }))
  }

  return { give_point, points_given }
}
