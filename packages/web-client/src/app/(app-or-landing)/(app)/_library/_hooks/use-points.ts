import { Points_DataSourceImpl } from '@repositories/modules/points/infrastructure/data-sources/points.data-source-impl'
import { Points_RepositoryImpl } from '@repositories/modules/points/infrastructure/repositories/points.repository-impl'
import { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import useDebouncedCallback from 'beautiful-react-hooks/useDebouncedCallback'
import { useParams, useSearchParams } from 'next/navigation'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { use_library_dispatch } from '@/stores/library'
import { bookmarks_actions } from '@repositories/stores/library/bookmarks/bookmarks.slice'
import { AuthContext } from '@/app/auth-provider'
import { KyInstance } from 'ky'

// This logic works only because of referential nature of "points_given" obejct. It works but could be moved to redux.
export const use_points = () => {
  const auth_context = useContext(AuthContext)!
  const dispatch = use_library_dispatch()
  const search_params = useSearchParams()
  const { username }: { username?: string } = useParams()
  const [points_given, set_points_given] = useState<{
    [bookmark_id: string]: number
  }>({})

  useUpdateEffect(() => {
    set_points_given({})
  }, [search_params])

  const submit_points_debounced = useDebouncedCallback(
    async (params: {
      receiver_usernamae: string
      bookmark_id: number
      points: number
      ky: KyInstance
    }) => {
      const data_source = new Points_DataSourceImpl(params.ky)
      const repository = new Points_RepositoryImpl(data_source)
      try {
        await repository.give_points({
          receiver_username: params.receiver_usernamae,
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

  const get_points_given_on_bookmark = async (params: {
    bookmark_id: number
  }) => {
    const data_source = new Points_DataSourceImpl(auth_context.ky_instance)
    const repository = new Points_RepositoryImpl(data_source)
    try {
      const given_till_now = await repository.check_total_given_points({
        receiver_username: username
          ? username
          : auth_context.auth_data!.username,
        bookmark_id: params.bookmark_id,
      })
      set_points_given({
        ...points_given,
        [params.bookmark_id]: given_till_now,
      })
    } catch {
      toast.error('Something went wrong, try again later')
    }
  }

  const give_points = async (params: {
    bookmark_id: number
    points: number
  }) => {
    submit_points_debounced({
      receiver_usernamae: username
        ? username
        : auth_context.auth_data!.username,
      bookmark_id: params.bookmark_id,
      points: params.points,
      ky: auth_context.ky_instance,
    })
    dispatch(bookmarks_actions.add_point({ bookmark_id: params.bookmark_id }))
  }

  return { give_points, points_given, get_points_given_on_bookmark }
}
