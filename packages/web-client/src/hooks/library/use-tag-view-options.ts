import { updateSearchParam } from '@/utils/update-query-param'
import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'
import { useState } from 'react'

export const use_tag_view_options = () => {
  const query_params = use_shallow_search_params()
  const [actual_selected_tags, set_actual_selected_tags] = useState<number[]>(
    query_params.get('t')
      ? query_params
          .get('t')!
          .split(',')
          .map((t) => parseInt(t))
      : [],
  )

  const add_tag_to_query_params = (tagId: number) => {
    set_actual_selected_tags([...actual_selected_tags, tagId])

    const updated_query_params = updateSearchParam(
      query_params,
      't',
      [...actual_selected_tags, tagId].join(','),
    )
    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  const remove_tag_from_query_params = (tagId: number) => {
    set_actual_selected_tags(actual_selected_tags.filter((t) => t != tagId))
    const updated_query_params = updateSearchParam(
      query_params,
      't',
      actual_selected_tags.filter((t) => t != tagId).join(','),
    )
    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  return {
    add_tag_to_query_params,
    remove_tag_from_query_params,
    actual_selected_tags,
    set_actual_selected_tags,
  }
}
