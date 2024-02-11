import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useState } from 'react'
import { bookmarksToJSON } from 'bookmarks-to-json'
import { Import_DataSourceImpl } from '@repositories/modules/import/infrastructure/data-sources/import.data-source-impl'
import { Import_RepositoryImpl } from '@repositories/modules/import/infrastructure/repositories/import.repository-impl'
import { NewImport_UseCase } from '@repositories/modules/import/domain/usecases/new-import.use-case'
import { NewImport_Params } from '@repositories/modules/import/domain/types/new-import.params'
import { toast } from 'react-toastify'

type BookmarkNode = {
  type: 'link'
  title: string
  addDate: number
  url: string
}
type FolderNode = {
  type: 'folder'
  title: string
  children?: Array<FolderNode | BookmarkNode>
}
type BookmarksTree = Array<BookmarkNode | FolderNode>

type ParsedBookmark = {
  title: string
  created_at: Date
  url: string
  path: string
}

export const use_import = () => {
  const [netscape_document, set_netscape_document] = useState<string>()
  const [parsed_bookmarks, set_parsed_bookmarks] = useState<ParsedBookmark[]>()
  const [import_as_public, set_import_as_public] = useState<boolean>(false)
  const [is_sending, set_is_sending] = useState<boolean>(false)

  useUpdateEffect(() => {
    if (!netscape_document || is_sending) return

    set_netscape_document(undefined)
    set_parsed_bookmarks(undefined)
    set_import_as_public(false)

    try {
      const json = JSON.parse(
        bookmarksToJSON(netscape_document),
      ) as BookmarksTree
      const parsed_bookmarks: ParsedBookmark[] = []
      const flatten_tree = (params: {
        node: BookmarkNode | FolderNode
        path: string
      }) => {
        if (params.node.type == 'folder') {
          if (!params.node.children) return
          params.node.children.forEach((child) =>
            flatten_tree({
              node: child,
              path: `${params.path}/${params.node.title}`,
            }),
          )
        } else if (params.node.type == 'link') {
          parsed_bookmarks.push({
            title: params.node.title,
            url: params.node.url,
            created_at: new Date(params.node.addDate * 1000),
            path: params.path,
          })
        }
      }
      json.forEach((item) => flatten_tree({ node: item, path: '' }))
      if (parsed_bookmarks.length) {
        set_parsed_bookmarks(parsed_bookmarks)
      } else {
        throw new Error()
      }
    } catch {
      toast.error('Selected file is invalid')
      // Do nothing.
    }
  }, [netscape_document])

  const submit = async () => {
    if (parsed_bookmarks === undefined) return

    const params: NewImport_Params = {
      bookmarks: parsed_bookmarks.map((bookmark) => ({
        title: bookmark.title,
        created_at: bookmark.created_at.toISOString(),
        is_public: import_as_public,
        links: [{ url: bookmark.url, is_public: import_as_public }],
        tags: bookmark.path
          .split('/')
          .filter((tag) => {
            // Remove empty strings.
            return tag
          })
          .map((tag) => ({
            name: tag,
            is_public: import_as_public,
          })),
      })),
      tree: [],
    }

    const data_source = new Import_DataSourceImpl(
      process.env.NEXT_PUBLIC_API_URL,
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
    )
    const repository = new Import_RepositoryImpl(data_source)
    const new_import_use_case = new NewImport_UseCase(repository)
    set_is_sending(true)
    try {
      await new_import_use_case.invoke(params)
      toast.success('Your import file is processed...')
    } catch {
      toast.error('Something went wrong, try again later')
    }
    set_is_sending(false)
    set_netscape_document(undefined)
    set_import_as_public(false)
    set_parsed_bookmarks(undefined)
  }

  return {
    netscape_document,
    set_netscape_document,
    parsed_bookmarks,
    submit,
    import_as_public,
    set_import_as_public,
    is_sending,
  }
}
