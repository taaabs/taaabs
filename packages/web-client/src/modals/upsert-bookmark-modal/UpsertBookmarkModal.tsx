import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { system_values } from '@shared/constants/system-values'
import { useContext, useEffect, useRef, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Modal as UiModal } from '@web-ui/components/Modal'
import { Header as UiModal_Header } from '@web-ui/components/Modal/Header'
import { Footer as UiModal_Footer } from '@web-ui/components/Modal/Footer'
import { Content as UiModal_Content } from '@web-ui/components/Modal/Content'
import { Centered as UiModal_Content_Centered } from '@web-ui/components/Modal/Content/Centered'
import { Standard as UiModal_Content_Standard } from '@web-ui/components/Modal/Content/Standard'
import { StandardSplit as UiModal_Content_StandardSplit } from '@web-ui/components/Modal/Content/StandardSplit'
import { Divider as UiModal_Content_Divider } from '@web-ui/components/Modal/Content/Divider'
import { Input as UiCommonAtoms_Input } from '@web-ui/components/common/atoms/input'
import { DraggableUpsertFormLinks as UiAppAtom_DraggableUpsertFormLinks } from '@web-ui/components/app/atoms/draggable-upsert-form-links'
import { FormControllerFix as UiCommonTemplate_FormControllerFix } from '@web-ui/components/common/templates/form-controller-fix'
import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { SegmentedButton as UiCommon_SegmentedButton } from '@web-ui/components/common/SegmentedButton'
import { is_url_valid } from '@shared/utils/is-url-valid/is-url-valid'
import { Dictionary } from '@/dictionaries/dictionary'
import { HtmlParser } from '@shared/utils/html-parser'

import { Tags_DataSourceImpl } from '@repositories/modules/tags/infrastructure/tags.data-source-impl'
import { AuthContext } from '@/app/auth-provider'
import { Tags_RepositoryImpl } from '@repositories/modules/tags/infrastructure/tags.repository-impl'
import { Tags_Ro } from '@repositories/modules/tags/domain/tags.ro'
import { ModalContext } from '@/providers/modal-provider'
import { TagsInput as UiAppLibrary_TagsInput } from '@web-ui/components/app/library/TagsInput'

type FormValues = {
  title?: string
  note?: string
}

// Data from fragment.
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

type ClipboardData = {
  html: string
  favicon?: string
  og_image?: string
}

export const UpsertBookmarkModal: React.FC<UpsertBookmarkModal.Props> = (
  props,
) => {
  const modal_context = useContext(ModalContext)!
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isSubmitted, isSubmitSuccessful },
  } = useForm<FormValues>({ mode: 'onBlur' })
  const auth_context = useContext(AuthContext)!
  const [is_bookmark_public, set_is_bookmark_public] = useState(
    props.bookmark?.is_public,
  )
  const [clipboard_url, set_clipboard_url] = useState<string>()
  const [clipboard_data, set_clipboard_data] = useState<ClipboardData>()
  const cover_paste_area = useRef<HTMLDivElement>(null)
  const file_input = useRef<HTMLInputElement>(null)
  const [cover, set_cover] = useState<string>() // Base64 encoded webp.
  const [is_fetching_my_tags, set_is_fetching_my_tags] = useState<boolean>()
  const [my_tags, set_my_tags] = useState<Tags_Ro>()

  const handle_file_select = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (!input.files) {
      return
    }
    const file = input.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = async function () {
      const img = document.createElement('img')
      img.src = reader.result as string

      await new Promise((resolve) => {
        img.onload = resolve
      })

      const original_width = img.width
      const original_height = img.height

      const canvas = document.createElement('canvas')
      canvas.width = original_width
      canvas.height = original_height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, original_width, original_height)
      set_cover(canvas.toDataURL('image/webp'))
    }
  }

  const handle_paste_area_paste = (event: ClipboardEvent) => {
    const items = event.clipboardData?.items
    let blob: File | null = null

    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') === 0) {
          blob = items[i].getAsFile()
        }
      }
    }

    if (blob) {
      const reader = new FileReader()
      // reader.onload = function (event: ProgressEvent<FileReader>) {
      //   if (event.target && event.target.result) {
      //     preview.src = event.target.result as string;
      //   }
      // }
      reader.readAsDataURL(blob)

      // Create a new File object to set the file input value
      const file = new File([blob], 'pasted-image.png', { type: blob.type })
      const dataTransfer = new DataTransfer()
      dataTransfer.items?.add(file)
      file_input.current!.files = dataTransfer.files
      file_input.current!.dispatchEvent(new Event('change'))
    }
  }

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
    let og_image: string | undefined = undefined
    if (clipboard_data?.og_image) {
      const img = document.createElement('img')
      img.src = clipboard_data.og_image

      await new Promise((resolve) => {
        img.onload = resolve
      })

      const original_width = img.width
      const original_height = img.height

      const canvas = document.createElement('canvas')
      canvas.width = original_width
      canvas.height = original_height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, original_width, original_height)
      og_image = canvas.toDataURL('image/webp')
    }

    const bookmark: UpsertBookmark_Params = {
      bookmark_id: props.bookmark?.id,
      is_public: is_bookmark_public || false,
      title: form_data.title?.trim() || undefined,
      note: form_data.note?.trim() || undefined,
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
          const favicon = clipboard_data?.favicon
            ? clipboard_data.favicon.replace('data:image/webp;base64,', '')
            : undefined
          const reader_data =
            props.bookmark_autofill?.links &&
            props.bookmark_autofill.links.length &&
            props.bookmark_autofill.links[0].url == link.url
              ? clipboard_data
                ? HtmlParser.parse({
                    url: link.url,
                    html: clipboard_data.html,
                  })?.reader_data
                : undefined
              : undefined
          return {
            url: link.url,
            is_public: (is_bookmark_public ? link.is_public : false) || false, // TODO: make is public optional.
            site_path: link.site_path,
            is_pinned: current_link?.is_pinned,
            pin_title: current_link?.pin_title,
            open_snapshot: link.open_snapshot,
            favicon: favicon || current_link?.favicon,
            reader_data,
          }
        }),
      ),
      tags: tags.map((tag) => ({
        name: tag.name,
        is_public: (is_bookmark_public ? tag.is_public : false) || false, // TODO: make is public optional.
      })),
      cover: cover?.split(',')[1] || og_image?.split(',')[1],
      cover_hash: props.bookmark?.cover_hash,
      has_cover_aes: props.bookmark?.has_cover_aes,
    }
    props.on_submit(bookmark)
  }

  useEffect(() => {
    navigator.clipboard
      .readText()
      .then((value) => {
        if (props.bookmark_autofill) {
          const clipboard_data: ClipboardData = JSON.parse(value)
          set_clipboard_data(clipboard_data)
          // Temporary solution for getting accurate title from various sources.
          // ChatGPT provides default title after reload.
          // Claude never provides default title.
          if (
            props.bookmark_autofill.links?.[0].url.startsWith(
              'https://chatgpt.com/',
            )
          ) {
            const temp_el = document.createElement('div')
            temp_el.innerHTML = clipboard_data.html
            const title = temp_el.querySelector<HTMLElement>(
              '.bg-token-sidebar-surface-secondary.active\\:opacity-90.rounded-lg.relative.group > .p-2.gap-2.items-center.flex',
            )?.innerText
            if (title) {
              setValue('title', title)
            }
          } else if (
            props.bookmark_autofill.links?.[0].url.startsWith(
              'https://claude.ai/chat/',
            )
          ) {
            const temp_el = document.createElement('div')
            temp_el.innerHTML = clipboard_data.html
            const title = temp_el.querySelector<HTMLElement>(
              '.tracking-tight.font-normal.font-tiempos.truncate',
            )?.innerText
            if (title) {
              setValue('title', title)
            }
          } else if (
            props.bookmark_autofill.links?.[0].url.startsWith(
              'https://coral.cohere.com/c/',
            )
          ) {
            const temp_el = document.createElement('div')
            temp_el.innerHTML = clipboard_data.html
            const title = temp_el.querySelector<HTMLElement>(
              '.truncate.font-body.text-p-lg',
            )?.innerText
            if (title) {
              setValue('title', title)
            }
          } else if (
            props.bookmark_autofill.links?.[0].url.startsWith(
              'https://gemini.google.com/app/',
            )
          ) {
            const temp_el = document.createElement('div')
            temp_el.innerHTML = clipboard_data.html
            const title = temp_el.querySelector<HTMLElement>(
              '.selected.ng-star-inserted.conversation.mat-mdc-tooltip-trigger > .gmat-body-1.conversation-title',
            )?.innerText
            if (title) {
              setValue('title', title)
            }
          }
        } else if (is_url_valid(value)) {
          set_clipboard_url(value)
        }
      })
      .catch(() => {})

    const handle_paste_area_focus = () => {
      cover_paste_area.current?.focus()
    }

    file_input.current?.addEventListener('change', handle_file_select)
    // cover_paste_area.current?.addEventListener('click', handle_paste_area_focus)
    cover_paste_area.current?.addEventListener('paste', handle_paste_area_paste)

    return () => {
      file_input.current?.removeEventListener('change', handle_file_select)
      cover_paste_area.current?.removeEventListener(
        'click',
        handle_paste_area_focus,
      )
      cover_paste_area.current?.removeEventListener(
        'paste',
        handle_paste_area_paste,
      )
    }
  }, [])

  // const fetch_suggested_tags = async (selected_tags: number[]) => {
  //   const data_source = new Tags_DataSourceImpl(auth_context.ky_instance)
  //   const repository = new Tags_RepositoryImpl(data_source)
  //   const result = await repository.suggested({ selected_tags })
  //   if (result.frequent.length && result.recent.length) {
  //     set_suggested_tags([result, ...suggested_tags])
  //   }
  // }

  const content = (
    <UiModal_Content>
      <UiModal_Content_Centered
        label={props.dictionary.app.upsert_modal.visibility}
      >
        <div style={{ width: '200px' }}>
          <UiCommon_SegmentedButton
            items={[
              {
                label: props.dictionary.app.upsert_modal.private,
                is_selected: !is_bookmark_public,
              },
              {
                label: props.dictionary.app.upsert_modal.public,
                is_selected: is_bookmark_public || false,
              },
            ]}
            on_item_click={(selected_idx) => {
              if (selected_idx == 0) {
                set_is_bookmark_public(false)
              } else {
                set_is_bookmark_public(true)
              }
            }}
          />
        </div>
      </UiModal_Content_Centered>

      <UiModal_Content_Standard label={props.dictionary.app.upsert_modal.links}>
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
      </UiModal_Content_Standard>

      <UiModal_Content_Divider />

      <UiModal_Content_StandardSplit
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
                <UiCommonAtoms_Input
                  value={field.value || ''}
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
      </UiModal_Content_StandardSplit>

      <UiModal_Content_Divider />

      <UiModal_Content_StandardSplit
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
                <UiCommonAtoms_Input
                  value={field.value || ''}
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
      </UiModal_Content_StandardSplit>

      <UiModal_Content_Divider />

      <UiModal_Content_StandardSplit
        label={props.dictionary.app.upsert_modal.tags}
      >
        <UiAppLibrary_TagsInput
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
          on_focus={async () => {
            if (my_tags !== undefined || is_fetching_my_tags) return

            set_is_fetching_my_tags(true)
            const data_source = new Tags_DataSourceImpl(
              auth_context.ky_instance,
            )
            const repository = new Tags_RepositoryImpl(data_source)
            const result = await repository.tags(
              auth_context.auth_data!.encryption_key,
            )
            set_is_fetching_my_tags(false)
            set_my_tags(result)
          }}
          translations={{
            enter_tag_name: props.dictionary.app.upsert_modal.enter_tag_name,
            add: props.dictionary.app.upsert_modal.tags_dropdown.add,
          }}
        />
      </UiModal_Content_StandardSplit>

      <UiModal_Content_Divider />

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      {/* <UiModal_Content_StandardSplit
        label={props.dictionary.app.upsert_modal.cover}
      >
        {(cover || clipboard_data?.og_image || props.bookmark?.cover) && (
          <img
            src={
              cover ||
              clipboard_data?.og_image ||
              (props.bookmark?.cover &&
                `data:image/webp;base64,${props.bookmark?.cover}`)
            }
            width={156}
            height={82}
          />
        )}
        <input type="file" ref={file_input} accept="image/png, image/jpeg" />
        <br />
        <div ref={cover_paste_area}>
          Click here and press Ctrl+V to paste an image
        </div>
      </UiModal_Content_StandardSplit> */}
    </UiModal_Content>
  )

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
    />
  )

  return (
    <UiModal
      is_open={modal_context.is_open}
      is_dismissible={!(isSubmitting || (isSubmitted && isSubmitSuccessful))}
      on_close={props.on_close}
      width={600}
      slot_header={header}
      slot_content={content}
      slot_footer={footer}
    />
  )
}
