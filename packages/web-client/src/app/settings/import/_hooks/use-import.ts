import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { ImportExport_DataSourceImpl } from '@repositories/modules/import-export/infrastructure/data-sources/import-export.data-source-impl'
import { ImportExport_RepositoryImpl } from '@repositories/modules/import-export/infrastructure/repositories/import-export.repository-impl'
import { SendImportData_Params } from '@repositories/modules/import-export/domain/types/send-import-data.params'
import { AuthContext } from '@/app/auth-provider'
import { system_values } from '@shared/constants/system-values'
import { parse_netscape_xml } from '@/utils/parse-netscape-xml'
import { construct_tag_hierarchies_from_paths } from '@/utils/construct-tag-hierarchies-from-paths'
import { TagHierarchy } from '@shared/types/modules/import-export/data'
import { Crypto } from '@repositories/utils/crypto'

type BookmarkNode = {
  type: 'link'
  title: string
  created_at_timestamp: number
  url: string
  tags?: string[]
  is_starred?: boolean
}
type FolderNode = {
  type: 'folder'
  name: string
  children?: Array<FolderNode | BookmarkNode>
}
type BookmarksTree = Array<BookmarkNode | FolderNode>
type ParsedXMLBookmark = {
  title: string
  created_at: Date
  url: string
  tags?: string[]
  path: string
  is_starred?: boolean
}

export const use_import = () => {
  const auth_context = useContext(AuthContext)!
  const [file_text, set_file_text] = useState<string>()
  // Data coming from official export.
  const [import_data, set_import_data] = useState<SendImportData_Params>()
  // Processed third party file.
  const [parsed_xml, set_parsed_xml] = useState<ParsedXMLBookmark[]>()
  const [is_sending, set_is_sending] = useState<boolean>()
  const [erase_library, set_erase_library] = useState<boolean>()

  useUpdateEffect(() => {
    if (!file_text || is_sending) return

    set_file_text(undefined)
    set_parsed_xml(undefined)
    set_import_data(undefined)

    try {
      set_import_data(JSON.parse(file_text))
      return
    } catch {
      // JSON is invalid, do nothing.
    }

    try {
      const json = parse_netscape_xml(file_text) as BookmarksTree
      const parsed_bookmarks: ParsedXMLBookmark[] = []
      const flatten_tree = (params: {
        node: BookmarkNode | FolderNode
        path: string
      }) => {
        if (params.node.type == 'folder') {
          if (!params.node.children) return
          params.node.children.forEach((child) => {
            if (params.node.type != 'folder') throw new Error()
            return flatten_tree({
              node: child,
              path: `${params.path}/${params.node.name}`,
            })
          })
        } else if (params.node.type == 'link') {
          parsed_bookmarks.push({
            title: params.node.title.substring(
              0,
              system_values.bookmark.title.max_length,
            ),
            url: params.node.url,
            created_at: new Date(params.node.created_at_timestamp * 1000),
            is_starred: params.node.is_starred,
            tags: params.node.tags,
            path: params.path,
          })
        }
      }
      json.forEach((item) => flatten_tree({ node: item, path: '' }))
      if (parsed_bookmarks.length) {
        set_parsed_xml(parsed_bookmarks)
      } else {
        throw new Error()
      }
    } catch {
      toast.error('Selected file is invalid')
      // Do nothing.
    }
  }, [file_text])

  const submit = async () => {
    let params: SendImportData_Params | undefined = import_data

    if (!params && parsed_xml) {
      const tag_hierarchies = construct_tag_hierarchies_from_paths(
        parsed_xml.map((bookmark) => bookmark.path),
      )
      type TagHierarchy_Entity = {
        name: string
        children: TagHierarchy_Entity[]
      }
      const parse_tag_hierarchy_node = async (
        node: TagHierarchy_Entity,
      ): Promise<TagHierarchy.TagHierarchyNode> => {
        return {
          hash: await Crypto.SHA256(
            node.name,
            auth_context.auth_data!.encryption_key,
          ),
          children: await Promise.all(
            node.children.map(
              async (node) => await parse_tag_hierarchy_node(node),
            ),
          ),
        }
      }
      params = {
        bookmarks: parsed_xml.map((bookmark) => ({
          title: bookmark.title,
          note: '',
          is_archived: false,
          is_unread: false,
          stars: bookmark.is_starred ? 1 : undefined,
          created_at: bookmark.created_at.toISOString(),
          links: [
            {
              url: bookmark.url,
              site_path: '',
            },
          ],
          tags: [
            ...bookmark.path
              .split('/')
              .filter((segment) => !!segment.length) // Root bookmarks have '/' path.
              .map((name) => ({
                name,
              })),
            ...(bookmark.tags
              ? bookmark.tags.map((name) => ({
                  name,
                }))
              : []),
          ],
        })),
        tag_hierarchies: await Promise.all(
          tag_hierarchies.map(
            async (node) => await parse_tag_hierarchy_node(node),
          ),
        ),
      }
    }

    if (!params) return

    const data_source = new ImportExport_DataSourceImpl(
      auth_context.ky_instance,
    )
    const repository = new ImportExport_RepositoryImpl(data_source)
    set_is_sending(true)
    try {
      await repository.send_import_data(
        {
          ...params,
          erase_library,
        },
        auth_context.auth_data!.encryption_key,
      )
      toast.success('Import file has been sent for processing')
    } catch {
      toast.error('Something went wrong, try again later')
    }
    set_is_sending(false)
    set_file_text(undefined)
    set_parsed_xml(undefined)
    set_import_data(undefined)
    // Clear any cached library data.
    for (const key in sessionStorage) {
      sessionStorage.removeItem(key)
    }
  }

  return {
    import_data,
    file_text,
    set_file_text,
    parsed_xml,
    submit,
    is_sending,
    erase_library,
    set_erase_library,
  }
}
