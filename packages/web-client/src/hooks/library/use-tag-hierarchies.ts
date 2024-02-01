import { use_library_dispatch, use_library_selector } from '@/stores/library'
import { Filter } from '@/types/library/filter'
import { GetTagHierarchies_Params } from '@repositories/modules/tag-hierarchies/domain/types/get-tag-hierarchies.params'
import { tag_hierarchies_actions } from '@repositories/stores/library/tag-hierarchies/tag-hierarchies.slice'
import { useParams } from 'next/navigation'

export const use_tag_hierarchies = () => {
  const { username }: { username?: string } = useParams()
  const dispatch = use_library_dispatch()
  const { tree, is_fetching, is_updating } = use_library_selector(
    (state) => state.tag_hierarchies,
  )

  const get_tag_hierarchies = (params: {
    filter?: Filter
    gte?: number
    lte?: number
  }) => {
    if (!username) {
      const request_params: GetTagHierarchies_Params.Authorized = {}

      if (params.filter) {
        request_params.starred_only =
          params.filter == Filter.Starred ||
          params.filter == Filter.StarredUnread ||
          params.filter == Filter.ArchivedStarred ||
          params.filter == Filter.ArchivedStarredUnread ||
          undefined

        request_params.unread_only =
          params.filter == Filter.Unread ||
          params.filter == Filter.StarredUnread ||
          params.filter == Filter.ArchivedUnread ||
          params.filter == Filter.ArchivedStarredUnread ||
          undefined

        request_params.is_archived =
          params.filter == Filter.Archived ||
          params.filter == Filter.ArchivedStarred ||
          params.filter == Filter.ArchivedUnread ||
          params.filter == Filter.ArchivedStarredUnread ||
          undefined
      }

      request_params.gte = params.gte
      request_params.lte = params.lte

      dispatch(
        tag_hierarchies_actions.get_tag_hierarchies_authorized({
          request_params,
          api_url: process.env.NEXT_PUBLIC_API_URL,
          auth_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
        }),
      )
    } else {
      const request_params: GetTagHierarchies_Params.Public = {
        username,
      }

      if (params.filter) {
        request_params.starred_only =
          params.filter == Filter.Starred ||
          params.filter == Filter.StarredUnread ||
          params.filter == Filter.ArchivedStarred ||
          params.filter == Filter.ArchivedStarredUnread ||
          undefined

        request_params.is_archived =
          params.filter == Filter.Archived ||
          params.filter == Filter.ArchivedStarred ||
          params.filter == Filter.ArchivedUnread ||
          params.filter == Filter.ArchivedStarredUnread ||
          undefined
      }
      dispatch(
        tag_hierarchies_actions.get_tag_hierarchies_public({
          request_params,
          api_url: process.env.NEXT_PUBLIC_API_URL,
          auth_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
        }),
      )
    }
  }

  return {
    get_tag_hierarchies,
    tree,
    is_fetching,
    is_updating,
  }
}
