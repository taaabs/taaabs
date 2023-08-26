import styles from './input.module.scss'

export namespace Input {
  export type Props = {
    value: string
    onChange: (value: string) => void
  }
}

export const Input: React.FC<Input.Props> = (props) => {
  return (
    <input
      className={styles.input}
      onChange={(e) => props.onChange(e.target.value)}
      value={props.value}
    />
  )
}
