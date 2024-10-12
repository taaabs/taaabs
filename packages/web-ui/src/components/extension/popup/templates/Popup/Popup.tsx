import styles from './Popup.module.scss'
import cn from 'classnames'

export namespace Popup {
  export type Props = {
    header_slot: React.ReactNode
    children: React.ReactNode
    should_set_height: boolean // Static height should be set when we display recent prompts
  }
}

export const Popup: React.FC<Popup.Props> = (props) => {
  return (
    <div
      className={cn(styles.container, {
        [styles['container--height']]: props.should_set_height,
      })}
    >
      {props.header_slot}
      {props.children}
    </div>
  )
}
