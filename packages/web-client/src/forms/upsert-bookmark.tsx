import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { system_values } from '@shared/constants/system-values'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Content as UiCommonTemplate_Modal_Content } from '../../../web-ui/src/components/common/templates/modal/content'
import { Header as UiCommonTemplate_Modal_Content_Header } from '../../../web-ui/src/components/common/templates/modal/content/header'
import { Footer as UiCommonTemplate_Modal_Content_Footer } from '../../../web-ui/src/components/common/templates/modal/content/footer'
import { Input as UiCommonAtom_Input } from '../../../web-ui/src/components/common/atoms/input'
import { DraggableUpsertFormLinks as UiAppAtom_DraggableUpsertFormLinks } from '../../../web-ui/src/components/app/atoms/draggable-upsert-form-links'
import { DraggableUpsertFormTags as UiAppAtom_DraggableUpsertFormTags } from '../../../web-ui/src/components/app/atoms/draggable-upsert-form-tags'
import { FormControllerFix as UiCommonTemplate_FormControllerFix } from '@web-ui/components/common/templates/form-controller-fix'
import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { StandardSplit as UiCommonTemplate_Modal_Content_Sections_StandardSplit } from '../../../web-ui/src/components/common/templates/modal/content/sections/standard-split'
import { Standard as UiCommonTemplate_Modal_Content_Sections_Standard } from '../../../web-ui/src/components/common/templates/modal/content/sections/standard'
import { Centered as UiCommonTemplate_Modal_Content_Sections_Centered } from '../../../web-ui/src/components/common/templates/modal/content/sections/centered'
import { Divider as UiCommonTemplate_Modal_Content_Sections_Divider } from '../../../web-ui/src/components/common/templates/modal/content/sections/divider'
import { SegmentedButton } from '@web-ui/components/app/atoms/segmented-button'
import { is_url_valid } from '@shared/utils/is-url-valid/is-url-valid'
import { Dictionary } from '@/dictionaries/dictionary'

type FormValues = {
  title: string
  note: string
  is_public?: boolean
}

// Data from a fragment.
type BookmarkAutofill = {
  title?: string
  note?: string
  links?: {
    url: string
    site_path?: string
  }[]
  tags?: string[]
}

export namespace UpsertBookmark {
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

export const UpsertBookmark: React.FC<UpsertBookmark.Props> = (props) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted, isSubmitSuccessful },
  } = useForm<FormValues>({ mode: 'onBlur' })
  const [clipboard_url, set_clipboard_url] = useState<string>()

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
    const bookmark: UpsertBookmark_Params = {
      bookmark_id: props.bookmark?.id,
      is_public:
        (form_data.is_public === undefined && props.bookmark?.is_public) ||
        form_data.is_public ||
        false,
      title: form_data.title,
      note: form_data.note || undefined,
      created_at: props.bookmark?.created_at
        ? new Date(props.bookmark.created_at)
        : undefined,
      stars: props.bookmark?.stars,
      is_archived: props.is_archived || false,
      is_unread: props.bookmark?.is_unread || false,
      links: links.map((link) => {
        const current_link = props.bookmark?.links.find(
          (l) => l.url == link.url,
        )
        return {
          url: link.url,
          is_public: (form_data.is_public ? link.is_public : false) || false, // TODO: make is public optional.
          site_path: link.site_path,
          is_pinned: current_link?.is_pinned,
          pin_title: current_link?.pin_title,
          open_snapshot: link.open_snapshot,
        }
      }),
      tags: tags.map((tag) => ({
        name: tag.name,
        is_public: (form_data.is_public ? tag.is_public : false) || false, // TODO: make is public optional.
      })),
    }
    props.on_submit(bookmark)
  }

  const handle_keyboard = (event: KeyboardEvent) => {
    if (event.code == 'Escape') {
      props.on_close()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handle_keyboard)
    return () => window.removeEventListener('keydown', handle_keyboard)
  }, [])

  useEffect(() => {
    navigator.clipboard
      .readText()
      .then((text) => {
        if (is_url_valid(text)) {
          set_clipboard_url(text)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <UiCommonTemplate_Modal_Content
      width={600}
      slot_header={
        <UiCommonTemplate_Modal_Content_Header
          title={
            props.action == 'update'
              ? props.dictionary.app.upsert_modal.edit_boomkark
              : props.dictionary.app.upsert_modal.create_bookmark
          }
        />
      }
      slot_footer={
        <UiCommonTemplate_Modal_Content_Footer
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
        />
      }
    >
      <UiCommonTemplate_Modal_Content_Sections_Centered
        label={props.dictionary.app.upsert_modal.visibility}
      >
        <Controller
          name="is_public"
          control={control}
          defaultValue={props.bookmark?.is_public}
          render={({ field }) => {
            return (
              <div style={{ width: '200px' }}>
                <SegmentedButton
                  items={[
                    {
                      label: props.dictionary.app.upsert_modal.private,
                      is_selected: !field.value,
                    },
                    {
                      label: props.dictionary.app.upsert_modal.public,
                      is_selected: field.value || false,
                    },
                  ]}
                  on_item_click={(selected_idx) => {
                    if (selected_idx == 0) {
                      field.onChange(false)
                    } else {
                      field.onChange(true)
                    }
                  }}
                />
              </div>
            )
          }}
        />
      </UiCommonTemplate_Modal_Content_Sections_Centered>

      <UiCommonTemplate_Modal_Content_Sections_Standard
        label={props.dictionary.app.upsert_modal.links}
      >
        <Controller
          name="is_public"
          control={control}
          defaultValue={props.bookmark?.is_public}
          render={({ field }) => {
            return (
              <UiAppAtom_DraggableUpsertFormLinks
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
                show_visibility_toggler={
                  (field.value === undefined && props.bookmark?.is_public) ||
                  field.value ||
                  false
                }
                max_items={system_values.bookmark.links.limit}
                clipboard_url={clipboard_url}
                translations={{
                  paste_url: props.dictionary.app.upsert_modal.paste_url,
                  add: props.dictionary.app.upsert_modal.add_link,
                  open: props.dictionary.app.upsert_modal.link.open,
                  original_url:
                    props.dictionary.app.upsert_modal.link.original_url,
                  snapshot: props.dictionary.app.upsert_modal.link.snapshot,
                  visibility: props.dictionary.app.upsert_modal.link.visibility,
                  private: props.dictionary.app.upsert_modal.link.private,
                  public: props.dictionary.app.upsert_modal.link.public,
                  site: props.dictionary.app.upsert_modal.link.site,
                }}
              />
            )
          }}
        />
      </UiCommonTemplate_Modal_Content_Sections_Standard>

      <UiCommonTemplate_Modal_Content_Sections_Divider />

      <UiCommonTemplate_Modal_Content_Sections_StandardSplit
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
                <UiCommonAtom_Input
                  value={field.value}
                  on_change={(value) => {
                    if (!isSubmitting) {
                      field.onChange(value)
                    }
                  }}
                  message_type={error_message ? 'error' : undefined}
                  message={error_message}
                  lines={2}
                  placeholder={props.dictionary.app.upsert_modal.enter_title}
                />
              )
            }}
          />
        </UiCommonTemplate_FormControllerFix>
      </UiCommonTemplate_Modal_Content_Sections_StandardSplit>

      <UiCommonTemplate_Modal_Content_Sections_Divider />

      <UiCommonTemplate_Modal_Content_Sections_StandardSplit
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
                <UiCommonAtom_Input
                  value={field.value}
                  on_change={(value) => {
                    if (!isSubmitting) {
                      field.onChange(value)
                    }
                  }}
                  message_type={error_message ? 'error' : undefined}
                  message={error_message}
                  lines={5}
                  placeholder={
                    props.dictionary.app.upsert_modal.jot_something_down
                  }
                  is_note={true}
                />
              )
            }}
          />
        </UiCommonTemplate_FormControllerFix>
      </UiCommonTemplate_Modal_Content_Sections_StandardSplit>

      <UiCommonTemplate_Modal_Content_Sections_Divider />

      <UiCommonTemplate_Modal_Content_Sections_StandardSplit
        label={props.dictionary.app.upsert_modal.tags}
      >
        <Controller
          name="is_public"
          control={control}
          defaultValue={props.bookmark?.is_public}
          render={({ field }) => {
            return (
              <UiAppAtom_DraggableUpsertFormTags
                tags={tags.map((tag) => ({
                  name: tag.name,
                  is_public:
                    props.bookmark?.is_public == false ? true : tag.is_public,
                }))}
                on_change={(tags) => {
                  set_tags(
                    tags.map((tag) => ({
                      name: tag.name,
                      is_public: tag.is_public,
                    })),
                  )
                }}
                show_visibility_toggler={
                  (field.value === undefined && props.bookmark?.is_public) ||
                  field.value ||
                  false
                }
                max_items={system_values.bookmark.tags.limit}
                translations={{
                  enter_tag_name:
                    props.dictionary.app.upsert_modal.enter_tag_name,
                  add: props.dictionary.app.upsert_modal.add_tag,
                  private: props.dictionary.app.upsert_modal.tag.private,
                  public: props.dictionary.app.upsert_modal.tag.public,
                  visibility: props.dictionary.app.upsert_modal.tag.visibility,
                }}
              />
            )
          }}
        />
      </UiCommonTemplate_Modal_Content_Sections_StandardSplit>
    </UiCommonTemplate_Modal_Content>
  )
}
