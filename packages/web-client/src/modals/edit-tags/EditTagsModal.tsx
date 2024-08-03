import { Dictionary } from '@/dictionaries/dictionary'
import { Modal as UiModal } from '@web-ui/components/Modal'
import { Header as UiModal_Header } from '@web-ui/components/Modal/Header'
import { Footer as UiModal_Footer } from '@web-ui/components/Modal/Footer'
import { Content as UiModal_Content } from '@web-ui/components/Modal/Content'
import { useContext, useState, useEffect } from 'react'
import { ModalContext } from '@/providers/ModalProvider'
import { AuthContext } from '@/app/auth-provider'
import { Tags_DataSourceImpl } from '@repositories/modules/tags/infrastructure/tags.data-source-impl'
import { Tags_RepositoryImpl } from '@repositories/modules/tags/infrastructure/tags.repository-impl'
import { Tags_Ro } from '@repositories/modules/tags/domain/tags.ro'
import { TagsInput as UiAppLibrary_TagsInput } from '@web-ui/components/app/library/TagsInput'
import { system_values } from '@shared/constants/system-values'

namespace EditTagsModal {
  export type Props = {
    tags: { name: string; is_public?: boolean }[]
    is_visibility_toggleable: boolean
    on_submit: (tags: { name: string; is_public?: boolean }[]) => void
    on_close: () => void
    dictionary: Dictionary
  }
}

export const EditTagsModal: React.FC<EditTagsModal.Props> = (props) => {
  const modal_context = useContext(ModalContext)
  const auth_context = useContext(AuthContext)
  const [is_fetching_my_tags, set_is_fetching_my_tags] = useState<boolean>()
  const [my_tags, set_my_tags] = useState<Tags_Ro>()
  const [selected_tags, set_selected_tags] = useState(props.tags)
  const [is_updating, set_is_updating] = useState<boolean>()

  useEffect(() => {
    if (my_tags !== undefined || is_fetching_my_tags) return

    // Timeout prevents modal animation glitch.
    setTimeout(() => {
      set_is_fetching_my_tags(true)
      const data_source = new Tags_DataSourceImpl(auth_context.ky_instance)
      const repository = new Tags_RepositoryImpl(data_source)
      repository.tags(auth_context.auth_data!.encryption_key).then((result) => {
        set_is_fetching_my_tags(false)
        set_my_tags(result)
      })
    }, 150)
  }, [])

  const content = (
    <UiModal_Content>
      <UiAppLibrary_TagsInput
        selected_tags={selected_tags.map((tag) => ({
          name: tag.name,
          is_public: tag.is_public,
        }))}
        all_tags={
          my_tags?.all
            .map((tag) => tag.name)
            .sort((a, b) => a.localeCompare(b)) || []
        }
        recent_tags={
          my_tags?.recent_ids.map(
            (id) => my_tags.all.find((tag) => tag.id == id)!.name,
          ) || []
        }
        on_selected_tags_update={(updated_tags) => {
          set_selected_tags(
            updated_tags.map((tag) => ({
              name: tag.name,
              is_public: props.is_visibility_toggleable ? tag.is_public : false,
            })),
          )
        }}
        is_visibility_toggleable={props.is_visibility_toggleable}
        max_tags={system_values.bookmark.tags.limit}
        translations={{
          enter_tag_name: props.dictionary.app.upsert_modal.enter_tag_name,
          add: props.dictionary.app.upsert_modal.tag_suggestions.add,
          recent_tags:
            props.dictionary.app.upsert_modal.tag_suggestions.recent_tags,
        }}
      />
    </UiModal_Content>
  )

  const header = (
    <UiModal_Header
      title={props.dictionary.app.edit_tags_modal.edit_tags}
      on_close={props.on_close}
    />
  )

  const footer = (
    <UiModal_Footer
      button_label={props.dictionary.app.edit_tags_modal.update}
      is_disabled={is_updating}
      button_on_click={() => {
        set_is_updating(true)
        props.on_submit(selected_tags)
      }}
      on_click_cancel={props.on_close}
      translations={{
        cancel: props.dictionary.app.edit_tags_modal.cancel,
      }}
    />
  )

  return (
    <UiModal
      is_open={modal_context.is_open}
      is_dismissible={!is_updating}
      on_close={props.on_close}
      width={500}
      slot_header={header}
      slot_content={content}
      slot_footer={footer}
    />
  )
}
