'use client'
import { useOtherUserDispatch, useOtherUserSelector } from '@/hooks/redux'
import { libraryActions } from '@repositories/stores/other-user/features/library/library.slice'
import { NavigationForLibrarySidebar } from '@web-ui/components/app/atoms/navigation-for-library-sidebar'
import { Bookmark } from '@web-ui/components/app/molecules/bookmark'
import { Library } from '@web-ui/components/app/templates/library'
import { useSearchParams, useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

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

  const bookmarksList =
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

  useEffect(() => {
    let tags: string[] = []
    const queryTags = queryParams.get('tags')
    if (queryTags) {
      tags = queryTags.split(',')
    }
    dispatch(
      libraryActions.fetchBookmarks(
        { username: params.username, tags },
        apiUrl,
      ),
    )
  }, [queryParams])

  useEffect(() => {
    setIsHydrated(true)
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
      {isHydrated && !isFetchingBookmarks ? bookmarksList : <div>skeleton</div>}
    </Library>
  )
}

export default Page
