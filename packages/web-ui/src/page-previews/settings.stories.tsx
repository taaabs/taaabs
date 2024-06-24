import { Box } from '@web-ui/components/app/atoms/box'
import { HeadingWithSubheading } from '@web-ui/components/app/atoms/heading-with-subheading'
import { DesktopMenuItem } from '@web-ui/components/app/atoms/desktop-menu-item'
import { SimpleBackArrowHeader } from '@web-ui/components/app/atoms/simple-back-arrow-header'
import { Template } from '@web-ui/components/settings/Template'
import { Input } from '@web-ui/components/common/atoms/input'
import { Button } from '@web-ui/components/common/particles/button'

export default {
  title: 'page-previews/settings',
}

export const Primary = () => {
  return (
    <Template
      slot_header={
        <SimpleBackArrowHeader
          title="Settings"
          back_href=""
          is_transparent_on_desktop={true}
        />
      }
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
          <Box>
            <HeadingWithSubheading heading="Lorem" subheading="Ipsum" />
            <Input value="Lorem ipsum" on_change={() => {}} />
            <div>
              <Button size="default">Lorem</Button>
            </div>
          </Box>
          <Box>
            <HeadingWithSubheading heading="Lorem" subheading="Ipsum" />
            <Input value="Lorem ipsum" on_change={() => {}} />
            <div>
              <Button size="default">Lorem</Button>
            </div>
          </Box>
          <Box>
            <HeadingWithSubheading heading="Lorem" subheading="Ipsum" />
            <Input value="Lorem ipsum" on_change={() => {}} />
            <div>
              <Button size="default">Lorem</Button>
            </div>
          </Box>
          <Box>
            <HeadingWithSubheading heading="Lorem" subheading="Ipsum" />
            <Input value="Lorem ipsum" on_change={() => {}} />
            <div>
              <Button size="default">Lorem</Button>
            </div>
          </Box>
          <Box>
            <HeadingWithSubheading heading="Lorem" subheading="Ipsum" />
            <Input value="Lorem ipsum" on_change={() => {}} />
            <div>
              <Button size="default">Lorem</Button>
            </div>
          </Box>
        </>
      }
    />
  )
}
