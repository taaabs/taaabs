import { Dictionary } from '@/dictionaries/dictionary'
import { Modal as Ui_Modal } from '@web-ui/components/Modal'
import { Header as Ui_Modal_Header } from '@web-ui/components/Modal/Header'
import { Footer as Ui_Modal_Footer } from '@web-ui/components/Modal/Footer'
import { Content as Ui_Modal_Content } from '@web-ui/components/Modal/Content'
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '@/providers/AuthProvider'
import { Tags_DataSourceImpl } from '@repositories/modules/tags/infrastructure/tags.data-source-impl'
import { Tags_RepositoryImpl } from '@repositories/modules/tags/infrastructure/tags.repository-impl'
import { Tags_Ro } from '@repositories/modules/tags/domain/tags.ro'
import { TagsInput as Ui_app_library_TagsInput } from '@web-ui/components/app/library/TagsInput'
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
  const auth_context = useContext(AuthContext)
  const [my_tags, set_my_tags] = useState<Tags_Ro>()
  const [selected_tags, set_selected_tags] = useState(props.tags)
  const [is_updating, set_is_updating] = useState<boolean>()

  useEffect(() => {
    const data_source = new Tags_DataSourceImpl(auth_context.ky_instance)
    const repository = new Tags_RepositoryImpl(data_source)
    repository.tags(auth_context.auth_data!.encryption_key).then((result) => {
      set_my_tags(result)
    })
  }, [])

  const content = (
    <Ui_Modal_Content>
      <Ui_app_library_TagsInput
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
    </Ui_Modal_Content>
  )

  const header = (
    <Ui_Modal_Header
      title={props.dictionary.app.edit_tags_modal.edit_tags}
      on_close={props.on_close}
    />
  )

  const footer = (
    <Ui_Modal_Footer
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
    <Ui_Modal
      is_dismissible={!is_updating}
      on_close={props.on_close}
      width={500}
      slot_header={header}
      slot_content={content}
      slot_footer={footer}
    />
  )
}
