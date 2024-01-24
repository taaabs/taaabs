import { use_library_dispatch, use_library_selector } from '@/stores/library'
import { tag_hierarchies_actions } from '@repositories/stores/library/tag-hierarchies/tag-hierarchies.slice'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

export const use_tag_hierarchies = () => {
  const { username }: { username?: string } = useParams()
  const dispatch = use_library_dispatch()
  const { tree, is_fetching, is_updating } = use_library_selector(
    (state) => state.tag_hierarchies,
  )

  const get_tag_hierarchies = () => {
    if (!username) {
      dispatch(
        tag_hierarchies_actions.get_tag_hierarchies_authorized({
          api_url: process.env.NEXT_PUBLIC_API_URL,
          auth_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
        }),
      )
    } else {
      dispatch(
        tag_hierarchies_actions.get_tag_hierarchies_public({
          request_params: {
            username,
          },
          api_url: process.env.NEXT_PUBLIC_API_URL,
          auth_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
        }),
      )
    }
  }

  useEffect(() => {
    get_tag_hierarchies()
  }, [])

  return {
    tree,
    is_fetching,
    is_updating,
  }
}
