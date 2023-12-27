import { Helpers, Ui } from '@web-ui'

export default {
  title: 'page-previews/update-bookmark-modal',
}

export const Primary = () => {
  return (
    <Ui.Common.Templates.Modal
      children={<>{Helpers.lorem_ipsum.long}</>}
      slot_modal={
        <Ui.App.Templates.FormModal
          slot_header={<Ui.App.Atoms.ModalHeader title="Update bookmark" />}
          slot_footer={
            <Ui.App.Atoms.ModalFooter
              button_label="Update"
              is_disabled={false}
              on_click_cancel={() => {}}
            />
          }
        >
          <Ui.App.Atoms.Box>
            <Ui.App.Atoms.BoxHeading heading="Links" />
          </Ui.App.Atoms.Box>
          <Ui.App.Atoms.Box>
            <Ui.App.Atoms.BoxHeading heading="Title" />
          </Ui.App.Atoms.Box>
          <Ui.App.Atoms.Box>
            <Ui.App.Atoms.BoxHeading heading="Tags" />
          </Ui.App.Atoms.Box>
        </Ui.App.Templates.FormModal>
      }
    />
  )
}
