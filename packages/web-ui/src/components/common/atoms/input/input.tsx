import styles from './input.module.scss'

export namespace Input {
  export type Props = {
    value: string
    on_change: (value: string) => void
  }
}

export const Input: React.FC<Input.Props> = (props) => {
  return (
    <input
      className={styles.input}
      onChange={(e) => props.on_change(e.target.value)}
      value={props.value}
    />
  )
}
