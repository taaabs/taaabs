import Skeleton from 'react-loading-skeleton'
import styles from './library-search.module.scss'
import { use_is_hydrated } from '@shared/hooks'
import { Icon } from '@web-ui/components/common/particles/icon'

export namespace LibrarySearch {
  type Hint = {
    type: 'new' | 'recent'
    text: string
  }
  export type Props = {
    placeholder: string
    search_string: string
    on_click_hint: (hint: string) => void
    on_click_recent_hint_remove: (hint: string) => void
    hints: Hint[]
  }
}

export const LibrarySearch: React.FC<LibrarySearch.Props> = (props) => {
  const is_hydrated = use_is_hydrated()

  return is_hydrated ? (
    <div className={styles.container}>
      <div className={styles.input}>
        <Icon variant="SEARCH" />
        <input value={props.search_string} placeholder={props.placeholder} />
      </div>
      {props.hints.length > 0 && (
        <div className={styles.hints}>
          {props.hints.map((hint) => (
            <button
              className={styles.hints__item}
              onClick={() => {
                props.on_click_hint(hint.text)
              }}
            >
              <div className={styles.hints__item__icon}>
                {hint.type == 'new' && <Icon variant="SEARCH" />}
                {hint.type == 'recent' && <Icon variant="RECENT" />}
              </div>
              <div className={styles.hints__item__text}>
                <span>
                  {hint.text.substring(0, props.search_string.length)}
                </span>
                <span>{hint.text.substring(props.search_string.length)}</span>
              </div>
              {hint.type == 'recent' && (
                <button
                  className={styles.hints__item__remove}
                  onClick={(e) => {
                    e.stopPropagation()
                    props.on_click_recent_hint_remove(hint.text)
                  }}
                >
                  remove
                </button>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  ) : (
    <div className={styles.skeleton}>
      <Skeleton borderRadius={999} />
    </div>
  )
}
