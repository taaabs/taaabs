import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { system_values } from '@shared/constants/system-values'
import { useContext, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Modal as UiModal } from '@web-ui/components/Modal'
import { Header as UiModal_Header } from '@web-ui/components/Modal/Header'
import { Footer as UiModal_Footer } from '@web-ui/components/Modal/Footer'
import { UpsertBookmarkContent as UiModal_UpsertBookmarkContent } from '@web-ui/components/Modal/UpsertBookmarkContent'
import { Section as UiModal_UpsertBookmarkContent_Section } from '@web-ui/components/Modal/UpsertBookmarkContent/Section'
import { Input as UiInput } from '@web-ui/components/Input'
import { DraggableUpsertFormLinks as Ui_Modal_UpsertBookmarkContent_Section_DraggableUpsertFormLinks } from '@web-ui/components/Modal/UpsertBookmarkContent/Section/DraggableUpsertFormLinks'
import { FormControllerFix as UiCommonTemplate_FormControllerFix } from '@web-ui/components/common/templates/form-controller-fix'
import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { is_url_valid } from '@shared/utils/is-url-valid/is-url-valid'
import { Dictionary } from '@/dictionaries/dictionary'
import { Tags_DataSourceImpl } from '@repositories/modules/tags/infrastructure/tags.data-source-impl'
import { AuthContext } from '@/providers/AuthProvider'
import { Tags_RepositoryImpl } from '@repositories/modules/tags/infrastructure/tags.repository-impl'
import { Tags_Ro } from '@repositories/modules/tags/domain/tags.ro'
import { ModalContext } from '@/providers/ModalProvider'
import { TagsInput as Ui_app_library_TagsInput } from '@web-ui/components/app/library/TagsInput'
import { Checkbox as Ui_Checkbox } from '@web-ui/components/Checkbox'
import equal from 'fast-deep-equal'

type FormValues = {
  title?: string
  note?: string
}

// Data from fragment
type BookmarkAutofill = {
  title?: string
  note?: string
  links?: {
    url: string
    site_path?: string
  }[]
  tags?: string[]
}

export namespace UpsertBookmarkModal {
  export type Props = {
    bookmark?: Bookmark_Entity
    bookmark_autofill?: BookmarkAutofill
    is_archived?: boolean
    on_submit: (bookmark: UpsertBookmark_Params) => void
    on_close: () => void
    action: 'create' | 'update'
    dictionary: Dictionary
  }
}

export const UpsertBookmarkModal: React.FC<UpsertBookmarkModal.Props> = (
  props,
) => {
  const modal_context = useContext(ModalContext)
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isSubmitted, isSubmitSuccessful },
  } = useForm<FormValues>({ mode: 'onBlur' })
  const auth_context = useContext(AuthContext)
  const [is_bookmark_public, set_is_bookmark_public] = useState(
    props.bookmark?.is_public,
  )
  const [clipboard_url, set_clipboard_url] = useState<string>()
  const [is_fetching_my_tags, set_is_fetching_my_tags] = useState<boolean>()
  const [my_tags, set_my_tags] = useState<Tags_Ro>()

  const [links, set_links] = useState<
    {
      url: string
      site_path?: string
      is_public?: boolean
      open_snapshot?: boolean
    }[]
  >(
    props.bookmark
      ? props.bookmark?.links.map((link) => ({
          url: link.url,
          site_path: link.site_path,
          is_public: link.is_public,
          open_snapshot: link.open_snapshot,
        }))
      : props.bookmark_autofill && props.bookmark_autofill.links
      ? props.bookmark_autofill.links.map(({ url }) => ({
          url,
          is_public: true,
        }))
      : [],
  )
  const [tags, set_tags] = useState<{ name: string; is_public?: boolean }[]>(
    props.bookmark
      ? props.bookmark?.tags.map((tag) => ({
          name: tag.name,
          is_public: tag.is_public,
        }))
      : props.bookmark_autofill && props.bookmark_autofill.tags
      ? props.bookmark_autofill.tags.map((name) => ({
          name,
          is_public: true,
        }))
      : [],
  )

  const on_submit: SubmitHandler<FormValues> = async (form_data) => {
    let bookmark: UpsertBookmark_Params

    if (!props.bookmark || is_bookmark_public != props.bookmark?.is_public) {
      // New bookmark or visibility changed, send whole bookmark
      bookmark = {
        bookmark_id: props.bookmark?.id,
        is_public: is_bookmark_public || false,
        title: form_data.title?.trim(),
        note: form_data.note?.trim(),
        created_at: props.bookmark?.created_at
          ? new Date(props.bookmark.created_at)
          : undefined,
        stars: props.bookmark?.stars,
        is_archived: props.is_archived || false,
        is_unsorted: props.bookmark?.is_unsorted,
        links: await Promise.all(
          links.map(async (link) => {
            const current_link = props.bookmark?.links.find(
              (l) => l.url == link.url,
            )

            return {
              url: link.url,
              is_public: (is_bookmark_public ? link.is_public : false) || false, // TODO: make is public optional
              site_path: link.site_path,
              is_pinned: current_link?.is_pinned,
              pin_title: current_link?.pin_title,
              open_snapshot: link.open_snapshot,
            }
          }),
        ),
        tags: tags.map((tag) => ({
          name: tag.name,
          is_public: (is_bookmark_public ? tag.is_public : false) || false, // TODO: make is public optional
        })),
      }
    } else {
      const title =
        props.bookmark.title && !form_data.title
          ? ''
          : props.bookmark.title != form_data.title?.trim()
          ? form_data.title?.trim()
          : undefined
      const note =
        props.bookmark.note && !form_data.note
          ? ''
          : props.bookmark.note != form_data.note?.trim()
          ? form_data.note?.trim()
          : undefined

      const new_tags = tags.map((tag) => ({
        name: tag.name,
        is_public: (is_bookmark_public ? tag.is_public : false) || false, // TODO: make is public optional
      }))

      bookmark = {
        bookmark_id: props.bookmark.id,
        is_public: is_bookmark_public,
        title,
        note,
        links: await Promise.all(
          links.map(async (link) => {
            const current_link = props.bookmark?.links.find(
              (l) => l.url == link.url,
            )

            return {
              url: link.url,
              is_public: (is_bookmark_public ? link.is_public : false) || false, // TODO: make is public optional
              site_path: link.site_path,
              is_pinned: current_link?.is_pinned,
              pin_title: current_link?.pin_title,
              open_snapshot: link.open_snapshot,
            }
          }),
        ),
        tags: equal(
          new_tags,
          props.bookmark.tags.map((tag) => ({
            name: tag.name,
            is_public: tag.is_public,
          })),
        )
          ? undefined
          : new_tags,
      }
    }

    props.on_submit(bookmark)
  }

  useEffect(() => {
    navigator.clipboard
      .readText()
      .then((value) => {
        if (is_url_valid(value)) {
          set_clipboard_url(value)
        }
      })
      .catch(() => {})
  }, [])

  // Fetch tags for suggestions
  useEffect(() => {
    if (my_tags !== undefined || is_fetching_my_tags) return

    setTimeout(() => {
      set_is_fetching_my_tags(true)
      const data_source = new Tags_DataSourceImpl(auth_context.ky_instance)
      const repository = new Tags_RepositoryImpl(data_source)
      repository.tags(auth_context.auth_data!.encryption_key).then((result) => {
        set_is_fetching_my_tags(false)
        set_my_tags(result)
      })
    }, 0)
  }, [])

  const build_content = () => {
    const title_section = (
      <UiModal_UpsertBookmarkContent_Section
        label={props.dictionary.app.upsert_modal.title}
      >
        <UiCommonTemplate_FormControllerFix>
          <Controller
            name="title"
            control={control}
            defaultValue={
              props.bookmark
                ? props.bookmark.title
                : props.bookmark_autofill
                ? props.bookmark_autofill.title
                : undefined
            }
            rules={{
              maxLength: system_values.bookmark.title.max_length,
            }}
            render={({ field }) => {
              let error_message: string | undefined

              if (errors.title?.type == 'maxLength') {
                error_message =
                  props.dictionary.app.upsert_modal.error_title_too_long
              }

              return (
                <UiInput
                  value={field.value || ''}
                  on_change={(value) => {
                    if (!isSubmitting) {
                      field.onChange(value)
                    }
                  }}
                  message_type={error_message ? 'error' : undefined}
                  message={error_message}
                  min_lines={1}
                  placeholder={props.dictionary.app.upsert_modal.enter_title}
                />
              )
            }}
          />
        </UiCommonTemplate_FormControllerFix>
      </UiModal_UpsertBookmarkContent_Section>
    )

    const note_section = (
      <UiModal_UpsertBookmarkContent_Section
        label={props.dictionary.app.upsert_modal.note}
      >
        <UiCommonTemplate_FormControllerFix>
          <Controller
            name="note"
            control={control}
            defaultValue={
              props.bookmark
                ? props.bookmark?.note
                : props.bookmark_autofill
                ? props.bookmark_autofill.note
                : undefined
            }
            rules={{
              maxLength: system_values.bookmark.note.max_length,
            }}
            render={({ field }) => {
              let error_message: string | undefined

              if (errors.note?.type == 'maxLength') {
                error_message =
                  props.dictionary.app.upsert_modal.error_note_too_long
              }

              return (
                <UiInput
                  value={field.value || ''}
                  on_change={(value) => {
                    if (!isSubmitting) {
                      field.onChange(value)
                    }
                  }}
                  message_type={error_message ? 'error' : undefined}
                  message={error_message}
                  min_lines={3}
                  placeholder={
                    props.dictionary.app.upsert_modal.jot_something_down
                  }
                  is_note={true}
                />
              )
            }}
          />
        </UiCommonTemplate_FormControllerFix>
      </UiModal_UpsertBookmarkContent_Section>
    )

    const tags_section = (
      <UiModal_UpsertBookmarkContent_Section
        label={props.dictionary.app.upsert_modal.tags}
      >
        <Ui_app_library_TagsInput
          selected_tags={tags.map((tag) => ({
            name: tag.name,
            is_public:
              props.bookmark?.is_public == false ? true : tag.is_public,
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
            set_tags(
              updated_tags.map((tag) => ({
                name: tag.name,
                is_public: tag.is_public,
              })),
            )
          }}
          is_visibility_toggleable={is_bookmark_public || false}
          max_tags={system_values.bookmark.tags.limit}
          translations={{
            enter_tag_name: props.dictionary.app.upsert_modal.enter_tag_name,
            add: props.dictionary.app.upsert_modal.tag_suggestions.add,
            recent_tags:
              props.dictionary.app.upsert_modal.tag_suggestions.recent_tags,
          }}
        />
      </UiModal_UpsertBookmarkContent_Section>
    )

    const links_section = (
      <UiModal_UpsertBookmarkContent_Section
        label={props.dictionary.app.upsert_modal.links}
      >
        <Ui_Modal_UpsertBookmarkContent_Section_DraggableUpsertFormLinks
          links={links.map((link) => ({
            url: link.url,
            site_path: link.site_path,
            is_public:
              props.bookmark?.is_public == false ? true : link.is_public,
            open_snapshot: link.open_snapshot,
          }))}
          on_change={(links) => {
            set_links(
              links.map((link) => ({
                url: link.url,
                site_path: link.site_path,
                is_public: link.is_public,
                open_snapshot: link.open_snapshot,
              })),
            )
          }}
          show_visibility_toggler={is_bookmark_public || false}
          max_items={system_values.bookmark.links.limit}
          clipboard_url={clipboard_url}
          translations={{
            paste_url: props.dictionary.app.upsert_modal.paste_url,
            add: props.dictionary.app.upsert_modal.add_link,
            open: props.dictionary.app.upsert_modal.link.open,
            original_url: props.dictionary.app.upsert_modal.link.original_url,
            snapshot: props.dictionary.app.upsert_modal.link.snapshot,
            visibility: props.dictionary.app.upsert_modal.link.visibility,
            private: props.dictionary.app.upsert_modal.link.private,
            public: props.dictionary.app.upsert_modal.link.public,
            site: props.dictionary.app.upsert_modal.link.site,
          }}
        />
      </UiModal_UpsertBookmarkContent_Section>
    )

    return (
      <UiModal_UpsertBookmarkContent
        slot_title={title_section}
        slot_note={note_section}
        slot_tags={tags_section}
        slot_links={links_section}
      />
    )
  }

  const header = (
    <UiModal_Header
      title={
        props.action == 'update'
          ? props.dictionary.app.upsert_modal.edit_boomkark
          : props.dictionary.app.upsert_modal.create_bookmark
      }
      on_close={props.on_close}
    />
  )

  const footer = (
    <UiModal_Footer
      on_click_cancel={props.on_close}
      button_label={
        props.action == 'update'
          ? props.dictionary.app.upsert_modal.save_changes
          : props.dictionary.app.upsert_modal.create
      }
      is_disabled={isSubmitting || (isSubmitted && isSubmitSuccessful)}
      button_on_click={handleSubmit(on_submit)}
      translations={{
        cancel: props.dictionary.app.upsert_modal.cancel,
      }}
    >
      {auth_context.auth_data?.username && (
        <Ui_Checkbox
          label="Share to my public profile"
          is_checked={is_bookmark_public || false}
          on_click={() => {
            set_is_bookmark_public(!is_bookmark_public)
          }}
        />
      )}
    </UiModal_Footer>
  )

  return (
    <UiModal
      is_open={modal_context.is_open}
      is_dismissible={!(isSubmitting || (isSubmitted && isSubmitSuccessful))}
      on_close={props.on_close}
      width={900}
      slot_header={header}
      slot_content={build_content()}
      slot_footer={footer}
    />
  )
}
