import { StandardSection as UiSettings_StandardSection } from '@web-ui/components/settings/StandardSection'
import { DesktopMenuItem as UiSettings_DesktopMenuItem } from '@web-ui/components/settings/DesktopMenuItem'
import { Template as UiSettings_Template } from '@web-ui/components/settings/Template'
import { Input } from '@web-ui/components/common/atoms/input'
import { Button } from '@web-ui/components/Button'
import { SimpleBackArrowHeader as UiCommon_SimpleBackArrowHeader } from '@web-ui/components/common/SimpleBackArrowHeader'

export default {
  title: 'page-previews/settings',
}

export const Primary = () => {
  return (
    <UiSettings_Template
      slot_header={
        <UiCommon_SimpleBackArrowHeader
          title="Settings"
          back_href=""
          is_transparent_on_desktop={true}
        />
      }
      slot_desktop_navigation={
        <>
          <UiSettings_DesktopMenuItem
            href=""
            is_active={true}
            label="Account"
          />
          <UiSettings_DesktopMenuItem
            href=""
            is_active={false}
            label="Billing & plans"
          />
          <UiSettings_DesktopMenuItem
            href=""
            is_active={false}
            label="Import bookmarks"
          />
        </>
      }
      slot_mobile_navigation={'nav'}
    >
      <UiSettings_StandardSection
        heading={{ text: 'Lorem ipsum', subtext: 'Lorem ipsum' }}
      >
        <Input value="Lorem ipsum" on_change={() => {}} />
        <Button size="default">Lorem</Button>
      </UiSettings_StandardSection>
      <UiSettings_StandardSection
        heading={{ text: 'Lorem ipsum', subtext: 'Lorem ipsum' }}
      >
        <Input value="Lorem ipsum" on_change={() => {}} />
        <Button size="default">Lorem</Button>
      </UiSettings_StandardSection>
      <UiSettings_StandardSection
        heading={{ text: 'Lorem ipsum', subtext: 'Lorem ipsum' }}
      >
        <Input value="Lorem ipsum" on_change={() => {}} />
        <Button size="default">Lorem</Button>
      </UiSettings_StandardSection>
    </UiSettings_Template>
  )
}
