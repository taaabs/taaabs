import { updateQueryParam } from '@/utils/update-query-param'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export enum FilterOption {
  All,
  'AllWithArchived',
  'AllWithArchivedWithoutNsfw',
  'AllWithoutNsfw',
  'StarredOnly',
  'StarredOnlyWithArchived',
  'StarredOnlyWithArchivedWithoutNsfw',
  'StarredOnlyWithoutNsfw',
  'NsfwOnly',
  'NsfwOnlyWithArchived',
  'ArchivedOnly',
  'ArchivedOnlyWithoutNsfw',
}

export const useFilterOptions = (initFilterOption: FilterOption) => {
  const queryParams = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const [withArchived, setWithArchived] = useState(
    initFilterOption == FilterOption.AllWithArchived ||
      initFilterOption == FilterOption.AllWithArchivedWithoutNsfw ||
      initFilterOption == FilterOption.StarredOnlyWithArchived ||
      initFilterOption == FilterOption.StarredOnlyWithArchivedWithoutNsfw ||
      initFilterOption == FilterOption.NsfwOnlyWithArchived,
  )
  const [withoutNsfw, setWithoutNsfw] = useState(
    initFilterOption == FilterOption.AllWithArchivedWithoutNsfw ||
      initFilterOption == FilterOption.AllWithoutNsfw ||
      initFilterOption == FilterOption.StarredOnlyWithArchivedWithoutNsfw ||
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
    if (withArchived) {
      if (withoutNsfw) {
        switch (selectedFilterOption) {
          case FilterOption.All:
            setSelectedFilterOption(FilterOption.AllWithArchivedWithoutNsfw)
            break
          case FilterOption.AllWithArchived:
            setSelectedFilterOption(FilterOption.AllWithArchivedWithoutNsfw)
            break
          case FilterOption.AllWithoutNsfw:
            setSelectedFilterOption(FilterOption.AllWithArchivedWithoutNsfw)
            break
          case FilterOption.StarredOnly:
            setSelectedFilterOption(
              FilterOption.StarredOnlyWithArchivedWithoutNsfw,
            )
            break
          case FilterOption.StarredOnlyWithArchived:
            setSelectedFilterOption(
              FilterOption.StarredOnlyWithArchivedWithoutNsfw,
            )
            break
          case FilterOption.StarredOnlyWithoutNsfw:
            setSelectedFilterOption(
              FilterOption.StarredOnlyWithArchivedWithoutNsfw,
            )
            break
          case FilterOption.ArchivedOnly:
            setSelectedFilterOption(FilterOption.ArchivedOnlyWithoutNsfw)
            break
          case FilterOption.NsfwOnlyWithArchived:
            setSelectedFilterOption(FilterOption.NsfwOnly)
            break
          case FilterOption.NsfwOnly:
            setSelectedFilterOption(FilterOption.NsfwOnlyWithArchived)
            break
        }
      } else {
        switch (selectedFilterOption) {
          case FilterOption.All:
            setSelectedFilterOption(FilterOption.AllWithArchived)
            break
          case FilterOption.AllWithoutNsfw:
            setSelectedFilterOption(FilterOption.AllWithArchivedWithoutNsfw)
            break
          case FilterOption.AllWithArchivedWithoutNsfw:
            setSelectedFilterOption(FilterOption.AllWithArchived)
            break
          case FilterOption.StarredOnly:
            setSelectedFilterOption(FilterOption.StarredOnlyWithArchived)
            break
          case FilterOption.StarredOnlyWithoutNsfw:
            setSelectedFilterOption(
              FilterOption.StarredOnlyWithArchivedWithoutNsfw,
            )
            break
          case FilterOption.StarredOnlyWithArchivedWithoutNsfw:
            setSelectedFilterOption(FilterOption.StarredOnlyWithArchived)
            break
          case FilterOption.NsfwOnly:
            setSelectedFilterOption(FilterOption.NsfwOnlyWithArchived)
            break
          case FilterOption.ArchivedOnlyWithoutNsfw:
            setSelectedFilterOption(FilterOption.ArchivedOnly)
            break
        }
      }
    } else {
      if (withoutNsfw) {
        switch (selectedFilterOption) {
          case FilterOption.All:
            setSelectedFilterOption(FilterOption.AllWithoutNsfw)
            break
          case FilterOption.AllWithArchivedWithoutNsfw:
            setSelectedFilterOption(FilterOption.AllWithoutNsfw)
            break
          case FilterOption.StarredOnlyWithArchivedWithoutNsfw:
            setSelectedFilterOption(FilterOption.StarredOnlyWithoutNsfw)
            break
          case FilterOption.StarredOnly:
            setSelectedFilterOption(FilterOption.StarredOnlyWithoutNsfw)
            break
          case FilterOption.ArchivedOnly:
            setSelectedFilterOption(FilterOption.ArchivedOnlyWithoutNsfw)
            break
          case FilterOption.NsfwOnlyWithArchived:
            setSelectedFilterOption(FilterOption.NsfwOnly)
            break
        }
      } else {
        switch (selectedFilterOption) {
          case FilterOption.AllWithArchived:
            setSelectedFilterOption(FilterOption.All)
            break
          case FilterOption.AllWithArchivedWithoutNsfw:
            setSelectedFilterOption(FilterOption.All)
            break
          case FilterOption.AllWithoutNsfw:
            setSelectedFilterOption(FilterOption.All)
            break
          case FilterOption.StarredOnlyWithArchived:
            setSelectedFilterOption(FilterOption.StarredOnly)
            break
          case FilterOption.StarredOnlyWithArchivedWithoutNsfw:
            setSelectedFilterOption(FilterOption.StarredOnly)
            break
          case FilterOption.StarredOnlyWithoutNsfw:
            setSelectedFilterOption(FilterOption.StarredOnly)
            break
          case FilterOption.NsfwOnlyWithArchived:
            setSelectedFilterOption(FilterOption.NsfwOnly)
            break
          case FilterOption.ArchivedOnlyWithoutNsfw:
            setSelectedFilterOption(FilterOption.ArchivedOnly)
            break
          case FilterOption.ArchivedOnly:
            setSelectedFilterOption(FilterOption.ArchivedOnlyWithoutNsfw)
            break
        }
      }
    }
  }, [withArchived, withoutNsfw])

  return {
    selectedFilterOption,
    setSelectedFilterOption,
    withArchived,
    setWithArchived,
    withoutNsfw,
    setWithoutNsfw,
  }
}
