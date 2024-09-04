import { Input } from '@web-ui/components/Input'
import styles from './PromptField.module.scss'

export namespace PromptField {
  export type Props = {
    heading: string
    placeholder: string
    value: string
    on_enter_pressed: () => void
    on_change: (value: string) => void
  }
}

export const PromptField: React.FC<PromptField.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.container__header}>{props.heading}</div>
      <Input
        value={props.value}
        on_change={props.on_change}
        min_lines={1}
        max_lines={6}
        disable_enter_new_lines={true}
        on_enter_pressed={props.on_enter_pressed}
        placeholder={props.placeholder}
      />
    </div>
  )
}
