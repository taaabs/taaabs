'use client'

import { Ui } from '@web-ui'
import { useParams, usePathname } from 'next/navigation'
import { PublicUserAvatarContext } from './public-user-avatar-provider'
import { useContext } from 'react'
import { ModalContext } from './modal-provider'
import { use_is_hydrated } from '@shared/hooks'

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
      <Ui.App.Molecules.UserForHeader
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
    logo_slot = <Ui.Common.Atoms.LogoForHeader href="/" />
  }

  let navigation: Ui.App.Molecules.NavigationForHeader.Props['navigation']
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
    <Ui.App.Templates.FormModal
      slot_header={<Ui.App.Atoms.ModalHeader title="New bookmark" />}
      slot_footer={
        <Ui.App.Atoms.ModalFooter
          button_label="Save"
          is_disabled={false}
          on_click_cancel={() => {}}
        />
      }
    >
      <Ui.App.Atoms.Box>
        <Ui.App.Atoms.BoxHeading
          heading="Lorem ipsum"
          subheading="Lorem ipsum"
        />
      </Ui.App.Atoms.Box>
      <Ui.App.Atoms.Box>
        <Ui.App.Atoms.BoxHeading
          heading="Lorem ipsum"
          subheading="Lorem ipsum"
        />
      </Ui.App.Atoms.Box>
      <Ui.App.Atoms.Box>
        <Ui.App.Atoms.BoxHeading
          heading="Lorem ipsum"
          subheading="Lorem ipsum"
        />
      </Ui.App.Atoms.Box>
      <Ui.App.Atoms.Box>
        <Ui.App.Atoms.BoxHeading
          heading="Lorem ipsum"
          subheading="Lorem ipsum"
        />
      </Ui.App.Atoms.Box>
      <Ui.App.Atoms.Box>
        <Ui.App.Atoms.BoxHeading
          heading="Lorem ipsum"
          subheading="Lorem ipsum"
        />
      </Ui.App.Atoms.Box>
    </Ui.App.Templates.FormModal>
  )

  return (
    <Ui.App.Templates.AppHeaderDesktop
      slot_left_side_logo={logo_slot}
      slot_left_side_navigation={
        <Ui.App.Molecules.NavigationForHeader navigation={navigation} />
      }
      slot_right_side={
        <Ui.App.Organisms.DesktopUserAreaForAppHeader
          on_click_add={() => {
            modal?.set_modal(create_bookmark_modal)
          }}
          on_click_search={() => {}}
        />
      }
    />
  )
}
