import { clear_library_session_storage } from '@/utils/clear_library_session_storage'
import { update_search_params } from '@/utils/update-query-params'
import { system_values } from '@shared/constants/system-values'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export const use_tag_view_options = () => {
  const search_params = useSearchParams()
  const path_params = useParams()
  const [selected_tags, set_selected_tags] = useState<number[]>(
    search_params.get('t')
      ? search_params
          .get('t')!
          .split(',')
          .map((t) => parseInt(t))
      : [],
  )
  const [dragged_tag, set_dragged_tag] = useState<{
    id: number
    name: string
    source_bookmark_id?: number
    over_sibling_tag_name?: string
  }>()

  // Clear dragged tag.
  useEffect(() => {
    const on_mouse_up = () => {
      set_dragged_tag(undefined)
    }
    addEventListener('mouseup', on_mouse_up)
    return () => {
      removeEventListener('mouseup', on_mouse_up)
    }
  }, [])

  useUpdateEffect(() => {
    const search_params_tags = search_params.get('t')
    if (
      search_params_tags &&
      search_params_tags.split(',').length != selected_tags.length
    ) {
      set_selected_tags(search_params_tags.split(',').map((t) => parseInt(t)))
    } else if (!search_params_tags && selected_tags.length) {
      set_selected_tags([])
    }
  }, [search_params])

  const add_tag_to_search_params = (tag_id: number) => {
    if (selected_tags.length == system_values.library.max_selected_tags) {
      toast.error(
        `Up to ${system_values.library.max_selected_tags} tags can be selected at a time`,
      )
      return
    }

    const current_tags = search_params.get('t')
      ? search_params
          .get('t')!
          .split(',')
          .map((t) => parseInt(t))
      : []

    const updated_search_params = update_search_params(
      search_params,
      't',
      [...current_tags, tag_id].join(','),
    )

    clear_library_session_storage({
      username: path_params.username as string,
      search_params: updated_search_params.toString(),
    })

    clear_library_session_storage({
      username: path_params.username as string,
      search_params: updated_search_params.toString(),
    })

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_search_params,
    )
  }

  const remove_tags_from_search_params = (tag_ids: number[]) => {
    const selected_tags = search_params.get('t')
      ? search_params
          .get('t')!
          .split(',')
          .map((t) => parseInt(t))
      : []

    const updated_search_params = update_search_params(
      search_params,
      't',
      selected_tags.filter((t) => tag_ids.every((tag) => tag != t)).join(','),
    )

    clear_library_session_storage({
      username: path_params.username as string,
      search_params: updated_search_params.toString(),
    })

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_search_params,
    )
  }

  const set_many_tags_to_search_params = (params: { tag_ids: number[] }) => {
    if (params.tag_ids.length > system_values.library.max_selected_tags) return

    const updated_search_params = update_search_params(
      search_params,
      't',
      params.tag_ids.join(','),
    )

    clear_library_session_storage({
      username: path_params.username as string,
      search_params: updated_search_params.toString(),
    })

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_search_params,
    )
  }

  const clear_selected_tags = () => {
    const updated_search_params = update_search_params(search_params, 't')

    clear_library_session_storage({
      username: path_params.username as string,
      search_params: updated_search_params.toString(),
    })

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_search_params,
    )
  }

  return {
    selected_tags,
    set_selected_tags,
    add_tag_to_search_params,
    remove_tags_from_search_params,
    clear_selected_tags,
    set_many_tags_to_search_params,
    dragged_tag,
    set_dragged_tag,
  }
}
