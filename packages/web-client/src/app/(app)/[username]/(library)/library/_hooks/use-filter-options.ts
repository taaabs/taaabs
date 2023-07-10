import { updateQueryParam } from '@/utils/update-query-param'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export enum FilterOption {
  All,
  AllWithoutNsfw,
  StarredOnly,
  StarredOnlyWithoutNsfw,
  ArchivedOnly,
  ArchivedOnlyWithoutNsfw,
}

export const useFilterOptions = (initFilterOption: FilterOption) => {
  const queryParams = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const [withoutNsfw, setWithoutNsfw] = useState(
    initFilterOption == FilterOption.AllWithoutNsfw ||
      initFilterOption == FilterOption.StarredOnlyWithoutNsfw ||
      initFilterOption == FilterOption.ArchivedOnlyWithoutNsfw,
  )
  const [selectedFilterOption, setSelectedFilterOption] =
    useState<FilterOption>(initFilterOption)

  useUpdateEffect(() => {
    const updatedQueryParams = updateQueryParam(
      queryParams,
      'f',
      selectedFilterOption.toString(),
    )
    router.push(`/${params.username}/library?${updatedQueryParams}`, {
      scroll: false,
    })
  }, [selectedFilterOption])

  useUpdateEffect(() => {
    if (withoutNsfw) {
      switch (selectedFilterOption) {
        case FilterOption.All:
          setSelectedFilterOption(FilterOption.AllWithoutNsfw)
          break
        case FilterOption.StarredOnly:
          setSelectedFilterOption(FilterOption.StarredOnlyWithoutNsfw)
          break
        case FilterOption.ArchivedOnly:
          setSelectedFilterOption(FilterOption.ArchivedOnlyWithoutNsfw)
          break
      }
    } else {
      switch (selectedFilterOption) {
        case FilterOption.AllWithoutNsfw:
          setSelectedFilterOption(FilterOption.All)
          break
        case FilterOption.StarredOnlyWithoutNsfw:
          setSelectedFilterOption(FilterOption.StarredOnly)
          break
        case FilterOption.ArchivedOnlyWithoutNsfw:
          setSelectedFilterOption(FilterOption.ArchivedOnly)
          break
      }
    }
  }, [withoutNsfw])

  return {
    selectedFilterOption,
    setSelectedFilterOption,
    withoutNsfw,
    setWithoutNsfw,
  }
}
