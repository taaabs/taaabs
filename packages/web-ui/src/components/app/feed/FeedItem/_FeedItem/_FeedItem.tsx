import styles from './_FeedItem.module.scss'
import cn from 'classnames'
import { BlurhashCanvas } from 'react-blurhash'
import { memo } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/pl'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import OutsideClickHandler from 'react-outside-click-handler'
import useToggle from 'beautiful-react-hooks/useToggle'
import { Icon, Icon as UiIcon } from '@web-ui/components/Icon'

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

dayjs.updateLocale('en', {
  relativeTime: {
    future: '%s',
    past: '%s',
    s: 'now',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: 'yesterday',
    dd: '%dd',
    M: '',
    MM: '',
    y: '',
    yy: '',
  },
})

dayjs.updateLocale('pl', {
  relativeTime: {
    future: '%s',
    past: '%s',
    s: 'teraz',
    m: '1 min.',
    mm: '%d min.',
    h: '1 godz.',
    hh: '%d godz.',
    d: 'wczoraj',
    dd: '%d dni temu',
    M: '',
    MM: '',
    y: '',
    yy: '',
  },
})

export namespace _FeedItem {
  export type Highlights = [number, number][]

  export type Props = {
    locale: 'pl' | 'en'
    title?: string
    url: string
    date: Date
    created_at: Date
    creator: {
      display_name?: string
      username: string
      total_bookmarks: number
      is_followed: boolean
    }
    density: 'default' | 'compact'
    is_compact?: boolean
    on_click: () => void
    favicon_host: string
    menu_slot: React.ReactNode
    cover?: {
      url: string
      blurhash: string
    }
    translations: {
      bookmarks: string
      save: string
    }
  }
}

export const _FeedItem: React.FC<_FeedItem.Props> = memo(
  function _FeedItem(props) {
    const [is_desktop_menu_open, toggle_is_desktop_menu_open] = useToggle(false)
    const [is_mobile_menu_open, toggle_is_mobile_menu_open] = useToggle(false)

    const relative_time = dayjs(props.date, { locale: props.locale }).fromNow()

    const item_date =
      relative_time != ''
        ? relative_time
        : dayjs(props.date, { locale: props.locale }).format(
            props.locale == 'en' ? 'MMMM DD, YYYY' : 'D MMMM YYYY',
          )

    const title = props.title ? props.title : '(Untitled)'

    return (
      <div
        className={cn(
          styles.container,
          {
            [styles['container--clickable']]: props.density == 'compact',
          },
          {
            [styles['container--compact']]: props.density == 'compact',
          },
          {
            [styles['container--compact--opened']]:
              props.density == 'compact' && props.is_compact == false,
          },
        )}
        role="button"
        onClick={() => {
          if (!is_desktop_menu_open && !is_mobile_menu_open) props.on_click()
        }}
      >
        <div className={styles.container__inner}>
          <div className={styles.container__inner__creator}>
            <div className={styles.container__inner__creator__avatar}>
              <Icon variant="USER" />
            </div>
            <div className={styles['container__inner__creator__display-name']}>
              {props.creator.display_name}
            </div>
            <div className={styles.container__inner__creator__info}>
              {`@${props.creator.username} · ${props.creator.total_bookmarks} ${props.translations.bookmarks}`}
            </div>
          </div>

          <div className={styles.container__inner__actions}>
            <div
              className={styles.container__inner__actions__menu}
              style={
                is_desktop_menu_open
                  ? { position: 'relative', zIndex: 1 }
                  : undefined
              }
            >
              <OutsideClickHandler
                disabled={!is_desktop_menu_open}
                onOutsideClick={toggle_is_desktop_menu_open}
              >
                <button
                  className={cn(
                    styles.container__inner__actions__menu__button,
                    {
                      [styles['container__inner__actions__menu--toggled']]:
                        is_desktop_menu_open,
                    },
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggle_is_desktop_menu_open()
                  }}
                >
                  <UiIcon variant="MORE" />
                </button>
                <div
                  className={cn(styles.slot, {
                    [styles['slot--visible']]: is_desktop_menu_open,
                  })}
                  onClick={toggle_is_desktop_menu_open}
                >
                  {props.menu_slot}
                </div>
              </OutsideClickHandler>
            </div>
          </div>

          <div
            className={cn(styles.container__inner__title, {
              [styles['container__inner__title--untitled']]: !props.title,
            })}
          >
            <a href={props.url}>{title}</a>
          </div>

          <div className={styles.container__inner__cover}>
            [FAVICON URL]
            {props.cover && (
              <div className={styles.container__inner__cover__image}>
                <BlurhashCanvas hash={props.cover.blurhash} />
                <img
                  className={styles.container__inner__cover__image__fill}
                  loading="lazy"
                  src={props.cover.url}
                />
                <img
                  className={styles.container__inner__cover__image__top}
                  loading="lazy"
                  src={props.cover.url}
                />
              </div>
            )}
          </div>

          <div className={styles.container__inner__footer}>{item_date}</div>
        </div>
      </div>
    )
  },
  (o, n) => o.is_compact == n.is_compact && o.density == n.density,
)
