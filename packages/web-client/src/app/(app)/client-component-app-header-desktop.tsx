'use client'

import { useParams, usePathname } from 'next/navigation'
import { PublicUserAvatarContext } from './public-user-avatar-provider'
import { useContext } from 'react'
import { ModalContext } from './modal-provider'
import { use_is_hydrated } from '@shared/hooks'
import { UserForHeader as UiAppMolecule_UserForHeader } from '@web-ui/components/app/molecules/user-for-header'
import { LogoForHeader as UiCommonAtoms_LogoForHeader } from '@web-ui/components/common/atoms/logo-for-header'
import { NavigationForHeader as UiAppMolecule_NavigationForHeader } from '@web-ui/components/app/molecules/navigation-for-header'
import { FormModal as UiAppTemplate_FormModal } from '@web-ui/components/app/templates/form-modal'
import { ModalHeader as UiAppAtom_ModalHeader } from '@web-ui/components/app/atoms/modal-header'
import { ModalFooter as UiAppAtom_ModalFooter } from '@web-ui/components/app/atoms/modal-footer'
import { Box as UiAppAtom_Box } from '@web-ui/components/app/atoms/box'
import { BoxHeading as UiAppAtom_BoxHeading } from '@web-ui/components/app/atoms/box-heading'
import { AppHeaderDesktop as UiAppTemplate_AppHeaderDesktop } from '@web-ui/components/app/templates/app-header-desktop'
import { DesktopUserAreaForAppHeader as UiAppOrganism_DesktopUserAreaForAppHeader } from '@web-ui/components/app/organisms/desktop-user-area-for-app-header'

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
      <UiAppMolecule_UserForHeader
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
    logo_slot = <UiCommonAtoms_LogoForHeader href="/" />
  }

  let navigation: UiAppMolecule_NavigationForHeader.Props['navigation']
  if (params.username) {
    navigation = [
      {
        label: 'Bookmarks',
        href: `/${params.username}`,
        is_active: pathname == `/${params.username}`,
      },
      {
        label: 'About',
        href: `/${params.username}/about`,
        is_active: pathname == `/${params.username}/about`,
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
    <UiAppTemplate_FormModal
      slot_header={<UiAppAtom_ModalHeader title="New bookmark" />}
      slot_footer={
        <UiAppAtom_ModalFooter
          button_label="Save"
          is_disabled={false}
          on_click_cancel={() => {}}
        />
      }
    >
      <UiAppAtom_Box>
        <UiAppAtom_BoxHeading heading="Lorem ipsum" subheading="Lorem ipsum" />
      </UiAppAtom_Box>
      <UiAppAtom_Box>
        <UiAppAtom_BoxHeading heading="Lorem ipsum" subheading="Lorem ipsum" />
      </UiAppAtom_Box>
      <UiAppAtom_Box>
        <UiAppAtom_BoxHeading heading="Lorem ipsum" subheading="Lorem ipsum" />
      </UiAppAtom_Box>
      <UiAppAtom_Box>
        <UiAppAtom_BoxHeading heading="Lorem ipsum" subheading="Lorem ipsum" />
      </UiAppAtom_Box>
      <UiAppAtom_Box>
        <UiAppAtom_BoxHeading heading="Lorem ipsum" subheading="Lorem ipsum" />
      </UiAppAtom_Box>
    </UiAppTemplate_FormModal>
  )

  return (
    <UiAppTemplate_AppHeaderDesktop
      slot_left_side_logo={logo_slot}
      slot_left_side_navigation={
        <UiAppMolecule_NavigationForHeader navigation={navigation} />
      }
      slot_right_side={
        <UiAppOrganism_DesktopUserAreaForAppHeader
          on_click_add={() => {
            modal?.set_modal(create_bookmark_modal)
          }}
          on_click_search={() => {}}
        />
      }
    />
  )
}
