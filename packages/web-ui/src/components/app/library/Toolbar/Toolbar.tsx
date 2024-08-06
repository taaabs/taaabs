import styles from './Toolbar.module.scss'
import cn from 'classnames'

export namespace Toolbar {
  export type Props = {
    toggleable_buttons: {
      label: string
      on_click: () => void
      is_toggled: boolean
    }[]
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
          <span>{button.label}</span>
        </button>
      ))}
    </div>
  )
}
