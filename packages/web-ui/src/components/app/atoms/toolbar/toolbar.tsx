import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './toolbar.module.scss'
import cn from 'classnames'
import { use_scrolled_opacity } from '@web-ui/hooks/use-scrolled-opacity'

export namespace Toolbar {
  export type Props = {
    toggleable_buttons: {
      label: string
      on_click: () => void
      is_toggled: boolean
    }[]
    icon_buttons: { icon_variant: Icon.Variant; on_click: () => void }[]
    is_scrolled?: boolean
  }
}

export const Toolbar: React.FC<Toolbar.Props> = (props) => {
  const scrolled_opacity = use_scrolled_opacity()

  return (
    <div
      className={cn(styles.toolbar, {
        [styles['toolbar--scrolled']]: scrolled_opacity.opacity < 1,
      })}
      style={{ opacity: scrolled_opacity.opacity }}
      onMouseOver={() => {
        scrolled_opacity.reset()
      }}
    >
      {props.toggleable_buttons.map((button, i) => (
        <button
          className={cn(styles.toolbar__toggleable_button, {
            [styles['toolbar__toggleable_button--toggled']]: button.is_toggled,
          })}
          onClick={() => {
            scrolled_opacity.reset()
            button.on_click()
          }}
          key={i}
        >
          {button.label}
        </button>
      ))}
      <div className={styles.toolbar__separator} />
      {props.icon_buttons.map((button, i) => (
        <button
          className={styles.toolbar__icon_button}
          onClick={() => {
            scrolled_opacity.reset()
            button.on_click()
          }}
          key={i}
        >
          <Icon variant={button.icon_variant} />
        </button>
      ))}
    </div>
  )
}
