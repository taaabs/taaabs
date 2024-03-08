import { get_domain_from_url } from '@shared/utils/get-domain-from-url'
import { ImportExport_Repository } from '../../domain/repositories/import-export.repository'
import { DownloadBackup_Params } from '../../domain/types/download-backup.params'
import { ListBackups_Ro } from '../../domain/types/list-backups.ro'
import { SendImportData_Params } from '../../domain/types/send-import-data.params'
import { ImportExport_DataSource } from '../data-sources/import-export.data-source'
import { Crypto } from '@repositories/utils/crypto'

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

    const key = await Crypto.derive_key_from_password('my_secret_key')

    // Structure of downloadable data is the same as the input for import.
    const downloadable_json: SendImportData_Params = {
      bookmarks: await Promise.all(
        data.bookmarks.map(async (bookmark) => ({
          id: bookmark.id,
          is_public: bookmark.is_public || false,
          created_at: bookmark.created_at,
          title: bookmark.title
            ? bookmark.title
            : bookmark.title_aes
            ? await Crypto.AES.decrypt(bookmark.title_aes, key)
            : undefined,
          note: bookmark.note
            ? bookmark.note
            : bookmark.note_aes
            ? await Crypto.AES.decrypt(bookmark.note_aes, key)
            : undefined,
          is_unread: bookmark.is_unread || false,
          is_archived: bookmark.is_archived,
          stars: bookmark.stars || 0,
          tags: bookmark.tags
            ? await Promise.all(
                bookmark.tags.map(async (tag) => {
                  if (tag.is_public) {
                    return {
                      name: tag.name,
                      is_public: true,
                    }
                  } else {
                    return {
                      name: await Crypto.AES.decrypt(tag.name_aes, key),
                      is_public: false,
                    }
                  }
                }),
              )
            : undefined,
          links: bookmark.links
            ? await Promise.all(
                bookmark.links.map(async (link) => {
                  if (link.is_public) {
                    return {
                      is_public: true,
                      url: link.url,
                      site_path: link.site_path,
                    }
                  } else {
                    const site = await Crypto.AES.decrypt(link.site_aes, key)
                    const domain = `${get_domain_from_url(site)}/`
                    const site_path = site.slice(domain.length)
                    return {
                      is_public: false,
                      url: await Crypto.AES.decrypt(link.url_aes, key),
                      site_path: site_path,
                    }
                  }
                }),
              )
            : undefined,
        })),
      ),
      tree: [],
    }

    return JSON.stringify(downloadable_json)
  }
}
