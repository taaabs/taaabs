import { HeadingWithSubheading as UiAppAtom_HeadingWithSubheading } from '@web-ui/components/app/atoms/heading-with-subheading'
import { Button as UiCommonParticle_Button } from '@web-ui/components/common/particles/button'
import { useContext } from 'react'
import { AuthContext } from '@/app/auth-provider'
import { Dictionary } from '@/dictionaries/dictionary'
import { delete_account_modal_setter } from '@/modals/delete-account-modal-setter'
import { ModalContext } from '@/providers/modal-provider'
import { Settings_DataSourceImpl } from '@repositories/modules/settings/infrastructure/settings.data-source-impl'
import { Settings_RepositoryImpl } from '@repositories/modules/settings/infrastructure/settings.repository-impl'

export const SectionDeleteAccount: React.FC<{ dictionary: Dictionary }> = (
  props,
) => {
  const auth_context = useContext(AuthContext)!
  const modal_context = useContext(ModalContext)!

  return (
    <div>
      <UiAppAtom_HeadingWithSubheading
        heading={props.dictionary.settings.general.delete_account.heading.text}
        subheading={
          props.dictionary.settings.general.delete_account.heading.subtext
        }
      />
      <UiCommonParticle_Button
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
            auth_context.logout()
          }
          modal_context.set_modal_content({})
        }}
        is_danger={true}
      >
        {
          props.dictionary.settings.general.delete_account
            .delete_my_account_button_label
        }
      </UiCommonParticle_Button>
    </div>
  )
}
