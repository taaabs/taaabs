import { get_domain_from_url } from '@shared/utils/get-domain-from-url'
import { ImportExport_Repository } from '../../domain/repositories/import-export.repository'
import { DownloadBackup_Params } from '../../domain/types/download-backup.params'
import { ListBackups_Ro } from '../../domain/types/list-backups.ro'
import { SendImportData_Params } from '../../domain/types/send-import-data.params'
import { ImportExport_DataSource } from '../data-sources/import-export.data-source'
import { Crypto } from '@repositories/utils/crypto'
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
      return {
        name: node.name
          ? node.name
          : await Crypto.AES.decrypt(node.name_aes!, encryption_key),
        children: await Promise.all(
          node.children.map(
            async (node) => await parse_tag_hierarchy_node(node),
          ),
        ),
      }
    }

    return {
      bookmarks: await Promise.all(
        data.bookmarks.map(async (bookmark) => ({
          id: bookmark.id,
          is_public: bookmark.is_public || undefined,
          created_at: bookmark.created_at,
          title: bookmark.title
            ? bookmark.title
            : bookmark.title_aes
            ? await Crypto.AES.decrypt(bookmark.title_aes, encryption_key)
            : undefined,
          note: bookmark.note
            ? bookmark.note
            : bookmark.note_aes
            ? await Crypto.AES.decrypt(bookmark.note_aes, encryption_key)
            : undefined,
          is_unsorted: bookmark.is_unsorted, // It's important to store 'false' if is there, meaning bookmark is sorted.
          is_archived: bookmark.is_archived,
          stars: bookmark.stars || undefined,
          cover: bookmark.cover
            ? bookmark.cover
            : bookmark.cover_aes
            ? await Crypto.AES.decrypt(bookmark.cover_aes, encryption_key)
            : undefined,
          tags: bookmark.tags
            ? await Promise.all(
                bookmark.tags.map(async (tag) => {
                  if (tag.name) {
                    return {
                      name: tag.name,
                      is_public: true,
                    }
                  } else if (tag.name_aes) {
                    return {
                      name: await Crypto.AES.decrypt(
                        tag.name_aes,
                        encryption_key,
                      ),
                      is_public: false,
                    }
                  } else {
                    throw new Error('Tag name or name_aes should be there.')
                  }
                }),
              )
            : [],
          links: bookmark.links
            ? await Promise.all(
                bookmark.links.map(async (link) => {
                  if (link.url) {
                    return {
                      is_public: true,
                      url: link.url,
                      site_path: link.site_path || undefined,
                      pin_title: link.pin_title || undefined,
                      open_snapshot: link.open_snapshot || undefined,
                      is_pinned: link.is_pinned || undefined,
                      pin_order: link.pin_order || undefined,
                      reader_data: link.reader_data || undefined,
                    }
                  } else if (link.url_aes && link.site_aes) {
                    const site = await Crypto.AES.decrypt(
                      link.site_aes,
                      encryption_key,
                    )
                    const domain = `${get_domain_from_url(site)}/`
                    const site_path = site.slice(domain.length)
                    return {
                      url: await Crypto.AES.decrypt(
                        link.url_aes,
                        encryption_key,
                      ),
                      site_path: site_path || undefined,
                      pin_title: link.pin_title_aes
                        ? await Crypto.AES.decrypt(
                            link.pin_title_aes,
                            encryption_key,
                          )
                        : undefined,
                      open_snapshot: link.open_snapshot || undefined,
                      is_pinned: link.is_pinned || undefined,
                      pin_order: link.pin_order || undefined,
                      favicon: link.favicon_aes
                        ? await Crypto.AES.decrypt(
                            link.favicon_aes,
                            encryption_key,
                          )
                        : undefined,
                      reader_data: link.reader_data_aes
                        ? new TextDecoder().decode(
                            pako.inflate(
                              Uint8Array.from(
                                atob(
                                  await Crypto.AES.decrypt(
                                    link.reader_data_aes,
                                    encryption_key,
                                  ),
                                ),
                                (c) => c.charCodeAt(0),
                              ),
                            ),
                          )
                        : undefined,
                    }
                  } else {
                    throw new Error('Url aes and site aes should be there')
                  }
                }),
              )
            : [],
        })),
      ),
      tag_hierarchies: await Promise.all(
        data.tag_hierarchies.map(
          async (node) => await parse_tag_hierarchy_node(node),
        ),
      ),
    }
  }

  public async request_new_backup(
    params: RequestNewBackup_Params,
  ): Promise<void> {
    await this._import_data_source.request_new_backup(params)
  }
}
