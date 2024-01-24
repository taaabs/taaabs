import { clear_library_session_storage } from '@/utils/clear_library_session_storage'
import { update_query_params } from '@/utils/update-query-params'
import { system_values } from '@shared/constants/system-values'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useParams, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export const use_tag_view_options = () => {
  const query_params = useSearchParams()
  const path_params = useParams()
  const [selected_tags, set_selected_tags] = useState<number[]>(
    query_params.get('t')
      ? query_params
          .get('t')!
          .split(',')
          .map((t) => parseInt(t))
      : [],
  )

  useUpdateEffect(() => {
    set_selected_tags(
      query_params.get('t')
        ? query_params
            .get('t')!
            .split(',')
            .map((t) => parseInt(t))
        : [],
    )
  }, [query_params])

  const add_tag_to_query_params = (tag_id: number) => {
    if (selected_tags.length == system_values.library.max_selected_tags) return

    const current_tags = query_params.get('t')
      ? query_params
          .get('t')!
          .split(',')
          .map((t) => parseInt(t))
      : []

    const updated_query_params = update_query_params(
      query_params,
      't',
      [...current_tags, tag_id].join(','),
    )

    clear_library_session_storage({
      username: path_params.username as string,
      query_parms: updated_query_params.toString(),
    })

    clear_library_session_storage({
      username: path_params.username as string,
      query_parms: updated_query_params.toString(),
    })

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  const remove_tags_from_query_params = (tag_ids: number[]) => {
    const selected_tags = query_params.get('t')
      ? query_params
          .get('t')!
          .split(',')
          .map((t) => parseInt(t))
      : []

    const updated_query_params = update_query_params(
      query_params,
      't',
      selected_tags.filter((t) => tag_ids.every((tag) => tag != t)).join(','),
    )

    clear_library_session_storage({
      username: path_params.username as string,
      query_parms: updated_query_params.toString(),
    })

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  const set_many_tags_to_query_params = (params: { tag_ids: number[] }) => {
    if (params.tag_ids.length >= system_values.library.max_selected_tags) return

    const updated_query_params = update_query_params(
      query_params,
      't',
      params.tag_ids.join(','),
    )

    clear_library_session_storage({
      username: path_params.username as string,
      query_parms: updated_query_params.toString(),
    })

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  const clear_selected_tags = () => {
    const updated_query_params = update_query_params(query_params, 't')

    clear_library_session_storage({
      username: path_params.username as string,
      query_parms: updated_query_params.toString(),
    })

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  return {
    selected_tags,
    set_selected_tags,
    add_tag_to_query_params,
    remove_tags_from_query_params,
    clear_selected_tags,
    set_many_tags_to_query_params,
  }
}
