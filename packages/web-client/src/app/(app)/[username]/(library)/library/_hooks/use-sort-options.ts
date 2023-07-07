import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import {
  ReadonlyURLSearchParams,
  useParams,
  useRouter,
  useSearchParams,
} from 'next/navigation'

export type SortOption = 'newest-to-oldest' | 'oldest-to-newest'

export const useSortOptions = (initSortOption: SortOption) => {
  const queryParams = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const [selectedSortOption, setSelectedSortOption] =
    useState<SortOption>(initSortOption)

  useUpdateEffect(() => {
    const updatedQueryParams = _updateQueryParam(
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

function _updateQueryParam(
  queryParams: ReadonlyURLSearchParams,
  param: string,
  value: string,
) {
  const currentSearchParams = new URLSearchParams(
    Array.from(queryParams.entries()),
  )
  currentSearchParams.set(param, value)

  return currentSearchParams
}
