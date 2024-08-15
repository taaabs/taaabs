import { StandardSection as UiSettings_StandardSection } from '@web-ui/components/settings/StandardSection'
import { Button as UiButton } from '@web-ui/components/Button'
import { useContext } from 'react'
import {
  AuthContext,
  GuestAuthDataLocalStorage,
} from '@/providers/AuthProvider'
import { Dictionary } from '@/dictionaries/dictionary'
import { delete_account_modal_setter } from '@/modals/delete-account/delete-account-modal-setter'
import { ModalContext } from '@/providers/ModalProvider'
import { Settings_DataSourceImpl } from '@repositories/modules/settings/infrastructure/settings.data-source-impl'
import { Settings_RepositoryImpl } from '@repositories/modules/settings/infrastructure/settings.repository-impl'
import { browser_storage } from '@/constants/browser-storage'
import Cookies from 'js-cookie'

export const SectionDeleteAccount: React.FC<{
  dictionary: Dictionary
  is_guest_account: boolean
}> = (props) => {
  const auth_context = useContext(AuthContext)
  const modal_context = useContext(ModalContext)

  return (
    <UiSettings_StandardSection
      heading={
        props.is_guest_account
          ? {
              text: props.dictionary.settings.general.delete_account
                .guest_heading.text,
              subtext:
                props.dictionary.settings.general.delete_account.guest_heading
                  .subtext,
            }
          : {
              text: props.dictionary.settings.general.delete_account.heading
                .text,
              subtext:
                props.dictionary.settings.general.delete_account.heading
                  .subtext,
            }
      }
      is_danger={true}
    >
      <UiButton
        on_click={async () => {
          const is_deletion_confirmed = await delete_account_modal_setter({
            dictionary: props.dictionary,
            modal_context,
          })
          if (is_deletion_confirmed) {
            const data_source = new Settings_DataSourceImpl(
              auth_context.ky_instance,
            )
            const repository = new Settings_RepositoryImpl(data_source)
            await repository.delete_account()
            // Guest auth data should be deleted if current user is a guest user
            const guest_auth_data = JSON.parse(
              localStorage.getItem(
                browser_storage.local_storage.guest_auth_data,
              ) || 'null',
            ) as GuestAuthDataLocalStorage | null
            if (
              guest_auth_data &&
              guest_auth_data.id == auth_context.auth_data?.id
            ) {
              localStorage.removeItem(
                browser_storage.local_storage.guest_auth_data,
              )
              Cookies.remove('guest_id')
            }
            auth_context.logout()
          } else {
            modal_context.close()
          }
        }}
        is_danger={true}
      >
        {
          props.dictionary.settings.general.delete_account
            .delete_my_account_button_label
        }
      </UiButton>
    </UiSettings_StandardSection>
  )
}
