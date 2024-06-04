import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './item.module.scss'

export namespace Item {
  export type Props = {
    bookmark_id_: number
    url_: string
    created_at_: Date
    menu_slot_: React.ReactNode
    is_public_?: boolean
    site_path_?: string
    cover_?: string
    title_?: string
    stars_?: number
    is_unsorted_?: boolean
    is_archived_?: boolean
    tags_?: number[]
    open_snapshot_?: boolean
    is_parsed_?: boolean
    saves_?: number
  }
}

export const Item: React.FC<Item.Props> = (props) => {
  return (
    <div className={styles.item}>
      <div className={styles.cover}>
        <div className={styles.cover__image}>
          {props.cover_ ? (
            <img src={`data:image/webp;base64,${props.cover_}`} />
          ) : (
            <Icon variant="BOOKMARK_FILLED" />
          )}
        </div>
      </div>

      <div className={styles.title}>{props.title_}</div>
      <div className={styles.toolbar}>toolbar</div>
      <div className={styles.handle}>handle</div>
    </div>
  )
}
