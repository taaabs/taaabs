import { Button } from '@web-ui/components/Button'
import styles from './SavesContent.module.scss'
import dayjs from 'dayjs'
import 'dayjs/locale/pl'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import Simplebar from 'simplebar-react'

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

export namespace SavesContent {
  type User = {
    username: string
    saved_at: Date
    display_name?: string
    is_following?: boolean
  }
  export type Props = {
    users: User[]
    app_url: string
    on_follow_click: (username: string) => void
    show_follow_buttons?: boolean
    locale: 'pl' | 'en'
    back: string
    translations: {
      follow: string
      unfollow: string
    }
  }
}

export const SavesContent: React.FC<SavesContent.Props> = (props) => {
  const content = (
    <div className={styles.container}>
      {props.users.map((user, i) => {
        const relative_time = dayjs(user.saved_at, {
          locale: props.locale,
        }).fromNow()

        const date =
          relative_time != ''
            ? relative_time
            : dayjs(user.saved_at, { locale: props.locale }).format(
                'MMMM DD, YYYY',
              )

        return (
          <div key={i} className={styles.user}>
            <div className={styles.user__left}>
              <a
                href={`${props.app_url}/${user.username}?back=${props.back}`}
                target="_blank"
              >
                <div>
                  <span>{user.username}</span>
                  {user.display_name && <span> {user.display_name}</span>}
                </div>
                <div>{date}</div>
              </a>
            </div>
            {/* {props.show_follow_buttons && (
              <Button on_click={() => props.on_follow_click(user.username)}>
                {user.is_following
                  ? props.translations.unfollow
                  : props.translations.follow}
              </Button>
            )} */}
          </div>
        )
      })}
    </div>
  )

  return window.innerWidth >= 768 ? (
    <Simplebar
      style={{
        height: '35vh',
      }}
    >
      {content}
    </Simplebar>
  ) : (
    content
  )
}
