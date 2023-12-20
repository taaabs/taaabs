'use client'

import { NavigationForHeader } from '@web-ui/components/app/molecules/navigation-for-header'
import { UserForHeader } from '@web-ui/components/app/molecules/user-for-header'
import { DesktopUserAreaForAppHeader } from '@web-ui/components/app/organisms/desktop-user-area-for-app-header'
import { AppHeaderDesktop } from '@web-ui/components/app/templates/app-header-desktop'
import { LogoForHeader } from '@web-ui/components/common/atoms/logo-for-header'
import { useParams, usePathname } from 'next/navigation'
import { PublicUserAvatarContext } from './public-user-avatar-provider'
import { useContext } from 'react'
import { ModalContext } from './modal-provider'
import { use_is_hydrated } from '@shared/hooks'
import { FormModal } from '@web-ui/components/app/templates/form-modal'
import { ModalHeader } from '@web-ui/components/app/atoms/modal-header'
import { ModalFooter } from '@web-ui/components/app/atoms/modal-footer'
import { BoxHeading } from '@web-ui/components/app/atoms/box-heading'
import { Box } from '@web-ui/components/app/atoms/box'

export const ClientComponentAppHeaderDesktop: React.FC = () => {
  const params = useParams()
  const pathname = usePathname()
  const public_user_avatar = useContext(PublicUserAvatarContext)
  const modal = useContext(ModalContext)
  const is_hydrated = use_is_hydrated()

  let logo_slot: JSX.Element
  // TODO: backHref should be smarter :^)
  if (params.username) {
    logo_slot = (
      <UserForHeader
        user={{
          username: params.username as string,
          back_href: '/',
          avatar: public_user_avatar?.avatar
            ? {
                url: public_user_avatar.avatar.url,
                blurhash: public_user_avatar.avatar.blurhash,
              }
            : undefined,
        }}
        is_loading_avatar={!is_hydrated}
      />
    )
  } else {
    logo_slot = <LogoForHeader href="/" />
  }

  let navigation: NavigationForHeader.Props['navigation']
  if (params.username) {
    navigation = [
      {
        label: 'Profile',
        href: `/${params.username}`,
        is_active: pathname == `/${params.username}`,
      },
      {
        label: 'Bookmarks',
        href: `/${params.username}/bookmarks`,
        is_active: pathname == `/${params.username}/bookmarks`,
      },
    ]
  } else {
    navigation = [
      {
        label: 'Home',
        href: '/home',
        is_active: pathname == '/home',
      },
      {
        label: 'Bookmarks',
        href: '/bookmarks',
        is_active: pathname == '/bookmarks',
      },
      {
        label: 'Notifications',
        href: '/notifications',
        is_active: pathname == '/notifications',
      },
    ]
  }

  const create_bookmark_modal = (
    <FormModal
      slot_header={<ModalHeader title="New bookmark" />}
      slot_footer={
        <ModalFooter
          button_label="Save"
          is_disabled={false}
          on_click_cancel={() => {}}
        />
      }
    >
      <Box>
        <BoxHeading heading="Lorem ipsum" subheading="Lorem ipsum" />
      </Box>
      <Box>
        <BoxHeading heading="Lorem ipsum" subheading="Lorem ipsum" />
      </Box>
      <Box>
        <BoxHeading heading="Lorem ipsum" subheading="Lorem ipsum" />
      </Box>
      <Box>
        <BoxHeading heading="Lorem ipsum" subheading="Lorem ipsum" />
      </Box>
      <Box>
        <BoxHeading heading="Lorem ipsum" subheading="Lorem ipsum" />
      </Box>
    </FormModal>
  )

  return (
    <AppHeaderDesktop
      slot_left_side_logo={logo_slot}
      slot_left_side_navigation={
        <NavigationForHeader navigation={navigation} />
      }
      slot_right_side={
        <DesktopUserAreaForAppHeader
          on_click_add={() => {
            modal?.set_modal(create_bookmark_modal)
          }}
          on_click_search={() => {}}
        />
      }
    />
  )
}
