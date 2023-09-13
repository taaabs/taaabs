'use client'

import { useShallowSearchParams } from '@web-ui/hooks/use-shallow-search-params'
import { MonthsSkeleton } from '@web-ui/components/app/atoms/months-skeleton'
import { Library } from '@web-ui/components/app/templates/library'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLibrarySelector } from './_hooks/store'
import { useBookmarks } from './_hooks/use-bookmarks'
import { useMonths } from './_hooks/use-months'
import { useTagViewOptions } from '@/hooks/library/use-tag-view-options'
import { useDateViewOptions } from '@/hooks/library/use-date-view-options'
import { useOrderViewOptions } from '@/hooks/library/use-order-view-options'
import { useSortByViewOptions } from '@/hooks/library/use-sort-by-view-options'
import useToggle from 'beautiful-react-hooks/useToggle'
import { useFilterViewOptions } from '@/hooks/library/use-filter-view-options'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

const Months = dynamic(() => import('./dynamic-months'), {
  ssr: false,
  loading: () => <MonthsSkeleton />,
})

const Page: React.FC = () => {
  const queryParams = useShallowSearchParams()
  const router = useRouter()
  const params = useParams()
  const [showMonths, setShowMonths] = useState(false)
  const [showTags, setShowTags] = useState(false)
  const [showTagsSkeleton, setShowTagsSkeleton] = useState(true)
  const {
    bookmarks,
    isGettingFirstBookmarks,
    isGettingMoreBookmarks,
    hasMoreBookmarks,
  } = useLibrarySelector((state) => state.bookmarks)
  const { getBookmarks } = useBookmarks()
  const {
    monthsOfBookmarkCreation,
    monthsOfUrlCreation,
    isGettingMonthsData,
    tagsOfBookmarkCreation,
    tagsOfUrlCreation,
    selectedTags,
  } = useMonths()
  const {
    currentFilter,
    setFilterQueryParam,
    excludeNsfw,
    includeNsfw,
    isNsfwExcluded,
  } = useFilterViewOptions()
  const { currentOrder, setOrderQueryParam } = useOrderViewOptions()
  const { currentSortBy, setSortByQueryParam } = useSortByViewOptions()
  const { addTagToQueryParams, removeTagFromQueryParams, actualSelectedTags } =
    useTagViewOptions()
  const { setGteLteQueryParams, clearGteLteQueryParams } = useDateViewOptions()
  const [isFilterDropdownVisible, toggleFilterDropdown] = useToggle(false)
  const [isOrderByDropdownVisible, toggleOrderByDropdown] = useToggle(false)
  const [isOrderDropdownVisible, toggleOrderDropdown] = useToggle(false)

  useUpdateEffect(() => {
    if (!showMonths) setShowMonths(true)
    if (!showTags) setShowTags(true)
    if (showTagsSkeleton) setShowTagsSkeleton(false)
  }, [bookmarks])

  useEffect(() => {
    sessionStorage.setItem('queryParams', queryParams.toString())

    return () => {
      sessionStorage.removeItem('queryParams')
    }
  }, [queryParams])

  return (
    <></>
    // <Library
    //   showBookmarksSkeleton={bookmarks == null}
    //   titleBar={
    //     bookmarks != null
    //       ? queryParams.get('categoryId')
    //         ? '[category_name]'
    //         : 'All bookmarks'
    //       : undefined
    //   }
    //   slotSidebar={<div>slot sidebar</div>}
    //   slotAside={<div>slot aside</div>}

    // />
  )
}

export default Page
