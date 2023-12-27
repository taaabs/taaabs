import { Ui } from '@web-ui'

export default {
  title: 'page-previews/settings',
}

export const Primary = () => {
  return (
    <Ui.App.Templates.Settings
      slot_header={
        <Ui.App.Atoms.SimpleBackArrowHeader
          title="Settings"
          back_href=""
          is_transparent_on_desktop={true}
        />
      }
      slot_desktop_navigation={
        <>
          <Ui.App.Atoms.DesktopMenuItem
            href=""
            is_active={true}
            label="Account"
          />
          <Ui.App.Atoms.DesktopMenuItem
            href=""
            is_active={false}
            label="Billing & plans"
          />
          <Ui.App.Atoms.DesktopMenuItem
            href=""
            is_active={false}
            label="Import bookmarks"
          />
        </>
      }
      slot_mobile_navigation={'nav'}
      slot_main={
        <>
          <Ui.App.Atoms.Box>
            <Ui.App.Atoms.BoxHeading heading="Lorem" subheading="Ipsum" />
            <Ui.Common.Atoms.Input value="Lorem ipsum" on_change={() => {}} />
            <div>
              <Ui.Common.Particles.Button size="default">
                Lorem
              </Ui.Common.Particles.Button>
            </div>
          </Ui.App.Atoms.Box>
          <Ui.App.Atoms.Box>
            <Ui.App.Atoms.BoxHeading heading="Lorem" subheading="Ipsum" />
            <Ui.Common.Atoms.Input value="Lorem ipsum" on_change={() => {}} />
            <div>
              <Ui.Common.Particles.Button size="default">
                Lorem
              </Ui.Common.Particles.Button>
            </div>
          </Ui.App.Atoms.Box>
          <Ui.App.Atoms.Box>
            <Ui.App.Atoms.BoxHeading heading="Lorem" subheading="Ipsum" />
            <Ui.Common.Atoms.Input value="Lorem ipsum" on_change={() => {}} />
            <div>
              <Ui.Common.Particles.Button size="default">
                Lorem
              </Ui.Common.Particles.Button>
            </div>
          </Ui.App.Atoms.Box>
          <Ui.App.Atoms.Box>
            <Ui.App.Atoms.BoxHeading heading="Lorem" subheading="Ipsum" />
            <Ui.Common.Atoms.Input value="Lorem ipsum" on_change={() => {}} />
            <div>
              <Ui.Common.Particles.Button size="default">
                Lorem
              </Ui.Common.Particles.Button>
            </div>
          </Ui.App.Atoms.Box>
          <Ui.App.Atoms.Box>
            <Ui.App.Atoms.BoxHeading heading="Lorem" subheading="Ipsum" />
            <Ui.Common.Atoms.Input value="Lorem ipsum" on_change={() => {}} />
            <div>
              <Ui.Common.Particles.Button size="default">
                Lorem
              </Ui.Common.Particles.Button>
            </div>
          </Ui.App.Atoms.Box>
        </>
      }
    />
  )
}
