import { LibraryAside } from './library-aside'

export default {
  component: LibraryAside,
}

export const Primary = () => {
  return (
    <LibraryAside
      slot_filter={<>filter</>}
      slot_months={<>months</>}
      slot_order={{
        button: <>filter</>,
        dropdown: <></>,
        is_dropdown_visible: false,
      }}
      slot_sortby={{
        button: <>filter</>,
        dropdown: <></>,
        is_dropdown_visible: false,
      }}
      slot_tags={<>tags</>}
    />
  )
}
