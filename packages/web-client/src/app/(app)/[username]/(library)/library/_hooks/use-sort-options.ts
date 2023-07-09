import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { updateQueryParam } from '@/utils/update-query-param'

export enum SortOption {
  NewestToOldest,
  OldestToNewest,
}

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
      selectedSortOption.toString(),
    )
    router.push(`/${params.username}/library?${updatedQueryParams}`, {
      scroll: false,
    })
  }, [selectedSortOption])

  return { selectedSortOption, setSelectedSortOption }
}
