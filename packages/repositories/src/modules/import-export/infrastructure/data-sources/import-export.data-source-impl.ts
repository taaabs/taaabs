import CryptoJS from 'crypto-js'
import { SendImportData_Params } from '../../domain/types/send-import-data.params'
import { ImportExport_DataSource } from './import-export.data-source'
import { get_domain_from_url } from '@shared/utils/get-domain-from-url'
import { SendImportData_Dto } from '@shared/types/modules/import-export/send-import-data.dto'
import { ListBackups_Dto } from '@shared/types/modules/import-export/list-backups.dto'
import { DownloadBackup_Dto } from '@shared/types/modules/import-export/download-backup.dto'
import { DownloadBackup_Params } from '../../domain/types/download-backup.params'
import { system_values } from '@shared/constants/system-values'

export class ImportExport_DataSourceImpl implements ImportExport_DataSource {
  constructor(
    private readonly _api_url: string,
    private readonly _auth_token: string,
  ) {}

  public async send_import_data(params: SendImportData_Params): Promise<void> {
    const created_at_fallback = new Date()
    const body: SendImportData_Dto.Body = {
      bookmarks: params.bookmarks.map((bookmark) => {
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
              ? CryptoJS.AES.encrypt(title, 'my_secret_key').toString()
              : undefined,
          note: bookmark.is_public ? note : undefined,
          note_aes:
            !bookmark.is_public && note
              ? CryptoJS.AES.encrypt(note, 'my_secret_key').toString()
              : undefined,
          created_at: bookmark.created_at || created_at_fallback.toISOString(),
          is_public: bookmark.is_public || undefined,
          is_archived: bookmark.is_archived || undefined,
          is_unread: bookmark.is_unread || undefined,
          stars: bookmark.stars || undefined,
          tags: bookmark.tags
            ? bookmark.tags
                .slice(0, system_values.bookmark.tags.limit)
                .map((tag) => {
                  if (tag.is_public) {
                    return {
                      is_public: true,
                      hash: CryptoJS.SHA256(
                        tag.name.trim() + 'my_secret_key',
                      ).toString(),
                      name: tag.name,
                    }
                  } else {
                    return {
                      is_public: false,
                      hash: CryptoJS.SHA256(
                        tag.name.trim() + 'my_secret_key',
                      ).toString(),
                      name_aes: CryptoJS.AES.encrypt(
                        tag.name.trim(),
                        'my_secret_key',
                      ).toString(),
                    }
                  }
                })
            : undefined,
          links: bookmark.links
            ? bookmark.links
                .filter((link) => link.url.trim().length > 0)
                .slice(0, system_values.bookmark.links.limit)
                .map((link) => {
                  if (link.is_public) {
                    return {
                      is_public: true,
                      url: link.url.trim(),
                      hash: CryptoJS.SHA256(
                        link.url.trim() + 'my_secret_key',
                      ).toString(),
                      site_path: link.site_path,
                    }
                  } else {
                    const domain = get_domain_from_url(link.url)
                    return {
                      is_public: false,
                      hash: CryptoJS.SHA256(
                        link.url.trim() + 'my_secret_key',
                      ).toString(),
                      url_aes: CryptoJS.AES.encrypt(
                        link.url.trim(),
                        'my_secret_key',
                      ).toString(),
                      site_aes: CryptoJS.AES.encrypt(
                        link.site_path ? `${domain}/${link.site_path}` : domain,
                        'my_secret_key',
                      ).toString(),
                    }
                  }
                })
            : undefined,
        }
      }),
      tree: [],
      erase_library: params.erase_library || undefined,
    }

    await fetch(`${this._api_url}/v1/import-export/send-import-data`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this._auth_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((r) => {
      if (!r.ok) {
        throw new Error()
      }
    })
  }

  public async list_backups(): Promise<ListBackups_Dto.Response> {
    return fetch(`${this._api_url}/v1/import-export/list-backups`, {
      headers: {
        Authorization: `Bearer ${this._auth_token}`,
        'Content-Type': 'application/json',
      },
    }).then((r) => {
      if (r.ok) {
        return r.json()
      } else {
        throw new Error()
      }
    })
  }

  public async download_backup(
    params: DownloadBackup_Params,
  ): Promise<DownloadBackup_Dto.Response> {
    return fetch(
      `${this._api_url}/v1/import-export/download-backup/${params.id}`,
      {
        headers: {
          Authorization: `Bearer ${this._auth_token}`,
        },
      },
    ).then((r) => r.json())
  }
}
