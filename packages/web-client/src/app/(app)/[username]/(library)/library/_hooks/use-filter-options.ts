import { updateQueryParam } from '@/utils/update-query-param'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export enum FilterOption {
  'all',
  'all-with-archived',
  'all-with-archived-without-nsfw',
  'all-without-nsfw',
  'starred-only',
  'starred-only-with-archived',
  'starred-only-with-archived-without-nsfw',
  'starred-only-without-nsfw',
  'nsfw-only',
  'nsfw-only-with-archived',
  'archived-only',
  'archived-only-without-nsfw',
}

export const useFilterOptions = (initFilterOption: FilterOption) => {
  const queryParams = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const [withArchived, setWithArchived] = useState(
    initFilterOption == FilterOption['all-with-archived'] ||
      initFilterOption == FilterOption['all-with-archived-without-nsfw'] ||
      initFilterOption == FilterOption['starred-only-with-archived'] ||
      initFilterOption ==
        FilterOption['starred-only-with-archived-without-nsfw'] ||
      initFilterOption == FilterOption['nsfw-only-with-archived'],
  )
  const [withoutNsfw, setWithoutNsfw] = useState(
    initFilterOption == FilterOption['all-with-archived-without-nsfw'] ||
      initFilterOption == FilterOption['all-without-nsfw'] ||
      initFilterOption ==
        FilterOption['starred-only-with-archived-without-nsfw'] ||
      initFilterOption == FilterOption['starred-only-without-nsfw'] ||
      initFilterOption == FilterOption['archived-only-without-nsfw'],
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
          case FilterOption.all:
            setSelectedFilterOption(
              FilterOption['all-with-archived-without-nsfw'],
            )
            break
          case FilterOption['all-with-archived']:
            setSelectedFilterOption(
              FilterOption['all-with-archived-without-nsfw'],
            )
            break
          case FilterOption['all-without-nsfw']:
            setSelectedFilterOption(
              FilterOption['all-with-archived-without-nsfw'],
            )
            break
          case FilterOption['starred-only']:
            setSelectedFilterOption(
              FilterOption['starred-only-with-archived-without-nsfw'],
            )
            break
          case FilterOption['starred-only-with-archived']:
            setSelectedFilterOption(
              FilterOption['starred-only-with-archived-without-nsfw'],
            )
            break
          case FilterOption['starred-only-without-nsfw']:
            setSelectedFilterOption(
              FilterOption['starred-only-with-archived-without-nsfw'],
            )
            break
          case FilterOption['archived-only']:
            setSelectedFilterOption(FilterOption['archived-only-without-nsfw'])
            break
          case FilterOption['nsfw-only-with-archived']:
            setSelectedFilterOption(FilterOption['nsfw-only'])
            break
          case FilterOption['nsfw-only']:
            setSelectedFilterOption(FilterOption['nsfw-only-with-archived'])
            break
        }
      } else {
        switch (selectedFilterOption) {
          case FilterOption.all:
            setSelectedFilterOption(FilterOption['all-with-archived'])
            break
          case FilterOption['all-without-nsfw']:
            setSelectedFilterOption(
              FilterOption['all-with-archived-without-nsfw'],
            )
            break
          case FilterOption['all-with-archived-without-nsfw']:
            setSelectedFilterOption(FilterOption['all-with-archived'])
            break
          case FilterOption['starred-only']:
            setSelectedFilterOption(FilterOption['starred-only-with-archived'])
            break
          case FilterOption['starred-only-without-nsfw']:
            setSelectedFilterOption(
              FilterOption['starred-only-with-archived-without-nsfw'],
            )
            break
          case FilterOption['starred-only-with-archived-without-nsfw']:
            setSelectedFilterOption(FilterOption['starred-only-with-archived'])
            break
          case FilterOption['nsfw-only']:
            setSelectedFilterOption(FilterOption['nsfw-only-with-archived'])
            break
          case FilterOption['archived-only-without-nsfw']:
            setSelectedFilterOption(FilterOption['archived-only'])
            break
        }
      }
    } else {
      if (withoutNsfw) {
        switch (selectedFilterOption) {
          case FilterOption['all']:
            setSelectedFilterOption(FilterOption['all-without-nsfw'])
            break
          case FilterOption['all-with-archived-without-nsfw']:
            setSelectedFilterOption(FilterOption['all-without-nsfw'])
            break
          case FilterOption['starred-only-with-archived-without-nsfw']:
            setSelectedFilterOption(FilterOption['starred-only-without-nsfw'])
            break
          case FilterOption['starred-only']:
            setSelectedFilterOption(FilterOption['starred-only-without-nsfw'])
            break
          case FilterOption['archived-only']:
            setSelectedFilterOption(FilterOption['archived-only-without-nsfw'])
            break
          case FilterOption['nsfw-only-with-archived']:
            setSelectedFilterOption(FilterOption['nsfw-only'])
            break
        }
      } else {
        switch (selectedFilterOption) {
          case FilterOption['all-with-archived']:
            setSelectedFilterOption(FilterOption['all'])
            break
          case FilterOption['all-with-archived-without-nsfw']:
            setSelectedFilterOption(FilterOption['all'])
            break
          case FilterOption['all-without-nsfw']:
            setSelectedFilterOption(FilterOption['all'])
            break
          case FilterOption['starred-only-with-archived']:
            setSelectedFilterOption(FilterOption['starred-only'])
            break
          case FilterOption['starred-only-with-archived-without-nsfw']:
            setSelectedFilterOption(FilterOption['starred-only'])
            break
          case FilterOption['starred-only-without-nsfw']:
            setSelectedFilterOption(FilterOption['starred-only'])
            break
          case FilterOption['nsfw-only-with-archived']:
            setSelectedFilterOption(FilterOption['nsfw-only'])
            break
          case FilterOption['archived-only-without-nsfw']:
            setSelectedFilterOption(FilterOption['archived-only'])
            break
          case FilterOption['archived-only']:
            setSelectedFilterOption(FilterOption['archived-only-without-nsfw'])
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
