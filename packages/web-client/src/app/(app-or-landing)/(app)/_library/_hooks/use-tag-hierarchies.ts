import { AuthContext } from '@/providers/AuthProvider'
import { use_library_dispatch, use_library_selector } from '@/stores/library'
import { Filter } from '@/types/library/filter'
import { TagHierarchy_Entity } from '@repositories/modules/tag-hierarchies/domain/entities/tag-hierarchy.entity'
import { GetTagHierarchies_Params } from '@repositories/modules/tag-hierarchies/domain/types/get-tag-hierarchies.params'
import { tag_hierarchies_actions } from '@repositories/stores/library/tag-hierarchies/tag-hierarchies.slice'
import { useParams } from 'next/navigation'
import { useContext } from 'react'

export const use_tag_hierarchies = () => {
  const auth_context = useContext(AuthContext)
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
        params.filter == Filter.STARRED_UNSORTED ||
        params.filter == Filter.ARCHIVED_STARRED ||
        params.filter == Filter.ARCHIVED_STARRED_UNSORTED ||
        undefined

      request_params.unsorted_only =
        params.filter == Filter.UNSORTED ||
        params.filter == Filter.STARRED_UNSORTED ||
        params.filter == Filter.ARCHIVED_UNSORTED ||
        params.filter == Filter.ARCHIVED_STARRED_UNSORTED ||
        undefined

      request_params.is_archived =
        params.filter == Filter.ARCHIVED ||
        params.filter == Filter.ARCHIVED_STARRED ||
        params.filter == Filter.ARCHIVED_UNSORTED ||
        params.filter == Filter.ARCHIVED_STARRED_UNSORTED ||
        undefined
    }
    return request_params
  }

  const get_tag_hierarchies = async (params: {
    filter?: Filter
    gte?: number
    lte?: number
  }) => {
    if (!username) {
      const request_params = get_authorized_request_params(params)

      await dispatch(
        tag_hierarchies_actions.get_tag_hierarchies_authorized({
          request_params,
          ky: auth_context.ky_instance,
          encryption_key: auth_context.auth_data!.encryption_key,
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
          params.filter == Filter.STARRED_UNSORTED ||
          params.filter == Filter.ARCHIVED_STARRED ||
          params.filter == Filter.ARCHIVED_STARRED_UNSORTED ||
          undefined

        request_params.is_archived =
          params.filter == Filter.ARCHIVED ||
          params.filter == Filter.ARCHIVED_STARRED ||
          params.filter == Filter.ARCHIVED_UNSORTED ||
          params.filter == Filter.ARCHIVED_STARRED_UNSORTED ||
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

  const rename = (params: { old_tag_name: string; new_tag_name: string }) => {
    const rename = (entity: TagHierarchy_Entity): TagHierarchy_Entity => {
      return {
        ...entity,
        name:
          entity.name === params.old_tag_name
            ? params.new_tag_name
            : entity.name,
        children: entity.children.map(rename),
      }
    }
    dispatch(
      tag_hierarchies_actions.set_tag_hierarchies(
        tag_hierarchies?.map((th) => rename(th)),
      ),
    )
  }

  return {
    is_fetching,
    get_tag_hierarchies,
    get_authorized_request_params,
    fetched_at_timestamp,
    tag_hierarchies,
    total,
    is_updating,
    rename,
  }
}
