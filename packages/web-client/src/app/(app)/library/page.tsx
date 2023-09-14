'use client'

import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'
import { MonthsSkeleton } from '@web-ui/components/app/atoms/months-skeleton'
import { Library } from '@web-ui/components/app/templates/library'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLibrarySelector } from './_hooks/store'
import { useBookmarks } from './_hooks/use-bookmarks'
import { useMonths } from './_hooks/use-months'
import { use_tag_view_options } from '@/hooks/library/use-tag-view-options'
import { use_date_view_options } from '@/hooks/library/use-date-view-options'
import { use_order_view_options } from '@/hooks/library/use-order-view-options'
import { use_sortby_view_options } from '@/hooks/library/use-sortby-view-options'
import useToggle from 'beautiful-react-hooks/useToggle'
import { use_filter_view_options } from '@/hooks/library/use-filter-view-options'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

const Months = dynamic(() => import('./dynamic-months'), {
  ssr: false,
  loading: () => <MonthsSkeleton />,
})

const Page: React.FC = () => {
  const queryParams = use_shallow_search_params()
  const router = useRouter()
  const params = useParams()
  const [showMonths, setShowMonths] = useState(false)
  const [showTags, setShowTags] = useState(false)
  const [showTagsSkeleton, setShowTagsSkeleton] = useState(true)
  const {
    bookmarks,
    is_getting_first_bookmarks,
    is_getting_more_bookmarks,
    has_more_bookmarks,
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
    current_filter,
    set_filter_query_param,
    exclude_nsfw,
    include_nsfw,
    is_nsfw_excluded,
  } = use_filter_view_options()
  const { current_order, setOrderQueryParam } = use_order_view_options()
  const { current_sortby, set_sortby_query_param } = use_sortby_view_options()
  const { add_tag_to_query_params, remove_tag_from_query_params, actual_selected_tags  } =
    use_tag_view_options()
  const { setGteLteQueryParams, clearGteLteQueryParams } = use_date_view_options()
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
