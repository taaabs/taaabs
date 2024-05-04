import { AuthContext } from '@/app/auth-provider'
import { use_library_dispatch, use_library_selector } from '@/stores/library'
import { Filter } from '@/types/library/filter'
import { GetTagHierarchies_Params } from '@repositories/modules/tag-hierarchies/domain/types/get-tag-hierarchies.params'
import { tag_hierarchies_actions } from '@repositories/stores/library/tag-hierarchies/tag-hierarchies.slice'
import { useParams } from 'next/navigation'
import { useContext } from 'react'

export const use_tag_hierarchies = () => {
  const auth_context = useContext(AuthContext)!
  const { username }: { username?: string } = useParams()
  const dispatch = use_library_dispatch()
  const {
    is_fetching,
    tag_hierarchies,
    total,
    is_updating,
    fetched_at_timestamp,
  } = use_library_selector((state) => state.tag_hierarchies)

  const get_authorized_request_params_ = (params: {
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

  const get_tag_hierarchies_ = async (params: {
    filter?: Filter
    gte?: number
    lte?: number
  }) => {
    if (!username) {
      const request_params = get_authorized_request_params_(params)

      await dispatch(
        tag_hierarchies_actions.get_tag_hierarchies_authorized({
          request_params,
          ky: auth_context.ky_instance,
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
          ky: auth_context.ky_instance,
        }),
      )
    }
  }

  return {
    is_fetching,
    get_tag_hierarchies_,
    get_authorized_request_params_,
    fetched_at_timestamp,
    tag_hierarchies,
    total,
    is_updating,
  }
}
