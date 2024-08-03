import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import useViewportSpy from 'beautiful-react-hooks/useViewportSpy'
import { useContext, useRef, useState } from 'react'
import { Bookmark as UiAppLibrary_Bookmark } from '@web-ui/components/app/library/Bookmark'
import { AuthContext } from '@/app/auth-provider'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { LibraryContext } from '../Library'

namespace _Bookmark {
  export type Props = UiAppLibrary_Bookmark.Props & {
    has_cover_aes?: boolean
  }
}

/**
 * Private bookmarks requires non-standard download of cover images involving decryption of base64 encoded data.
 * This component also preloads links data.
 */
export const _Bookmark: React.FC<_Bookmark.Props> = (props) => {
  const auth_context = useContext(AuthContext)
  const ref = useRef<HTMLDivElement>(null)
  const is_visible = useViewportSpy(ref)
  const { username } = useContext(LibraryContext)!
  const [cover, set_cover] = useState<string>()
  const is_links_data_prefetched = useRef(false)

  useUpdateEffect(() => {
    if (is_visible && !cover && props.has_cover_aes) {
      const data_source = new Bookmarks_DataSourceImpl(auth_context.ky_instance)
      const repository = new Bookmarks_RepositoryImpl(data_source)
      repository
        .get_cover(
          {
            bookmark_id: props.bookmark_id,
            bookmark_updated_at: props.updated_at,
          },
          auth_context.auth_data!.encryption_key,
        )
        .then((cover) => {
          set_cover(cover)
        })
    }
  }, [is_visible])

  useUpdateEffect(() => {
    if (
      is_visible &&
      !is_links_data_prefetched.current &&
      props.links.find((link) => link.is_parsed)
    ) {
      const data_source = new Bookmarks_DataSourceImpl(auth_context.ky_instance)
      const repository = new Bookmarks_RepositoryImpl(data_source)
      if (!username) {
        repository.get_links_data_authorized(
          {
            bookmark_id: props.bookmark_id,
            bookmark_updated_at: new Date(props.updated_at),
          },
          auth_context.auth_data!.encryption_key,
        )
      } else {
        repository.get_links_data_public({
          bookmark_id: props.bookmark_id,
          bookmark_updated_at: new Date(props.updated_at),
          username,
        })
      }
      is_links_data_prefetched.current = true
    }
  }, [is_visible])

  return (
    <div ref={ref}>
      <UiAppLibrary_Bookmark {...props} cover={cover} />
    </div>
  )
}
