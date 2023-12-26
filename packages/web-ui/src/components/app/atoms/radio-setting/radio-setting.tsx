import styles from './radio-setting.module.scss'
import cn from 'classnames'

export namespace ButtonSelect {
  export type Props = {
    top_line: string
    bottom_line?: string
    is_checked?: boolean
    on_click: () => void
  }
}

export const RadioSetting: React.FC<ButtonSelect.Props> = (props) => {
  return (
    <div className={styles.container} onClick={props.on_click} role="button">
      <div
        className={cn(styles.radio, {
          [styles['radio--checked']]: props.is_checked,
        })}
      >
        {props.is_checked && <div className={styles.radio__check} />}
      </div>
      <div className={styles.text}>
        <div className={styles['text__top-line']}>{props.top_line}</div>
        {props.bottom_line && (
          <div className={styles['text__bottom-line']}>{props.bottom_line}</div>
        )}
      </div>
    </div>
  )
}
