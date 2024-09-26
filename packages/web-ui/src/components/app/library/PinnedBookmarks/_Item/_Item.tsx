import { Icon as UiIcon } from '@web-ui/components/Icon'
import styles from './_Item.module.scss'
import cn from 'classnames'
import { get_domain_from_url } from '@shared/utils/get-domain-from-url'
import { useRef, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import useViewportSpy from 'beautiful-react-hooks/useViewportSpy'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { url_to_wayback } from '@web-ui/utils/url-to-wayback'

export namespace _Item {
  export type Props = {
    url: string
    menu_slot: React.ReactNode
    favicon_host: string
    on_reading_mode_click: () => void
    on_video_player_click: () => void
    should_dim_visited_links: boolean
    on_link_click: () => void
    on_link_middle_click: () => void
    on_new_tab_click: () => void
    on_is_visible: () => void
    on_menu_toggled: (is_open: boolean) => void
    created_at: Date
    is_public?: boolean
    title?: string
    site_path?: string
    saves?: number
    open_snapshot?: boolean
    favicon?: string
    is_parsed?: boolean
    stars?: number
  }
}

export const _Item: React.FC<_Item.Props> = (props) => {
  const ref = useRef<HTMLDivElement>(null)
  const is_visible = useViewportSpy(ref)
  const [is_menu_opened, set_is_menu_opened] = useState<boolean>()

  useUpdateEffect(() => {
    is_visible && props.on_is_visible()
  }, [is_visible])

  const url = props.open_snapshot
    ? url_to_wayback({ date: props.created_at, url: props.url })
    : props.url

  return (
    <div className={styles.item} ref={ref}>
      <div className={styles.item__link}>
        <button className={styles.item__link__site}>
          {props.is_public ? (
            <img
              alt={'Favicon'}
              width={16}
              height={16}
              src={`${props.favicon_host}/${get_domain_from_url(props.url)}`}
              loading="lazy"
            />
          ) : props.favicon ? (
            <img
              alt={'Favicon'}
              width={16}
              height={16}
              src={`data:image/webp;base64,${props.favicon}`}
            />
          ) : (
            <UiIcon variant="GLOBE" />
          )}
        </button>
        {props.is_parsed && (
          <button
            className={styles.item__link__reader}
            onClick={() => {
              props.on_reading_mode_click()
            }}
          >
            <UiIcon variant="RESIZE" />
          </button>
        )}
        {is_video_url(props.url) && (
          <button
            className={styles.item__link__reader}
            onClick={props.on_video_player_click}
          >
            <UiIcon variant="RESIZE" />
          </button>
        )}
        <a
          className={cn(
            styles.item__link__url,
            {
              [styles['item__link__url--dim-visited']]:
                props.should_dim_visited_links,
            },
            {
              [styles['item__link__url--via-wayback']]: props.open_snapshot,
            },
          )}
          href={url}
          onClick={async (e) => {
            e.stopPropagation()
            e.preventDefault()
            props.on_link_click()
          }}
          onAuxClick={props.on_link_middle_click}
        >
          {props.stars && props.stars >= 1 && (
            <div className={styles.item__link__url__stars}>
              {[...new Array(props.stars)].map((_, i) => (
                <UiIcon variant="STAR_FILLED" key={i} />
              ))}
            </div>
          )}{' '}
          <span>{props.title}</span>
        </a>
      </div>
      <div className={cn(styles.item__actions, 'no-drag')}>
        {props.saves !== undefined && props.saves > 0 && (
          <button className={styles['item__actions__public-saves']}>
            {props.saves}
          </button>
        )}
        <button
          className={styles.item__actions__open}
          onClick={async (e) => {
            e.stopPropagation()
            props.on_new_tab_click()
          }}
        >
          <UiIcon variant="NEW_TAB" />
        </button>
        <div className={styles.item__actions__menu}>
          <OutsideClickHandler
            disabled={!is_menu_opened}
            onOutsideClick={() => {
              set_is_menu_opened(false)
              props.on_menu_toggled(false)
            }}
          >
            <button
              className={cn(styles.item__actions__menu__button, {
                [styles['item__actions__menu__button--toggled']]:
                  is_menu_opened,
              })}
              onClick={() => {
                set_is_menu_opened(!is_menu_opened)
                props.on_menu_toggled(true)
              }}
            >
              <UiIcon variant="MORE" />
            </button>
            <div
              className={cn(styles.slot, {
                [styles['slot--visible']]: is_menu_opened,
              })}
              onClick={() => {
                set_is_menu_opened(false)
              }}
            >
              {props.menu_slot}
            </div>
          </OutsideClickHandler>
        </div>
      </div>
    </div>
  )
}

// Helper function to check if the URL is a video URL
const is_video_url = (url: string): boolean => {
  const youtube_regex = /^https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9_-]+$/
  const pornhub_regex =
    /^https:\/\/(?:[a-z]{3}\.)?pornhub\.com\/view_video\.php\?viewkey=[a-zA-Z0-9]+$/
  const twitch_regex = /^https:\/\/www\.twitch\.tv\/videos\/\d+$/

  return (
    youtube_regex.test(url) || pornhub_regex.test(url) || twitch_regex.test(url)
  )
}
