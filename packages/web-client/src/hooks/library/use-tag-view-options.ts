import { updateSearchParam } from '@/utils/update-query-param'
import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'
import { useState } from 'react'

export const useTagViewOptions = () => {
  const queryParams = use_shallow_search_params()
  const [actualSelectedTags, setActualSelectedTags] = useState<number[]>(
    queryParams.get('t')
      ? queryParams
          .get('t')!
          .split(',')
          .map((t) => parseInt(t))
      : [],
  )

  const addTagToQueryParams = (tagId: number) => {
    setActualSelectedTags([...actualSelectedTags, tagId])

    const updatedQueryParams = updateSearchParam(
      queryParams,
      't',
      [...actualSelectedTags, tagId].join(','),
    )
    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updatedQueryParams,
    )
  }

  const removeTagFromQueryParams = (tagId: number) => {
    setActualSelectedTags(actualSelectedTags.filter((t) => t != tagId))
    const updatedQueryParams = updateSearchParam(
      queryParams,
      't',
      actualSelectedTags.filter((t) => t != tagId).join(','),
    )
    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updatedQueryParams,
    )
  }

  return {
    addTagToQueryParams,
    removeTagFromQueryParams,
    actualSelectedTags,
    setActualSelectedTags,
  }
}
