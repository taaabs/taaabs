import styles from './simple-select-dropdown.module.scss'

export namespace SimpleSelectDropdownTypes {
  type Item = {
    label: string
    onClick: () => void
  }
  export type Props = {
    items: Item[]
  }
}

export const SimpleSelectDropdown: React.FC<SimpleSelectDropdownTypes.Props> = (
  props,
) => {
  return (
    <div className={styles.container}>
      {props.items.map((item) => (
        <button className={styles.item} onClick={item.onClick}>
          {item.label}
        </button>
      ))}
    </div>
  )
}
