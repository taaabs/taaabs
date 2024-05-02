import { use_library_dispatch, use_library_selector } from '@/stores/library'
import { Filter } from '@/types/library/filter'
import { GetTagHierarchies_Params } from '@repositories/modules/tag-hierarchies/domain/types/get-tag-hierarchies.params'
import { tag_hierarchies_actions } from '@repositories/stores/library/tag-hierarchies/tag-hierarchies.slice'
import ky from 'ky'
import { useParams } from 'next/navigation'

export const use_tag_hierarchies = () => {
  const { username }: { username?: string } = useParams()
  const dispatch = use_library_dispatch()
  const {
    is_fetching,
    tag_hierarchies,
    total,
    is_updating,
    fetched_at_timestamp,
  } = use_library_selector((state) => state.tag_hierarchies)

  const get_authorized_request_params = (params: {
    filter?: Filter
    gte?: number
    lte?: number
  }) => {
    const request_params: GetTagHierarchies_Params.Authorized = {
      gte: params.gte,
      lte: params.lte,
    }

    if (params.filter) {
      request_params.starred_only =
        params.filter == Filter.STARRED ||
        params.filter == Filter.STARRED_UNREAD ||
        params.filter == Filter.ARCHIVED_STARRED ||
        params.filter == Filter.ARCHIVED_STARRED_UNREAD ||
        undefined

      request_params.unread_only =
        params.filter == Filter.UNREAD ||
        params.filter == Filter.STARRED_UNREAD ||
        params.filter == Filter.ARCHIVED_UNREAD ||
        params.filter == Filter.ARCHIVED_STARRED_UNREAD ||
        undefined

      request_params.is_archived =
        params.filter == Filter.ARCHIVED ||
        params.filter == Filter.ARCHIVED_STARRED ||
        params.filter == Filter.ARCHIVED_UNREAD ||
        params.filter == Filter.ARCHIVED_STARRED_UNREAD ||
        undefined
    }
    return request_params
  }

  const get_tag_hierarchies = async (params: {
    filter?: Filter
    gte?: number
    lte?: number
  }) => {
    const ky_instance = ky.create({
      prefixUrl: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhQmNEZSIsImlhdCI6MTcxMDM1MjExNn0.ZtpENZ0tMnJuGiOM-ttrTs5pezRH-JX4_vqWDKYDPWY`,
        'Content-Type': 'application/json',
      },
    })
    if (!username) {
      const request_params = get_authorized_request_params(params)

      await dispatch(
        tag_hierarchies_actions.get_tag_hierarchies_authorized({
          request_params,
          ky: ky_instance,
        }),
      )
    } else {
      const request_params: GetTagHierarchies_Params.Public = {
        username,
        gte: params.gte,
        lte: params.lte,
      }

      if (params.filter) {
        request_params.starred_only =
          params.filter == Filter.STARRED ||
          params.filter == Filter.STARRED_UNREAD ||
          params.filter == Filter.ARCHIVED_STARRED ||
          params.filter == Filter.ARCHIVED_STARRED_UNREAD ||
          undefined

        request_params.is_archived =
          params.filter == Filter.ARCHIVED ||
          params.filter == Filter.ARCHIVED_STARRED ||
          params.filter == Filter.ARCHIVED_UNREAD ||
          params.filter == Filter.ARCHIVED_STARRED_UNREAD ||
          undefined
      }
      await dispatch(
        tag_hierarchies_actions.get_tag_hierarchies_public({
          request_params,
          ky: ky_instance,
        }),
      )
    }
  }

  return {
    is_fetching,
    get_tag_hierarchies,
    get_authorized_request_params,
    fetched_at_timestamp,
    tag_hierarchies,
    total,
    is_updating,
  }
}
