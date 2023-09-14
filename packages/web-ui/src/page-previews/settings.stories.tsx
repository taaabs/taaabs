import { Input } from '@web-ui/components/common/atoms/input'
import { Button } from '@web-ui/components/common/particles/button'
import { DesktopMenuItem } from '@web-ui/components/settings/atoms/desktop-menu-item'
import { Header } from '@web-ui/components/settings/atoms/header'
import { SettingBox } from '@web-ui/components/settings/atoms/setting-box'
import { SettingHeading } from '@web-ui/components/settings/atoms/setting-heading'
import { Settings } from '@web-ui/components/settings/templates/settings/settings'

export default {
  title: 'page-previews/settings',
}

export const Primary = () => {
  return (
    <Settings
      slot_header={<Header title="Settings" back_href="" />}
      slot_desktop_navigation={
        <>
          <DesktopMenuItem href="" is_active={true} label="Account" />
          <DesktopMenuItem href="" is_active={false} label="Billing & plans" />
          <DesktopMenuItem href="" is_active={false} label="Import bookmarks" />
        </>
      }
      slot_mobile_navigation={'nav'}
      slot_main={
        <>
          <SettingBox>
            <SettingHeading heading="Lorem" subheading="Ipsum" />
            <Input value="Lorem ipsum" on_change={() => {}} />
            <Button size="default">Lorem</Button>
          </SettingBox>
          <SettingBox>
            <SettingHeading heading="Lorem" subheading="Ipsum" />
            <Input value="Lorem ipsum" on_change={() => {}} />
            <Button size="default">Lorem</Button>
          </SettingBox>
          <SettingBox>
            <SettingHeading heading="Lorem" subheading="Ipsum" />
            <Input value="Lorem ipsum" on_change={() => {}} />
            <Button size="default">Lorem</Button>
          </SettingBox>
          <SettingBox>
            <SettingHeading heading="Lorem" subheading="Ipsum" />
            <Input value="Lorem ipsum" on_change={() => {}} />
            <Button size="default">Lorem</Button>
          </SettingBox>
          <SettingBox>
            <SettingHeading heading="Lorem" subheading="Ipsum" />
            <Input value="Lorem ipsum" on_change={() => {}} />
            <Button size="default">Lorem</Button>
          </SettingBox>
        </>
      }
    />
  )
}
