import CryptoJS from 'crypto-js'
import { get_domain_from_url } from '@shared/utils/get-domain-from-url'
import { ImportExport_Repository } from '../../domain/repositories/import-export.repository'
import { DownloadBackup_Params } from '../../domain/types/download-backup.params'
import { ListBackups_Ro } from '../../domain/types/list-backups.ro'
import { SendImportData_Params } from '../../domain/types/send-import-data.params'
import { ImportExport_DataSource } from '../data-sources/import-export.data-source'

export class ImportExport_RepositoryImpl implements ImportExport_Repository {
  constructor(private readonly _import_data_source: ImportExport_DataSource) {}

  public async send_import_data(params: SendImportData_Params): Promise<void> {
    return this._import_data_source.send_import_data(params)
  }

  public async list_backups(): Promise<ListBackups_Ro> {
    const backups = await this._import_data_source.list_backups()
    return backups.map((backup) => ({
      id: backup.id,
      created_at: backup.created_at,
      name: backup.name,
    }))
  }

  public async download_backup(params: DownloadBackup_Params): Promise<string> {
    const data = await this._import_data_source.download_backup(params)

    // Structure of downloadable data is the same as the input for import.
    const downloadable_json: SendImportData_Params = {
      bookmarks: data.bookmarks.map((bookmark) => ({
        id: bookmark.id,
        is_public: bookmark.is_public || false,
        created_at: bookmark.created_at,
        title: bookmark.title
          ? bookmark.title
          : bookmark.title_aes
          ? CryptoJS.AES.decrypt(bookmark.title_aes, 'my_secret_key').toString(
              CryptoJS.enc.Utf8,
            )
          : undefined,
        note: bookmark.note
          ? bookmark.note
          : bookmark.note_aes
          ? CryptoJS.AES.decrypt(bookmark.note_aes, 'my_secret_key').toString(
              CryptoJS.enc.Utf8,
            )
          : undefined,
        is_unread: bookmark.is_unread || false,
        is_archived: bookmark.is_archived,
        stars: bookmark.stars || 0,
        tags: bookmark.tags
          ? bookmark.tags.map((tag) => {
              if (tag.is_public) {
                return {
                  name: tag.name,
                  is_public: true,
                }
              } else {
                return {
                  name: CryptoJS.AES.decrypt(
                    tag.name_aes,
                    'my_secret_key',
                  ).toString(CryptoJS.enc.Utf8),
                  is_public: false,
                }
              }
            })
          : undefined,
        links: bookmark.links
          ? bookmark.links.map((link) => {
              if (link.is_public) {
                return {
                  is_public: true,
                  url: link.url,
                  site_path: link.site_path,
                }
              } else {
                const site = CryptoJS.AES.decrypt(
                  link.site_aes,
                  'my_secret_key',
                ).toString(CryptoJS.enc.Utf8)
                const domain = `${get_domain_from_url(site)}/`
                const site_path = site.slice(domain.length)
                return {
                  is_public: false,
                  url: CryptoJS.AES.decrypt(
                    link.url_aes,
                    'my_secret_key',
                  ).toString(CryptoJS.enc.Utf8),
                  site_path: site_path,
                }
              }
            })
          : undefined,
      })),
      tree: [],
    }

    return JSON.stringify(downloadable_json)
  }
}
