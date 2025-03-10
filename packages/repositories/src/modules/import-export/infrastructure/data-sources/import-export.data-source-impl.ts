import { SendImportData_Params } from '../../domain/types/send-import-data.params'
import { ImportExport_DataSource } from './import-export.data-source'
import { get_domain_from_url } from '@shared/utils/get-domain-from-url'
import { SendImportData_Dto } from '@shared/types/modules/import-export/send-import-data.dto'
import { ListBackups_Dto } from '@shared/types/modules/import-export/list-backups.dto'
import { DownloadBackup_Dto } from '@shared/types/modules/import-export/download-backup.dto'
import { DownloadBackup_Params } from '../../domain/types/download-backup.params'
import { system_values } from '@shared/constants/system-values'
import { AES } from '@repositories/utils/aes'
import { SHA256 } from '@repositories/utils/sha256'
import { KyInstance } from 'ky'
import { RequestNewBackup_Params } from '../../domain/types/request-new-backup.params'
import { RequestNewBackup_Dto } from '@shared/types/modules/import-export/request-new-backup.dto'

export class ImportExport_DataSourceImpl implements ImportExport_DataSource {
  constructor(private readonly _ky: KyInstance) {}

  public async send_import_data(
    params: SendImportData_Params,
    encryption_key: Uint8Array,
  ): Promise<void> {
    const created_at_fallback = new Date()

    const bookmarks: SendImportData_Dto.Body['bookmarks'] = []

    for (const bookmark of params.bookmarks) {
      const title: string | undefined =
        bookmark.title && bookmark.title.trim()
          ? bookmark.title
              .trim()
              .substring(0, system_values.bookmark.title.max_length)
          : undefined

      const note: string | undefined =
        bookmark.note && bookmark.note.trim()
          ? bookmark.note
              .trim()
              .substring(0, system_values.bookmark.note.max_length)
          : undefined

      const tags: SendImportData_Dto.Body['bookmarks'][0]['tags'] = []

      for (const tag of bookmark.tags.slice(
        0,
        system_values.bookmark.tags.limit,
      )) {
        if (tag.is_public) {
          tags.push({
            is_public: true,
            hash: await SHA256(tag.name.trim(), encryption_key),
            name: tag.name,
          })
        } else {
          tags.push({
            is_public: false,
            hash: await SHA256(tag.name.trim(), encryption_key),
            name_aes: await AES.encrypt(tag.name.trim(), encryption_key),
          })
        }
      }

      const links: SendImportData_Dto.Body['bookmarks'][0]['links'] = []

      for (const link of bookmark.links.slice(
        0,
        system_values.bookmark.links.limit,
      )) {
        if (link.is_public) {
          links.push({
            is_public: true,
            url: link.url.trim(),
            hash: await SHA256(link.url.trim(), encryption_key),
            site_path: link.site_path,
            open_snapshot: link.open_snapshot,
            is_pinned: link.is_pinned,
            pin_order: link.pin_order,
          })
        } else {
          const domain = get_domain_from_url(link.url)
          links.push({
            is_public: false,
            hash: await SHA256(link.url.trim(), encryption_key),
            url_aes: await AES.encrypt(link.url.trim(), encryption_key),
            site_aes: await AES.encrypt(
              link.site_path ? `${domain}/${link.site_path}` : domain,
              encryption_key,
            ),
            open_snapshot: link.open_snapshot,
            is_pinned: link.is_pinned,
            pin_order: link.pin_order,
          })
        }
      }

      bookmarks.push({
        id: bookmark.id,
        title: bookmark.is_public ? title : undefined,
        title_aes:
          !bookmark.is_public && title
            ? await AES.encrypt(title, encryption_key)
            : undefined,
        note: bookmark.is_public ? note : undefined,
        note_aes:
          !bookmark.is_public && note
            ? await AES.encrypt(note, encryption_key)
            : undefined,
        created_at: bookmark.created_at || created_at_fallback.toISOString(),
        is_public: bookmark.is_public || undefined,
        is_archived: bookmark.is_archived || undefined,
        is_unsorted: bookmark.is_unsorted, // It's important to send 'false' if is there, meaning bookmark is sorted
        stars: bookmark.stars || undefined,
        tags,
        links,
      })
    }

    const parse_tag_hierarchy_node = async (
      node: SendImportData_Params['tag_hierarchies'][0],
    ): Promise<SendImportData_Dto.Body['tag_hierarchies'][0]> => {
      return {
        hash: await SHA256(node.name, encryption_key),
        children: await Promise.all(
          node.children.map(
            async (node) => await parse_tag_hierarchy_node(node),
          ),
        ),
      }
    }

    const body: SendImportData_Dto.Body = {
      bookmarks,
      tag_hierarchies: await Promise.all(
        params.tag_hierarchies.map(
          async (node) => await parse_tag_hierarchy_node(node),
        ),
      ),

      erase_library: params.erase_library || undefined,
    }

    await this._ky.post(`v1/import-export/send-import-data`, {
      json: body,
      timeout: false,
    })
  }

  public async list_backups(): Promise<ListBackups_Dto.Response> {
    return this._ky.get(`v1/import-export/list-backups`).json()
  }

  public async download_backup(
    params: DownloadBackup_Params,
  ): Promise<DownloadBackup_Dto.Response> {
    return this._ky.get(`v1/import-export/download-backup/${params.id}`).json()
  }

  public async request_new_backup(
    params: RequestNewBackup_Params,
  ): Promise<void> {
    const body: RequestNewBackup_Dto.Body = {
      name: params.name,
    }
    await this._ky.post(`v1/import-export/request-new-backup`, {
      json: body,
    })
  }
}
