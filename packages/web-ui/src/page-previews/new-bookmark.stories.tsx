import { Ui } from '@web-ui'

export default {
  title: 'page-previews/new-bookmark',
}

export const Primary = () => {
  return (
    <Ui.App.Templates.NewBookmark
      slot_header={
        <Ui.App.Atoms.SimpleBackArrowHeader
          back_href="/"
          title="New bookmark"
        />
      }
      slot_footer={
        <Ui.Common.Particles.Button size="medium">
          Create
        </Ui.Common.Particles.Button>
      }
    >
      <Ui.App.Atoms.Box>
        <Ui.App.Atoms.BoxHeading heading="Lorem" />
      </Ui.App.Atoms.Box>
      <Ui.App.Atoms.Box>
        <Ui.App.Atoms.BoxHeading heading="Ipsum" />
      </Ui.App.Atoms.Box>
    </Ui.App.Templates.NewBookmark>
  )
}
