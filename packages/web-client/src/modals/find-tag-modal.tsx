import { FindTag as Form_FindTag } from '@/forms/find-tag'

export const find_tag_modal = (params: {
  modal_context: any
  button_label: string
  title: string
}) =>
  new Promise<Form_FindTag.Tag | null>((resolve) => {
    const on_submit_handler = (tag: Form_FindTag.Tag) => resolve(tag)
    const on_close_handler = () => resolve(null)
    params.modal_context.set_modal(
      <Form_FindTag
        button_label={params.button_label}
        title={params.title}
        on_submit={on_submit_handler}
        on_close={on_close_handler}
      />,
    )
  })
