import styles from './setting-box.module.scss'

export namespace SettingBox {
  export type Props = {
    children: React.ReactNode
  }
}

export const SettingBox: React.FC<SettingBox.Props> = (props) => {
  return <div className={styles.container}>{props.children}</div>
}
