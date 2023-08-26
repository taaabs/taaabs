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
      headerSlot={<Header title="settings" backHref="" />}
      desktopNavigationSlot={
        <>
          <DesktopMenuItem href="" isActive={true} label="Account" />
          <DesktopMenuItem href="" isActive={false} label="Billing & plans" />
          <DesktopMenuItem href="" isActive={false} label="Import bookmarks" />
        </>
      }
      mobileNavigationSlot={'nav'}
      mainSlot={
        <>
          <SettingBox>
            <SettingHeading heading="Lorem" subheading="Ipsum" />
            <Input value="Lorem ipsum" onChange={() => {}} />
            <Button size="default">Lorem</Button>
          </SettingBox>
          <SettingBox>
            <SettingHeading heading="Lorem" subheading="Ipsum" />
            <Input value="Lorem ipsum" onChange={() => {}} />
            <Button size="default">Lorem</Button>
          </SettingBox>
          <SettingBox>
            <SettingHeading heading="Lorem" subheading="Ipsum" />
            <Input value="Lorem ipsum" onChange={() => {}} />
            <Button size="default">Lorem</Button>
          </SettingBox>
          <SettingBox>
            <SettingHeading heading="Lorem" subheading="Ipsum" />
            <Input value="Lorem ipsum" onChange={() => {}} />
            <Button size="default">Lorem</Button>
          </SettingBox>
          <SettingBox>
            <SettingHeading heading="Lorem" subheading="Ipsum" />
            <Input value="Lorem ipsum" onChange={() => {}} />
            <Button size="default">Lorem</Button>
          </SettingBox>
        </>
      }
    />
  )
}
