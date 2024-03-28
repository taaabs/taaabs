import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useState } from 'react'
import { bookmarksToJSON } from 'bookmarks-to-json'
import { toast } from 'react-toastify'
import { ImportExport_DataSourceImpl } from '@repositories/modules/import-export/infrastructure/data-sources/import-export.data-source-impl'
import { ImportExport_RepositoryImpl } from '@repositories/modules/import-export/infrastructure/repositories/import-export.repository-impl'
import { SendImportData_UseCase } from '@repositories/modules/import-export/domain/usecases/send-import-data.use-case'
import { SendImportData_Params } from '@repositories/modules/import-export/domain/types/send-import-data.params'
import ky from 'ky'

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
type ParsedXMLBookmark = {
  title: string
  created_at: Date
  url: string
  path: string
}

export const use_import = () => {
  const [file_text, set_file_text] = useState<string>()
  // Data coming from official export.
  const [import_data, set_import_data] = useState<SendImportData_Params>()
  // Processed third party file.
  const [parsed_xml, set_parsed_xml] = useState<ParsedXMLBookmark[]>()
  const [import_as_public, set_import_as_public] = useState<boolean>()
  const [is_sending, set_is_sending] = useState<boolean>()
  const [erase_library, set_erase_library] = useState<boolean>()

  useUpdateEffect(() => {
    if (!file_text || is_sending) return

    set_file_text(undefined)
    set_parsed_xml(undefined)
    set_import_as_public(false)
    set_import_data(undefined)

    try {
      set_import_data(JSON.parse(file_text))
      return
    } catch {
      // JSON is invalid, do nothing.
    }

    try {
      const json = JSON.parse(bookmarksToJSON(file_text)) as BookmarksTree
      const parsed_bookmarks: ParsedXMLBookmark[] = []
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
      params = {
        bookmarks: parsed_xml.map((bookmark) => ({
          title: bookmark.title,
          note: '',
          is_archived: false,
          is_unread: false,
          stars: 0,
          created_at: bookmark.created_at.toISOString(),
          is_public: import_as_public,
          links: [
            { url: bookmark.url, site_path: '', is_public: import_as_public },
          ],
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
        tag_hierarchies: [],
      }
    }

    if (!params) return

    const ky_instance = ky.create({
      prefixUrl: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhQmNEZSIsImlhdCI6MTcxMDM1MjExNn0.ZtpENZ0tMnJuGiOM-ttrTs5pezRH-JX4_vqWDKYDPWY`,
        'Content-Type': 'application/json',
      },
    })

    const data_source = new ImportExport_DataSourceImpl(ky_instance)
    const repository = new ImportExport_RepositoryImpl(data_source)
    const send_import_data_use_case = new SendImportData_UseCase(repository)
    set_is_sending(true)
    try {
      await send_import_data_use_case.invoke({
        ...params,
        erase_library,
      })
      toast.success('Import file has been sent for processing')
    } catch {
      toast.error('Something went wrong, try again later')
    }
    set_is_sending(false)
    set_file_text(undefined)
    set_import_as_public(false)
    set_parsed_xml(undefined)
    set_import_data(undefined)
  }

  return {
    import_data,
    file_text,
    set_file_text,
    parsed_xml,
    submit,
    import_as_public,
    set_import_as_public,
    is_sending,
    erase_library,
    set_erase_library,
  }
}
