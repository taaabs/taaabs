import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { updateQueryParam } from '@/utils/update-query-param'

export type SortOption = 'newest-to-oldest' | 'oldest-to-newest'

export const useSortOptions = (initSortOption: SortOption) => {
  const queryParams = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const [selectedSortOption, setSelectedSortOption] =
    useState<SortOption>(initSortOption)

  useUpdateEffect(() => {
    const updatedQueryParams = updateQueryParam(
      queryParams,
      's',
      _sortOptionToQueryParam(selectedSortOption),
    )
    router.push(`/${params.username}/library?${updatedQueryParams}`)
  }, [selectedSortOption])

  return { selectedSortOption, setSelectedSortOption }
}

function _sortOptionToQueryParam(sortOption: SortOption) {
  if (sortOption == 'newest-to-oldest') {
    return 'desc'
  }
  return 'asc'
}
