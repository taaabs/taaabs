import { updateSearchParam } from '@/utils/update-query-param'
import { useShallowSearchParams } from '../use-push-state-listener'
import { useState } from 'react'

export const useTagViewOptions = () => {
  const queryParams = useShallowSearchParams()
  const [actualSelectedTags, setActualSelectedTags] = useState<string[]>(
    queryParams.get('t') ? queryParams.get('t')!.split(',') : [],
  )

  const addTagToQueryParams = (tag: string) => {
    setActualSelectedTags([...actualSelectedTags, tag])

    const updatedQueryParams = updateSearchParam(
      queryParams,
      't',
      [...actualSelectedTags, tag].join(','),
    )
    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updatedQueryParams,
    )
  }

  const removeTagFromQueryParams = (tag: string) => {
    setActualSelectedTags(actualSelectedTags.filter((t) => t != tag))

    const updatedQueryParams = updateSearchParam(
      queryParams,
      't',
      actualSelectedTags.filter((t) => t != tag).join(','),
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
  }
}
