import { update_query_params } from '@/utils/update-query-params'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

export const use_tag_view_options = () => {
  const query_params = useSearchParams()
  const [actual_selected_tags, set_actual_selected_tags] = useState<number[]>(
    query_params.get('t')
      ? query_params
          .get('t')!
          .split(',')
          .map((t) => parseInt(t))
      : [],
  )

  useUpdateEffect(() => {
    set_actual_selected_tags(
      query_params.get('t')
        ? query_params
            .get('t')!
            .split(',')
            .map((t) => parseInt(t))
        : [],
    )
  }, [query_params])

  // "useCallback" is required by Tags component.
  const add_tag_to_query_params = useCallback(
    (tag_id: number) => {
      const selected_tags = query_params.get('t')
        ? query_params
            .get('t')!
            .split(',')
            .map((t) => parseInt(t))
        : []

      const updated_query_params = update_query_params(
        query_params,
        't',
        [...selected_tags, tag_id].join(','),
      )

      window.history.pushState(
        {},
        '',
        window.location.pathname + '?' + updated_query_params,
      )
    },
    [query_params],
  )

  const remove_tag_from_query_params = (tag_id: number) => {
    const selected_tags = query_params.get('t')
      ? query_params
          .get('t')!
          .split(',')
          .map((t) => parseInt(t))
      : []

    const updated_query_params = update_query_params(
      query_params,
      't',
      selected_tags.filter((t) => t != tag_id).join(','),
    )
    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  const clear_selected_tags = () => {
    const updated_query_params = update_query_params(query_params, 't')

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  return {
    actual_selected_tags,
    set_actual_selected_tags,
    add_tag_to_query_params,
    remove_tag_from_query_params,
    clear_selected_tags,
  }
}
