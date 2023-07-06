'use client'

import { NavigationForLibrarySidebar } from '@web-ui/components/app/atoms/navigation-for-library-sidebar'
import { Bookmark } from '@web-ui/components/app/molecules/bookmark'
import { Library } from '@web-ui/components/app/templates/library'
import { useSearchParams, useRouter, useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useIsHydrated } from '@shared/hooks'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { BookmarksParams } from '@repositories/modules/bookmarks/domain/types/bookmarks.params'
import { bookmarksActions } from '@repositories/stores/other-user/library/bookmarks/bookmarks.slice'
import { useLibraryDispatch, useLibrarySelector } from './hooks'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

const Page: React.FC = () => {
  const queryParams = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const isHydrated = useIsHydrated()
  const dispatch = useLibraryDispatch()
  const {
    bookmarks,
    isGettingFirstBookmarks: isFetchingFirstBookmarks,
    isGettingMoreBookmarks: isFetchingMoreBookmarks,
    hasMoreBookmarks,
  } = useLibrarySelector((state) => state.bookmarks)

  const getBookmarks = ({ getNextPage }: { getNextPage?: boolean }) => {
    const fetchBookmarksParams: BookmarksParams.Public = {
      username: params.username,
    }

    const queryTags = queryParams.get('t')
    if (queryTags) {
      fetchBookmarksParams.tags = queryTags.split(',')
    }

    const queryCategoryId = queryParams.get('c')
    if (queryCategoryId) {
      fetchBookmarksParams.categoryId = queryCategoryId
    }

    if (getNextPage) {
      if (!bookmarks) throw 'Bookmarks should be there.'
      fetchBookmarksParams.after = bookmarks.slice(-1)[0].id
    }

    dispatch(
      bookmarksActions.getBookmarks({
        params: fetchBookmarksParams,
        apiUrl,
      }),
    )
  }

  useUpdateEffect(() => {
    getBookmarks({})
  }, [queryParams])

  useUpdateEffect(() => {
    sessionStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    sessionStorage.setItem('hasMoreBookmarks', JSON.stringify(hasMoreBookmarks))
  }, [bookmarks])

  useEffect(() => {
    const bookmarks = sessionStorage.getItem('bookmarks')
    if (bookmarks) {
      dispatch(bookmarksActions.setBookmarks(JSON.parse(bookmarks)))
      const hasMoreBookmarks = sessionStorage.getItem('hasMoreBookmarks')
      if (hasMoreBookmarks) {
        dispatch(
          bookmarksActions.setHasMoreBookmarks(hasMoreBookmarks == 'true'),
        )
      }
    } else {
      getBookmarks({})
    }
    return () => {
      sessionStorage.removeItem('bookmarks')
      sessionStorage.removeItem('hasMoreBookmarks')
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
      isGettingFirstBookmarks={isFetchingFirstBookmarks}
      isGettingMoreBookmarks={isFetchingMoreBookmarks}
      hasMoreBookmarks={hasMoreBookmarks || false}
      getMoreBookmarks={() => {
        getBookmarks({ getNextPage: true })
      }}
      bookmarks={
        bookmarks && bookmarks.length
          ? bookmarks.map((bookmark) => (
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
          : []
      }
    />
  )
}

export default Page
