'use client'

import { useOtherUserDispatch, useOtherUserSelector } from '@/hooks/redux'
import { libraryActions } from '@repositories/stores/other-user/features/library/library.slice'
import { NavigationForLibrarySidebar } from '@web-ui/components/app/atoms/navigation-for-library-sidebar'
import { Bookmark } from '@web-ui/components/app/molecules/bookmark'
import { Library } from '@web-ui/components/app/templates/library'
import { useSearchParams, useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

const Page: React.FC = () => {
  const queryParams = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const [isHydrated, setIsHydrated] = useState(false)
  const dispatch = useOtherUserDispatch()
  const { bookmarks, isFetchingBookmarks } = useOtherUserSelector(
    (state) => state.library,
  )

  const bookmarkList =
    bookmarks && bookmarks.length ? (
      bookmarks.map((bookmark) => (
        <Bookmark
          title={bookmark.title}
          site="site"
          onSiteClick={() => {}}
          onSavesClick={() => {}}
          onDateClick={() => {}}
          url={bookmark.url}
          createdAt={new Date(bookmark.createdAt)}
          saves={bookmark.saves}
          tags={bookmark.tags}
          key={bookmark.id}
        />
      ))
    ) : (
      <div>nothing to show</div>
    )

  useUpdateEffect(() => {
    // let tags: string[] = []
    // const queryTags = queryParams.get('tags')
    // if (queryTags) {
    //   tags = queryTags.split(',')
    // }
    dispatch(
      libraryActions.fetchBookmarks({ username: params.username }, apiUrl),
    )
  }, [queryParams])

  useUpdateEffect(() => {
    sessionStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  }, [bookmarks])

  useEffect(() => {
    setIsHydrated(true)
    const bookmarks = sessionStorage.getItem('bookmarks')
    if (bookmarks) {
      dispatch(libraryActions.setBookmarks(JSON.parse(bookmarks)))
    } else {
      dispatch(
        libraryActions.fetchBookmarks({ username: params.username }, apiUrl),
      )
    }
    return () => {
      sessionStorage.removeItem('bookmarks')
    }
  }, [])

  return (
    <Library
      titleBar={
        isHydrated
          ? {
              primaryText: queryParams.get('categoryId')
                ? '[category_name]'
                : 'All bookmarks',
              secondaryText: '1234',
            }
          : undefined
      }
      slotAside={<div>slot aside</div>}
      slotSidebar={
        <NavigationForLibrarySidebar
          navigationItems={[
            {
              label: 'All bookmarks',
              onClick: () => {
                router.push(`/${params.username}/library`)
              },
              isActive: queryParams.get('categoryId') ? false : true,
            },
            {
              label: 'Categories',
              onClick: () => {},
              isActive: queryParams.get('categoryId') ? true : false,
            },
          ]}
        />
      }
    >
      {isHydrated && !isFetchingBookmarks ? bookmarkList : <div>skeleton</div>}
    </Library>
  )
}

export default Page
