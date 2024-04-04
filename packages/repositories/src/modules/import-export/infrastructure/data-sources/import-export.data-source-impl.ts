import { SendImportData_Params } from '../../domain/types/send-import-data.params'
import { ImportExport_DataSource } from './import-export.data-source'
import { get_domain_from_url } from '@shared/utils/get-domain-from-url'
import { SendImportData_Dto } from '@shared/types/modules/import-export/send-import-data.dto'
import { ListBackups_Dto } from '@shared/types/modules/import-export/list-backups.dto'
import { DownloadBackup_Dto } from '@shared/types/modules/import-export/download-backup.dto'
import { DownloadBackup_Params } from '../../domain/types/download-backup.params'
import { system_values } from '@shared/constants/system-values'
import { Crypto } from '@repositories/utils/crypto'
import { KyInstance } from 'ky'

export class ImportExport_DataSourceImpl implements ImportExport_DataSource {
  constructor(private readonly _ky: KyInstance) {}

  public async send_import_data(params: SendImportData_Params): Promise<void> {
    const key = await Crypto.derive_key_from_password('my_secret_key')

    const created_at_fallback = new Date()
    const body: SendImportData_Dto.Body = {
      bookmarks: await Promise.all(
        params.bookmarks.map(async (bookmark) => {
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

          return {
            id: bookmark.id,
            title: bookmark.is_public ? title : undefined,
            title_aes:
              !bookmark.is_public && title
                ? await Crypto.AES.encrypt(title, key)
                : undefined,
            note: bookmark.is_public ? note : undefined,
            note_aes:
              !bookmark.is_public && note
                ? await Crypto.AES.encrypt(note, key)
                : undefined,
            created_at:
              bookmark.created_at || created_at_fallback.toISOString(),
            is_public: bookmark.is_public || undefined,
            is_archived: bookmark.is_archived || undefined,
            is_unread: bookmark.is_unread || undefined,
            stars: bookmark.stars || undefined,
            tags: bookmark.tags
              ? await Promise.all(
                  bookmark.tags
                    .slice(0, system_values.bookmark.tags.limit)
                    .map(async (tag) => {
                      if (tag.is_public) {
                        return {
                          is_public: true,
                          hash: await Crypto.SHA256(tag.name.trim(), key),
                          name: tag.name,
                        }
                      } else {
                        return {
                          is_public: false,
                          hash: await Crypto.SHA256(tag.name.trim(), key),
                          name_aes: await Crypto.AES.encrypt(
                            tag.name.trim(),
                            key,
                          ),
                        }
                      }
                    }),
                )
              : undefined,
            links: bookmark.links
              ? await Promise.all(
                  bookmark.links
                    .filter((link) => link.url.trim().length > 0)
                    .slice(0, system_values.bookmark.links.limit)
                    .map(async (link) => {
                      if (link.is_public) {
                        return {
                          is_public: true,
                          url: link.url.trim(),
                          hash: await Crypto.SHA256(link.url.trim(), key),
                          site_path: link.site_path,
                        }
                      } else {
                        const domain = get_domain_from_url(link.url)
                        return {
                          is_public: false,
                          hash: await Crypto.SHA256(link.url.trim(), key),
                          url_aes: await Crypto.AES.encrypt(
                            link.url.trim(),
                            key,
                          ),
                          site_aes: await Crypto.AES.encrypt(
                            link.site_path
                              ? `${domain}/${link.site_path}`
                              : domain,
                            key,
                          ),
                        }
                      }
                    }),
                )
              : undefined,
          }
        }),
      ),
      tag_hierarchies: params.tag_hierarchies,
      erase_library: params.erase_library || undefined,
    }

    await this._ky
      .post(`v1/import-export/send-import-data`, {
        body: JSON.stringify(body),
      })
      .json()
  }

  public async list_backups(): Promise<ListBackups_Dto.Response> {
    return this._ky.get(`v1/import-export/list-backups`).json()
  }

  public async download_backup(
    params: DownloadBackup_Params,
  ): Promise<DownloadBackup_Dto.Response> {
    return this._ky.get(`v1/import-export/download-backup/${params.id}`).json()
  }
}
