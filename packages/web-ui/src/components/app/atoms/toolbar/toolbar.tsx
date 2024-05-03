import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './toolbar.module.scss'
import cn from 'classnames'

export namespace Toolbar {
  export type Props = {
    toggleable_buttons_: {
      label_: string
      on_click_: () => void
      is_toggled_: boolean
    }[]
    icon_buttons_: { icon_variant_: Icon.Variant; on_click: () => void }[]
  }
}

export const Toolbar: React.FC<Toolbar.Props> = (props) => {
  return (
    <div className={styles.toolbar}>
      {props.toggleable_buttons_.map((button, i) => (
        <button
          className={cn(styles.toolbar__toggleable_button, {
            [styles['toolbar__toggleable_button--toggled']]: button.is_toggled_,
          })}
          onClick={button.on_click_}
          key={i}
        >
          <span>{button.label_}</span>
        </button>
      ))}
      <div className={styles.toolbar__separator} />
      {props.icon_buttons_.map((button, i) => (
        <button
          className={styles.toolbar__icon_button}
          onClick={button.on_click}
          key={i}
        >
          <Icon variant={button.icon_variant_} />
        </button>
      ))}
    </div>
  )
}
