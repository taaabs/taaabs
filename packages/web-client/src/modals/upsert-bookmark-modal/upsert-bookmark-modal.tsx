import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { system_values } from '@shared/constants/system-values'
import { useContext, useEffect, useRef, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Header as UiModal_Header } from '@web-ui/components/modal/Header'
import { Footer as UiModal_Footer } from '@web-ui/components/modal/Footer'
import { Content as UiModal_Content } from '@web-ui/components/modal/Content'
import { Centered as UiModal_Content_Centered } from '@web-ui/components/modal/Content/Centered'
import { Standard as UiModal_Content_Standard } from '@web-ui/components/modal/Content/Standard'
import { StandardSplit as UiModal_Content_StandardSplit } from '@web-ui/components/modal/Content/StandardSplit'
import { Divider as UiModal_Content_Divider } from '@web-ui/components/modal/Content/Divider'
import { Input as UiCommonAtoms_Input } from '@web-ui/components/common/atoms/input'
import { DraggableUpsertFormLinks as UiAppAtom_DraggableUpsertFormLinks } from '@web-ui/components/app/atoms/draggable-upsert-form-links'
import { DraggableUpsertFormTags as UiAppAtom_DraggableUpsertFormTags } from '@web-ui/components/app/atoms/draggable-upsert-form-tags'
import { FormControllerFix as UiCommonTemplate_FormControllerFix } from '@web-ui/components/common/templates/form-controller-fix'
import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { SegmentedButton as UiCommon_SegmentedButton } from '@web-ui/components/common/SegmentedButton'
import { is_url_valid } from '@shared/utils/is-url-valid/is-url-valid'
import { Dictionary } from '@/dictionaries/dictionary'
import { HtmlParser } from '@shared/utils/html-parser'
// import { Tags_DataSourceImpl } from '@repositories/modules/tags/infrastructure/tags.data-source-impl'
// import { AuthContext } from '@/app/auth-provider'
// import { Tags_RepositoryImpl } from '@repositories/modules/tags/infrastructure/tags.repository-impl'
// import { All_Ro } from '@repositories/modules/tags/domain/all.ro'
// import { Suggested_Ro } from '@repositories/modules/tags/domain/suggested.ro'
import {
  Content,
  Footer,
  Header,
  Portal,
  Sheet,
  detents,
} from 'react-sheet-slide'
import { ModalContext } from '@/providers/modal-provider'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

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

const cover_size = {
  width: 157 * 2,
  height: 82 * 2,
}

export const UpsertBookmarkModal: React.FC<UpsertBookmarkModal.Props> = (
  props,
) => {
  const ref = useRef(null)
  const [is_open, set_is_open] = useState(true)
  const modal_context = useContext(ModalContext)!
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isSubmitted, isSubmitSuccessful },
  } = useForm<FormValues>({ mode: 'onBlur' })
  // const auth_context = useContext(AuthContext)!
  const [is_bookmark_public, set_is_bookmark_public] = useState(
    props.bookmark?.is_public,
  )
  const [clipboard_url, set_clipboard_url] = useState<string>()
  const [clipboard_data, set_clipboard_data] = useState<ClipboardData>()
  const cover_paste_area = useRef<HTMLDivElement>(null)
  const file_input = useRef<HTMLInputElement>(null)
  const [cover, set_cover] = useState<string>() // Base64 encoded webp.
  // const [all_tags, set_all_tags] = useState<All_Ro>()
  // const [suggested_tags, set_suggested_tags] = useState<Suggested_Ro[]>([]) // We're leaving older suggestions, so users can still select from them.

  const handle_file_select = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (!input.files) {
      return
    }
    const file = input.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = async function () {
      const img = new Image()
      img.src = reader.result as string

      await new Promise((resolve) => {
        img.onload = resolve
      })

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      // Set the canvas dimensions
      const canvasWidth = cover_size.width
      const canvasHeight = cover_size.height
      canvas.width = canvasWidth
      canvas.height = canvasHeight

      // Calculate aspect ratio
      const originalWidth = img.width
      const originalHeight = img.height
      const canvasRatio = canvasWidth / canvasHeight
      const imageRatio = originalWidth / originalHeight

      // Determine the dimensions to draw the image
      let drawWidth, drawHeight, offsetX, offsetY

      if (canvasRatio > imageRatio) {
        // Canvas is wider relative to its height than the image
        drawWidth = canvasWidth
        drawHeight = canvasWidth / imageRatio
        offsetX = 0
        offsetY = (canvasHeight - drawHeight) / 2
      } else {
        // Canvas is taller relative to its width than the image
        drawWidth = canvasHeight * imageRatio
        drawHeight = canvasHeight
        offsetX = (canvasWidth - drawWidth) / 2
        offsetY = 0
      }

      // Draw the image onto the canvas
      ctx.drawImage(
        img,
        0,
        0,
        originalWidth,
        originalHeight, // Source rectangle
        offsetX,
        offsetY,
        drawWidth,
        drawHeight, // Destination rectangle
      )

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

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      // Set the canvas dimensions
      const canvasWidth = cover_size.width
      const canvasHeight = cover_size.height
      canvas.width = canvasWidth
      canvas.height = canvasHeight

      // Calculate aspect ratio
      const originalWidth = img.width
      const originalHeight = img.height
      const canvasRatio = canvasWidth / canvasHeight
      const imageRatio = originalWidth / originalHeight

      // Determine the dimensions to draw the image
      let drawWidth, drawHeight, offsetX, offsetY

      if (canvasRatio > imageRatio) {
        // Canvas is wider relative to its height than the image
        drawWidth = canvasWidth
        drawHeight = canvasWidth / imageRatio
        offsetX = 0
        offsetY = (canvasHeight - drawHeight) / 2
      } else {
        // Canvas is taller relative to its width than the image
        drawWidth = canvasHeight * imageRatio
        drawHeight = canvasHeight
        offsetX = (canvasWidth - drawWidth) / 2
        offsetY = 0
      }

      // Draw the image onto the canvas
      ctx.drawImage(
        img,
        0,
        0,
        originalWidth,
        originalHeight, // Source rectangle
        offsetX,
        offsetY,
        drawWidth,
        drawHeight, // Destination rectangle
      )

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
      cover:
        cover?.replace('data:image/webp;base64,', '') ||
        og_image?.replace('data:image/webp;base64,', '') ||
        props.bookmark?.cover,
    }
    props.on_submit(bookmark)
  }

  const handle_keyboard = (event: KeyboardEvent) => {
    if (event.code == 'Escape') {
      props.on_close()
    }
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
    cover_paste_area.current?.addEventListener('click', handle_paste_area_focus)
    cover_paste_area.current?.addEventListener('paste', handle_paste_area_paste)

    window.addEventListener('keydown', handle_keyboard)

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

      window.removeEventListener('keydown', handle_keyboard)
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

  useEffect(() => {
    // const fetch_all_tags = async () => {
    //   const data_source = new Tags_DataSourceImpl(auth_context.ky_instance)
    //   const repository = new Tags_RepositoryImpl(data_source)
    //   const result = await repository.all(
    //     auth_context.auth_data!.encryption_key,
    //   )
    //   set_all_tags(result)
    // }
    // fetch_all_tags()
    // fetch_suggested_tags(props.bookmark?.tags.map((tag) => tag.id) || [])
  }, [])

  useUpdateEffect(() => {
    set_is_open(false)
  }, [modal_context.close_trigger])

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

      <UiModal_Content_Standard
        label={props.dictionary.app.upsert_modal.links}
      >
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
        <UiAppAtom_DraggableUpsertFormTags
          tags={tags.map((tag) => ({
            name: tag.name,
            is_public:
              props.bookmark?.is_public == false ? true : tag.is_public,
          }))}
          on_change={(updated_tags) => {
            set_tags(
              updated_tags.map((tag) => ({
                name: tag.name,
                is_public: tag.is_public,
              })),
            )
            // if (updated_tags.length > tags.length) {
            //   const tag_ids: number[] = []
            //   updated_tags.forEach((tag) => {
            //     const tag_id = all_tags?.find((t) => t.name == tag.name)?.id
            //     if (tag_id) {
            //       tag_ids.push(tag_id)
            //     }
            //   })
            //   fetch_suggested_tags(tag_ids)
            // }
          }}
          show_visibility_toggler={is_bookmark_public || false}
          max_tags={system_values.bookmark.tags.limit}
          suggestions={
            // all_tags
            //   ? suggested_tags.map((item) => ({
            //       recent: item.recent
            //         .slice(0, 10)
            //         .map(
            //           (tag_id) =>
            //             all_tags.find((tag) => tag.id == tag_id)!.name,
            //         ),
            //       frequent: item.frequent
            //         .slice(0, 10)
            //         .map(
            //           (tag_id) =>
            //             all_tags.find((tag) => tag.id == tag_id)!.name,
            //         ),
            //     }))
            //   : []
            []
          }
          translations={{
            enter_tag_name: props.dictionary.app.upsert_modal.enter_tag_name,
            add: props.dictionary.app.upsert_modal.add_tag,
            private: props.dictionary.app.upsert_modal.tag.private,
            public: props.dictionary.app.upsert_modal.tag.public,
            visibility: props.dictionary.app.upsert_modal.tag.visibility,
          }}
        />
      </UiModal_Content_StandardSplit>

      <UiModal_Content_Divider />

      <UiModal_Content_StandardSplit
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
            width={cover_size.width / 2}
            height={cover_size.height / 2}
          />
        )}
        <input type="file" ref={file_input} accept="image/png, image/jpeg" />
        <br />
        <div ref={cover_paste_area}>
          Click here and press Ctrl+V to paste an image
        </div>
      </UiModal_Content_StandardSplit>
    </UiModal_Content>
  )

  const header = (
    <UiModal_Header
      title={
        props.action == 'update'
          ? props.dictionary.app.upsert_modal.edit_boomkark
          : props.dictionary.app.upsert_modal.create_bookmark
      }
      on_close_click={props.on_close}
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
    <Portal>
      <div
        style={
          {
            '--modal-width': '600px',
          } as any
        }
      >
        <Sheet
          ref={ref}
          open={is_open}
          onDismiss={() => {
            props.on_close()
          }}
          onClose={() => {
            // props.on_close()
            // console.log('2')
          }}
          selectedDetent={detents.fit}
          scrollingExpands={true}
          useDarkMode={false}
        >
          <Header>{header}</Header>
          <Content>{content}</Content>
          <Footer>{footer}</Footer>
        </Sheet>
      </div>
    </Portal>
  )
}
