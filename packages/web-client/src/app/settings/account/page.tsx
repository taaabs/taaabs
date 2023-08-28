'use client'

import { Input } from '@web-ui/components/common/atoms/input'
import { Button } from '@web-ui/components/common/particles/button'
import { SettingBox } from '@web-ui/components/settings/atoms/setting-box'
import { SettingHeading } from '@web-ui/components/settings/atoms/setting-heading'

const Page: React.FC = () => {
  return (
    <>
      <SettingBox>
        <SettingHeading
          heading="Email"
          subheading="This is the email we will use to send you notifications."
        />
        <Input value="Lorem ipsum" onChange={(e) => {}} />
        <Button size="default">Save</Button>
      </SettingBox>
      <SettingBox>
        <SettingHeading
          heading="Username"
          subheading="The username determines the default link of your Taaabs profile."
        />
        <Input value="Lorem ipsum" onChange={(e) => {}} />
        <Button size="default">Save</Button>
      </SettingBox>
    </>
  )
}

export default Page
