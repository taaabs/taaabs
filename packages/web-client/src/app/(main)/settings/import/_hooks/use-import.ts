import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { ImportExport_DataSourceImpl } from '@repositories/modules/import-export/infrastructure/data-sources/import-export.data-source-impl'
import { ImportExport_RepositoryImpl } from '@repositories/modules/import-export/infrastructure/repositories/import-export.repository-impl'
import { SendImportData_Params } from '@repositories/modules/import-export/domain/types/send-import-data.params'
import { AuthContext } from '@/providers/AuthProvider'
import { system_values } from '@shared/constants/system-values'
import {
  ParsedXmlTreeNode,
  parse_netscape_xml,
} from '@/utils/parse-netscape-xml'
import { construct_tag_hierarchies_from_paths } from '@/utils/construct-tag-hierarchies-from-paths'

type ParsedXmlBookmark = {
  title?: string
  created_at?: Date
  url?: string
  tags?: string[]
  path: string
  is_starred?: boolean
  favicon?: string
}

export const use_import = () => {
  const auth_context = useContext(AuthContext)
  const [file_text, set_file_text] = useState<string>()
  // Data coming from official export
  const [import_data, set_import_data] = useState<SendImportData_Params>()
  // Processed third party file
  const [parsed_xml, set_parsed_xml] = useState<ParsedXmlBookmark[]>()
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
      // JSON is invalid, do nothing
    }

    try {
      const json = parse_netscape_xml(file_text)
      const parsed_bookmarks: ParsedXmlBookmark[] = []
      const flatten_tree = (params: {
        node: ParsedXmlTreeNode
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
            title: params.node.title?.substring(
              0,
              system_values.bookmark.title.max_length,
            ),
            url: params.node.url,
            created_at: params.node.created_at_timestamp
              ? new Date(params.node.created_at_timestamp * 1000)
              : undefined,
            is_starred: params.node.is_starred,
            tags: params.node.tags,
            path: params.path,
            favicon: params.node.favicon,
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
      // Do nothing
    }
  }, [file_text])

  const submit = async () => {
    let params: SendImportData_Params | undefined = import_data

    if (!params && parsed_xml) {
      const tag_hierarchies = construct_tag_hierarchies_from_paths(
        parsed_xml.map((bookmark) => bookmark.path),
      )

      const bookmarks: SendImportData_Params['bookmarks'] = []

      for (const bookmark of parsed_xml) {
        const tags = [
          ...bookmark.path
            .split('/')
            .filter((segment) => !!segment.length) // Root bookmarks have '/' path
            .map((name) => ({
              name,
            })),
          ...(bookmark.tags
            ? bookmark.tags.map((name) => ({
                name,
              }))
            : []),
        ]
        bookmarks.push({
          title: bookmark.title,
          note: '',
          is_archived: false,
          is_unsorted: false,
          stars: bookmark.is_starred ? 1 : undefined,
          created_at: bookmark.created_at
            ? bookmark.created_at.toISOString()
            : undefined,
          links: bookmark.url
            ? [
                {
                  url: bookmark.url,
                  site_path: '',
                  favicon: bookmark.favicon
                    ? (await _convert_image_to_webp(bookmark.favicon)).replace(
                        'data:image/webp;base64,',
                        '',
                      )
                    : undefined,
                },
              ]
            : [],
          tags: tags.length ? tags : [],
        })
      }

      params = {
        bookmarks,
        tag_hierarchies,
      }
    } else if (!auth_context.auth_data!.username) {
      toast.error('Account is needed for JSON file')
      return
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
    // Clear any cached library data
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

export const _convert_image_to_webp = async (url: string): Promise<string> => {
  const img = document.createElement('img')
  img.src = url

  await new Promise((resolve) => {
    img.onload = resolve
  })

  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height

  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)

  return canvas.toDataURL('image/webp')
}
