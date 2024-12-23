import { get_domain_from_url } from '@shared/utils/get-domain-from-url'
import { ImportExport_Repository } from '../../domain/repositories/import-export.repository'
import { DownloadBackup_Params } from '../../domain/types/download-backup.params'
import { ListBackups_Ro } from '../../domain/types/list-backups.ro'
import { SendImportData_Params } from '../../domain/types/send-import-data.params'
import { ImportExport_DataSource } from '../data-sources/import-export.data-source'
import { AES } from '@repositories/utils/aes'
import { Backup_Ro } from '../../domain/types/backup.ro'
import pako from 'pako'
import { RequestNewBackup_Params } from '../../domain/types/request-new-backup.params'
import { ExportData } from '@shared/types/modules/import-export/export-data'

export class ImportExport_RepositoryImpl implements ImportExport_Repository {
  constructor(private readonly _import_data_source: ImportExport_DataSource) {}

  public async send_import_data(
    params: SendImportData_Params,
    encryption_key: Uint8Array,
  ): Promise<void> {
    return this._import_data_source.send_import_data(params, encryption_key)
  }

  public async list_backups(): Promise<ListBackups_Ro> {
    const backups = await this._import_data_source.list_backups()
    return backups.map((backup) => ({
      id: backup.id,
      created_at: backup.created_at,
      name: backup.name,
    }))
  }

  public async download_backup(
    params: DownloadBackup_Params,
    encryption_key: Uint8Array,
  ): Promise<Backup_Ro> {
    const data = await this._import_data_source.download_backup(params)

    const parse_tag_hierarchy_node = async (
      node: ExportData['tag_hierarchies'][0],
    ): Promise<Backup_Ro['tag_hierarchies'][0]> => {
      const children = []
      for (const child of node.children) {
        children.push(await parse_tag_hierarchy_node(child))
      }
      return {
        name: node.name
          ? node.name
          : await AES.decrypt(node.name_aes!, encryption_key),
        children,
      }
    }

    const bookmarks: Backup_Ro['bookmarks'] = []
    for (const bookmark of data.bookmarks) {
      const tags: Backup_Ro['bookmarks'][0]['tags'] = []
      for (const tag of bookmark.tags) {
        if (tag.name) {
          tags.push({
            name: tag.name,
            is_public: true,
          })
        } else if (tag.name_aes) {
          tags.push({
            name: await AES.decrypt(tag.name_aes, encryption_key),
            is_public: false,
          })
        } else {
          throw new Error('Tag name or name_aes should be there.')
        }
      }

      const links: Backup_Ro['bookmarks'][0]['links'] = []
      for (const link of bookmark.links) {
        if (link.url) {
          links.push({
            is_public: true,
            url: link.url,
            site_path: link.site_path || undefined,
            pin_title: link.pin_title || undefined,
            open_snapshot: link.open_snapshot || undefined,
            is_pinned: link.is_pinned || undefined,
            pin_order: link.pin_order || undefined,
            reader_data: link.reader_data || undefined,
          })
        } else if (link.url_aes && link.site_aes) {
          const site = await AES.decrypt(link.site_aes, encryption_key)
          const domain = `${get_domain_from_url(site)}/`
          const site_path = site.slice(domain.length)
          links.push({
            url: await AES.decrypt(link.url_aes, encryption_key),
            site_path: site_path || undefined,
            pin_title: link.pin_title_aes
              ? await AES.decrypt(link.pin_title_aes, encryption_key)
              : undefined,
            open_snapshot: link.open_snapshot || undefined,
            is_pinned: link.is_pinned || undefined,
            pin_order: link.pin_order || undefined,
            reader_data: link.reader_data_aes
              ? new TextDecoder().decode(
                  pako.inflate(
                    Uint8Array.from(
                      atob(
                        await AES.decrypt(
                          link.reader_data_aes,
                          encryption_key,
                        ),
                      ),
                      (c) => c.charCodeAt(0),
                    ),
                  ),
                )
              : undefined,
          })
        } else {
          throw new Error('Url_aes and site_aes should be there.')
        }
      }

      bookmarks.push({
        id: bookmark.id,
        is_public: bookmark.is_public || undefined,
        created_at: bookmark.created_at,
        title: bookmark.title
          ? bookmark.title
          : bookmark.title_aes
          ? await AES.decrypt(bookmark.title_aes, encryption_key)
          : undefined,
        note: bookmark.note
          ? bookmark.note
          : bookmark.note_aes
          ? await AES.decrypt(bookmark.note_aes, encryption_key)
          : undefined,
        is_unsorted: bookmark.is_unsorted, // It's important to store 'false' if is there, meaning bookmark is sorted
        is_archived: bookmark.is_archived,
        stars: bookmark.stars || undefined,
        tags,
        links,
      })
    }

    const tag_hierarchies = []
    for (const node of data.tag_hierarchies) {
      tag_hierarchies.push(await parse_tag_hierarchy_node(node))
    }

    return {
      bookmarks,
      tag_hierarchies,
    }
  }

  public async request_new_backup(
    params: RequestNewBackup_Params,
  ): Promise<void> {
    await this._import_data_source.request_new_backup(params)
  }
}
