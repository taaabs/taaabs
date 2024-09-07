import { Input } from '@web-ui/components/Input'
import styles from './PromptField.module.scss'
import { CheckboxItem } from '@web-ui/components/Dropdown/CheckboxItem'

export namespace PromptField {
  export type Props = {
    heading: string
    placeholder: string
    value: string
    on_submit: () => void
    on_change: (value: string) => void
    is_include_content_selected: boolean
    on_include_content_click: () => void
    translations: {
      include_page_content: string
    }
  }
}

export const PromptField: React.FC<PromptField.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>{props.heading}</div>
      <div className={styles.field}>
        <Input
          value={props.value}
          on_change={props.on_change}
          min_lines={2}
          max_lines={6}
          disable_enter_new_lines={true}
          on_enter_pressed={props.on_submit}
          placeholder={props.placeholder}
          suffix_action={{
            icon_variant: 'SEND',
            on_click: props.on_submit,
          }}
        />
        <CheckboxItem
          is_checked={props.is_include_content_selected}
          on_click={props.on_include_content_click}
          label={props.translations.include_page_content}
        />
      </div>
    </div>
  )
}
