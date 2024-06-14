import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './_Item.module.scss'
import cn from 'classnames'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { get_domain_from_url } from '@shared/utils/get-domain-from-url'
import { useRef, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import useViewportSpy from 'beautiful-react-hooks/useViewportSpy'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

export namespace _Item {
  export type Props = {
    url_: string
    menu_slot_: React.ReactNode
    favicon_host_: string
    on_reading_mode_click_: () => void
    should_dim_visited_links_: boolean
    on_link_click_: () => void
    on_link_middle_click_: () => void
    on_new_tab_click_: () => void
    on_is_visible: () => void
    is_public_?: boolean
    title_?: string
    site_path_?: string
    saves_?: number
    open_snapshot_?: boolean
    favicon_?: string
    is_parsed_?: boolean
  }
}

export const _Item: React.FC<_Item.Props> = (props) => {
  const ref = useRef<HTMLDivElement>(null)
  const is_visible = useViewportSpy(ref)
  const [was_recently_visited, set_was_recently_visited] = useState<boolean>()
  const [is_menu_opened, set_is_menu_opened] = useState<boolean>()

  useUpdateEffect(() => {
    is_visible && props.on_is_visible()
  }, [is_visible])

  return (
    <div className={styles.item} ref={ref}>
      <div className={styles.item__link}>
        <button className={styles.item__link__site}>
          {props.is_public_ ? (
            <LazyLoadImage
              alt={'Favicon'}
              width={16}
              height={16}
              src={`${props.favicon_host_}/${get_domain_from_url(props.url_)}`}
            />
          ) : props.favicon_ ? (
            <img
              alt={'Favicon'}
              width={16}
              height={16}
              src={`data:image/webp;base64,${props.favicon_}`}
            />
          ) : (
            <Icon variant="GLOBE" />
          )}
        </button>
        {props.is_parsed_ && (
          <button
            className={styles.item__link__reader}
            onClick={() => {
              props.on_reading_mode_click_()
            }}
          >
            <Icon variant="RESIZE" />
          </button>
        )}
        <a
          className={cn(
            styles.item__link__url,
            {
              [styles['item__link__url--dim-visited']]:
                props.should_dim_visited_links_,
            },
            {
              [styles['item__link__url--via-wayback']]: props.open_snapshot_,
            },
          )}
          href={props.url_}
          onClick={async (e) => {
            e.stopPropagation()
            e.preventDefault()
            set_was_recently_visited(true)
            props.on_link_click_()
          }}
          onAuxClick={props.on_link_middle_click_}
        >
          {props.title_}
        </a>
      </div>
      <div className={styles.item__actions}>
        {props.saves_ !== undefined && props.saves_ > 0 && (
          <button className={styles['item__actions__public-saves']}>
            {props.saves_}
          </button>
        )}
        <button
          className={styles.item__actions__open}
          onClick={async (e) => {
            e.stopPropagation()
            set_was_recently_visited(true)
            props.on_new_tab_click_()
          }}
        >
          <Icon variant="NEW_TAB" />
        </button>
        <div className={cn([styles.item__actions__menu, 'no-drag'])}>
          <OutsideClickHandler
            disabled={!is_menu_opened}
            onOutsideClick={() => {
              set_is_menu_opened(false)
            }}
          >
            <button
              className={cn(styles.item__actions__menu__button, {
                [styles['item__actions__menu__button--toggled']]:
                  is_menu_opened,
              })}
              onClick={() => {
                set_is_menu_opened(!is_menu_opened)
              }}
            >
              <Icon variant="MORE" />
            </button>
            <div
              className={cn(styles.slot, {
                [styles['slot--visible']]: is_menu_opened,
              })}
              onClick={() => {
                set_is_menu_opened(false)
              }}
            >
              {props.menu_slot_}
            </div>
          </OutsideClickHandler>
        </div>
      </div>
    </div>
  )
}
