import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { system_values } from '@shared/constants/system-values'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { FormModal as UiAppTemplate_FormModal } from '../../../web-ui/src/components/app/templates/form-modal'
import { ModalHeader as UiAppAtom_ModalHeader } from '../../../web-ui/src/components/app/atoms/modal-header'
import { ModalFooter as UiAppAtom_ModalFooter } from '../../../web-ui/src/components/app/atoms/modal-footer'
import { Input as UiCommonAtom_Input } from '../../../web-ui/src/components/common/atoms/input'
import { DraggableUpsertFormLinks as UiAppAtom_DraggableUpsertFormLinks } from '../../../web-ui/src/components/app/atoms/draggable-upsert-form-links'
import { DraggableUpsertFormTags as UiAppAtom_DraggableUpsertFormTags } from '../../../web-ui/src/components/app/atoms/draggable-upsert-form-tags'
import { FormControllerFix as UiCommonTemplate_FormControllerFix } from '@web-ui/components/common/templates/form-controller-fix'
import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { StandardSplit as UiAppModalSections_StandardSplit } from '@web-ui/components/app/modal-sections/standard-split'
import { Standard as UiAppModalSections_Standard } from '@web-ui/components/app/modal-sections/standard'
import { Centered as UiAppModalSections_Centered } from '@web-ui/components/app/modal-sections/centered'
import { SegmentedButton } from '@web-ui/components/app/atoms/segmented-button'
import { is_valid_url } from '@/utils/is-valid-url'

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
  }
}

export const UpsertBookmark: React.FC<UpsertBookmark.Props> = (props) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted, isSubmitSuccessful },
  } = useForm<FormValues>({ mode: 'all' })
  const [clipboard_url, set_clipboard_url] = useState<string>()

  const [links, set_links] = useState<
    {
      url: string
      site_path?: string
      is_public?: boolean
      via_wayback?: boolean
    }[]
  >(
    props.bookmark
      ? props.bookmark?.links.map((link) => ({
          url: link.url,
          site_path: link.site_path,
          is_public: link.is_public,
          via_wayback: link.via_wayback,
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
          via_wayback: link.via_wayback,
        }
      }),
      tags: tags.map((tag) => ({
        name: tag.name,
        is_public: (form_data.is_public ? tag.is_public : false) || false, // TODO: make is public optional.
      })),
    }
    props.on_submit(bookmark)
  }

  const handle_keyboard = (event: any) => {
    if (event.code == 'Escape') {
      props.on_close()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handle_keyboard)

    navigator.clipboard
      .readText()
      .then((text) => {
        if (is_valid_url(text)) {
          set_clipboard_url(text)
        }
      })
      .catch(() => {})

    return () => {
      window.removeEventListener('keydown', handle_keyboard)
    }
  }, [])

  return (
    <form
      onSubmit={handleSubmit(on_submit)}
      onKeyDown={(e) => {
        if (e.code == 'Enter') {
          e.preventDefault()
        }
      }}
    >
      <UiAppTemplate_FormModal
        slot_header={
          <UiAppAtom_ModalHeader
            title={
              props.action == 'update' ? 'Edit bookmark' : 'Create bookmark'
            }
          />
        }
        slot_footer={
          <UiAppAtom_ModalFooter
            on_click_cancel={props.on_close}
            button_label={props.action == 'update' ? 'Update' : 'Create'}
            is_disabled={isSubmitting || (isSubmitted && isSubmitSuccessful)}
          />
        }
      >
        <UiAppModalSections_Centered label="Visibility">
          <Controller
            name="is_public"
            control={control}
            defaultValue={props.bookmark?.is_public}
            render={({ field }) => {
              return (
                <div style={{ width: '200px' }}>
                  <SegmentedButton
                    items={[
                      { label: 'Private', is_selected: !field.value },
                      { label: 'Public', is_selected: field.value || false },
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
        </UiAppModalSections_Centered>

        <UiAppModalSections_Standard label="Links">
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
                      props.bookmark?.is_public == false
                        ? true
                        : link.is_public,
                    via_wayback: link.via_wayback,
                  }))}
                  on_change={(links) => {
                    set_links(
                      links.map((link) => ({
                        url: link.url,
                        site_path: link.site_path,
                        is_public: link.is_public,
                        via_wayback: link.via_wayback,
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
                    enter_url: 'Enter URL',
                    add: 'Add',
                    open: 'Open...',
                    original_url: 'Original URL',
                    snapshot: 'Snapshot via Archive.org',
                    visibility: 'Visibility',
                    private: 'Private',
                    public: 'Public',
                  }}
                />
              )
            }}
          />
        </UiAppModalSections_Standard>

        <UiAppModalSections_StandardSplit label="Title">
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
                  error_message = `Title should be no longer than ${system_values.bookmark.title.max_length} characters.`
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
                    placeholder="Enter title"
                  />
                )
              }}
            />
          </UiCommonTemplate_FormControllerFix>
        </UiAppModalSections_StandardSplit>

        <UiAppModalSections_StandardSplit label="Note">
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
                  error_message = `Note should be no longer than ${system_values.bookmark.note.max_length} characters.`
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
                    placeholder="Type something"
                  />
                )
              }}
            />
          </UiCommonTemplate_FormControllerFix>
        </UiAppModalSections_StandardSplit>

        <UiAppModalSections_StandardSplit label="Tags">
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
                    enter_tag_name: 'Enter tag name',
                    add: 'Add',
                    private: 'Private',
                    public: 'Public',
                    visibility: 'Visibility',
                  }}
                />
              )
            }}
          />
        </UiAppModalSections_StandardSplit>
      </UiAppTemplate_FormModal>
    </form>
  )
}
