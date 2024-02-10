import CryptoJS from 'crypto-js'
import { NewImport_Dto } from '@shared/types/modules/import/new-import.dto'
import { NewImport_Params } from '../../domain/types/new-import.params'
import { Import_DataSource } from './import.data-source'
import { get_domain_from_url } from '@shared/utils/get-domain-from-url'

export class Import_DataSourceImpl implements Import_DataSource {
  constructor(
    private readonly _api_url: string,
    private readonly _auth_token: string,
  ) {}

  public async new_import(params: NewImport_Params): Promise<void> {
    const body: NewImport_Dto.Body = {
      bookmarks: params.bookmarks.map((bookmark) => ({
        title: bookmark.is_public ? bookmark.title : undefined,
        title_aes:
          !bookmark.is_public && bookmark.title
            ? CryptoJS.AES.encrypt(bookmark.title, 'my_secret_key').toString()
            : undefined,
        note: bookmark.is_public ? bookmark.note : undefined,
        note_aes:
          !bookmark.is_public && bookmark.note
            ? CryptoJS.AES.encrypt(bookmark.note, 'my_secret_key').toString()
            : undefined,
        created_at: bookmark.created_at,
        is_public: bookmark.is_public || undefined,
        is_archived: bookmark.is_archived || undefined,
        is_unread: bookmark.is_unread || undefined,
        stars: bookmark.stars || undefined,
        tags: bookmark.tags
          .filter((tag) => tag.name.trim().length > 0)
          .reduce(
            (acc, tag) => {
              const is_duplicate =
                acc.findIndex((t) => t.name == tag.name) != -1
              if (is_duplicate) {
                return acc
              } else {
                return [...acc, tag]
              }
            },
            [] as NewImport_Params['bookmarks'][0]['tags'],
          )
          .map((tag) => ({
            hash: CryptoJS.SHA256(tag.name + 'my_secret_key').toString(),
            name: tag.is_public ? tag.name.trim() : undefined,
            name_aes: !tag.is_public
              ? CryptoJS.AES.encrypt(
                  tag.name.trim(),
                  'my_secret_key',
                ).toString()
              : undefined,
            is_public: tag.is_public || undefined,
          })),
        links: bookmark.links
          .filter((link) => link.url.trim().length > 0)
          .reduce(
            (acc, link) => {
              const is_duplicate =
                acc.findIndex((l) => l.url == link.url.trim()) != -1
              if (is_duplicate) {
                return acc
              } else {
                return [...acc, link]
              }
            },
            [] as NewImport_Params['bookmarks'][0]['links'],
          )
          .map((link) => {
            const domain = get_domain_from_url(link.url)
            return {
              url: link.is_public ? link.url.trim() : undefined,
              url_aes: !link.is_public
                ? CryptoJS.AES.encrypt(
                    link.url.trim(),
                    'my_secret_key',
                  ).toString()
                : undefined,
              site_aes: !link.is_public
                ? CryptoJS.AES.encrypt(
                    link.site_path ? `${domain}/${link.site_path}` : domain,
                    'my_secret_key',
                  ).toString()
                : undefined,
              hash: CryptoJS.SHA256(
                link.url.trim() + 'my_secret_key',
              ).toString(),
              site: link.is_public ? link.site_path : undefined,
              is_public: link.is_public || undefined,
            }
          }),
      })),
      tree: [],
    }

    await fetch(`${this._api_url}/v1/import`, {
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
}
