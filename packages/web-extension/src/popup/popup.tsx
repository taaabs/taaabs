import { render } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import styles from './popup.module.scss'

import '../../../web-ui/src/styles/style.scss'
import {
  tab_data_content_script,
  TabData,
} from './content-scripts/tab-data-content-script'
import { get_cover_with_blurhash } from '@shared/utils/get-cover-with-blurhash/get-cover-with-blurhash'
import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { HtmlParser } from '@shared/utils/html-parser'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import ky from 'ky'

export const Popup: preact.FunctionComponent = () => {
  const [current_tab_id, set_current_tab_id] = useState<number>()
  const [current_url, set_current_url] = useState<string>()

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        set_current_tab_id(tabs[0].id)
        set_current_url(tabs[0].url)
      }
    })
    chrome.runtime.onMessage.addListener(
      async (request) => {
        if (request.action == 'tab_data') {
          const data = request.data as TabData
          console.log(data)
          const reader_data = HtmlParser.parse({
            url: data.url,
            html: data.html,
          })?.reader_data

          const favicon = data?.favicon ? data.favicon.split(',')[1] : undefined

          let cover: string | undefined = undefined
          let blurhash: string | undefined = undefined

          if (data?.og_image) {
            const cover_with_blurhash = await get_cover_with_blurhash(
              data.og_image,
            )
            cover = cover_with_blurhash.cover.split(',')[1]
            blurhash = cover_with_blurhash.blurhash
          }

          const new_bookmark: UpsertBookmark_Params = {
            is_public: false,
            is_archived: false,
            title: data.title,
            note: data.description,
            tags: [],
            links: [
              {
                url: data.url,
                is_public: false,
                favicon,
                reader_data,
              },
            ],
            cover,
            blurhash,
          }

          const auth_data: any = await new Promise((resolve) => {
            chrome.storage.local.get(['auth_data'], (result) => {
              resolve(result.auth_data)
            })
          })

          console.log(new_bookmark)

          const ky_instance = ky.create({
            prefixUrl: 'https://api.taaabs.com/',
            headers: {
              Authorization: `Bearer ${auth_data.access_token}`,
            },
          })
          const data_source = new Bookmarks_DataSourceImpl(ky_instance)
          const repository = new Bookmarks_RepositoryImpl(data_source)
          await repository.upsert_bookmark(
            new_bookmark,
            new Uint8Array(auth_data.encryption_key),
          )
        }
      },
    )
  }, [])

  return (
    <div className={styles.container}>
      <button
        onClick={() => {
          if (!current_tab_id) return
          tab_data_content_script(current_tab_id)
        }}
      >
        save
      </button>
      <div>{current_tab_id}</div>
      <div>{current_url}</div>
    </div>
  )
}

render(<Popup />, document.getElementById('root')!)