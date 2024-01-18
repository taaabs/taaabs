import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './toolbar.module.scss'
import cn from 'classnames'

export namespace Toolbar {
  export type Props = {
    toggleable_buttons: {
      label: string
      on_click: () => void
      is_toggled: boolean
    }[]
    icon_buttons: { icon_variant: Icon.Variant; on_click: () => void }[]
  }
}

export const Toolbar: React.FC<Toolbar.Props> = (props) => {
  return (
    <div className={styles.toolbar}>
      {props.toggleable_buttons.map((button, i) => (
        <button
          className={cn(styles.toolbar__toggleable_button, {
            [styles['toolbar__toggleable_button--toggled']]: button.is_toggled,
          })}
          onClick={button.on_click}
          key={i}
        >
          {button.label}
        </button>
      ))}
      <div className={styles.toolbar__separator} />
      {props.icon_buttons.map((button, i) => (
        <button
          className={styles.toolbar__icon_button}
          onClick={button.on_click}
          key={i}
        >
          <Icon variant={button.icon_variant} />
        </button>
      ))}
    </div>
  )
}
