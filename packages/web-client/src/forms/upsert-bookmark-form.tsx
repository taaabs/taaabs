import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { UpsertBookmark_UseCase } from '@repositories/modules/bookmarks/domain/usecases/upsert-bookmark.use-case'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { system_values } from '@shared/constants/system-values'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { FormModal } from '../../../web-ui/src/components/app/templates/form-modal'
import { ModalHeader } from '../../../web-ui/src/components/app/atoms/modal-header'
import { ModalFooter } from '../../../web-ui/src/components/app/atoms/modal-footer'
import { BoxHeading } from '../../../web-ui/src/components/app/atoms/box-heading'
import { FormRadio } from '../../../web-ui/src/components/app/templates/form-radio'
import { RadioSetting } from '../../../web-ui/src/components/app/atoms/radio-setting'
import { Box } from '../../../web-ui/src/components/app/atoms/box'
import { Input } from '../../../web-ui/src/components/common/atoms/input'
import { DraggableFormInputs } from '../../../web-ui/src/components/app/atoms/draggable-form-inputs'
import { FormControllerFix as UiCommonTemplate_FormControllerFix } from '@web-ui/components/common/templates/form-controller-fix'

type FormValues = {
  title: string
  links: string[]
  tags: string[]
  note: string
  is_public?: boolean
}

export const UpsertBookmarkForm: React.FC<{
  bookmark?: Bookmark_Entity
  is_archived?: boolean
  on_submit: (bookmark: Bookmark_Entity) => void
  on_close: () => void
  auth_token: string
  action: 'create' | 'update'
}> = (props) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted, isSubmitSuccessful },
  } = useForm<FormValues>({ mode: 'all' })
  const [links, set_links] = useState<{ url: string; is_public: boolean }[]>(
    props.bookmark?.links.map((link) => ({
      url: link.url,
      is_public: link.is_public,
    })) || [],
  )
  const [tags, set_tags] = useState<{ name: string; is_public: boolean }[]>(
    props.bookmark?.tags.map((tag) => ({
      name: tag.name,
      is_public: tag.is_public,
    })) || [],
  )

  const on_submit: SubmitHandler<FormValues> = async (form_data) => {
    const data_source = new Bookmarks_DataSourceImpl(
      process.env.NEXT_PUBLIC_API_URL,
      props.auth_token,
    )
    const repository = new Bookmarks_RepositoryImpl(data_source)
    const upsert_bookmark_use_case = new UpsertBookmark_UseCase(repository)

    const bookmark = await upsert_bookmark_use_case.invoke({
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
      links: links.map((link) => ({
        url: link.url,
        is_public: form_data.is_public ? link.is_public : false,
      })),
      tags: tags.map((tag) => ({
        name: tag.name,
        is_public: form_data.is_public ? tag.is_public : false,
      })),
    })
    props.on_submit(bookmark)
  }

  const handle_keyboard = (event: any) => {
    if (event.code == 'Escape') {
      props.on_close()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handle_keyboard)

    return () => {
      window.removeEventListener('keydown', handle_keyboard)
    }
  }, [])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        toast.promise(handleSubmit(on_submit), {
          pending: {
            render() {
              return 'Updading...'
            },
            icon: false,
          },
          success: {
            render() {
              return `Bookmark has been ${
                props.bookmark ? 'updated' : 'created'
              }`
            },
          },
          error: {
            render() {
              props.on_close()
              return 'Something went wrong... Try again later.'
            },
          },
        })
      }}
      onKeyDown={(e) => {
        if (e.code == 'Enter') {
          e.preventDefault()
        }
      }}
    >
      <FormModal
        slot_header={
          <ModalHeader
            title={
              props.action == 'update' ? 'Edit bookmark' : 'Create bookmark'
            }
          />
        }
        slot_footer={
          <ModalFooter
            on_click_cancel={props.on_close}
            button_label={props.action == 'update' ? 'Save' : 'Submit'}
            is_disabled={isSubmitting || (isSubmitted && isSubmitSuccessful)}
          />
        }
      >
        <Box>
          <BoxHeading heading="Visibility" />
          <Controller
            name="is_public"
            control={control}
            defaultValue={props.bookmark?.is_public}
            render={({ field }) => {
              return (
                <FormRadio>
                  <RadioSetting
                    top_line="Private"
                    bottom_line="All data is encrypted end-to-end"
                    on_click={() => {
                      field.onChange(false)
                    }}
                    is_checked={!field.value}
                  />
                  <RadioSetting
                    top_line="Public"
                    bottom_line="Selected links and tags can remain private"
                    on_click={() => {
                      field.onChange(true)
                    }}
                    is_checked={field.value}
                  />
                </FormRadio>
              )
            }}
          />
        </Box>
        <Box>
          <BoxHeading heading="Title" />
          <UiCommonTemplate_FormControllerFix>
            <Controller
              name="title"
              control={control}
              defaultValue={props.bookmark?.title}
              rules={{
                maxLength: system_values.bookmark.title.max_length,
              }}
              render={({ field }) => {
                let error_message: string | undefined

                if (errors.title?.type == 'maxLength') {
                  error_message = `Title should be no longer than ${system_values.bookmark.title.max_length} characters.`
                }

                return (
                  <Input
                    value={field.value}
                    on_change={(value) => {
                      if (!isSubmitting) {
                        field.onChange(value)
                      }
                    }}
                    message_type={error_message ? 'error' : undefined}
                    message={error_message}
                    lines={2}
                  />
                )
              }}
            />
          </UiCommonTemplate_FormControllerFix>
        </Box>
        <Box>
          <BoxHeading heading="Links" />
          <Controller
            name="is_public"
            control={control}
            defaultValue={props.bookmark?.is_public}
            render={({ field }) => {
              return (
                <DraggableFormInputs
                  items={links.map((link) => ({
                    value: link.url,
                    is_public:
                      props.bookmark?.is_public == false
                        ? true
                        : link.is_public,
                  }))}
                  on_change={(links) => {
                    set_links(
                      links.map((el) => ({
                        url: el.value,
                        is_public: el.is_public,
                      })),
                    )
                  }}
                  button_text="Add link"
                  show_visibility_toggler={
                    (field.value === undefined && props.bookmark?.is_public) ||
                    field.value ||
                    false
                  }
                />
              )
            }}
          />
        </Box>
        <Box>
          <BoxHeading heading="Tags" />
          <Controller
            name="is_public"
            control={control}
            defaultValue={props.bookmark?.is_public}
            render={({ field }) => {
              return (
                <DraggableFormInputs
                  items={tags.map((tag) => ({
                    value: tag.name,
                    is_public:
                      props.bookmark?.is_public == false ? true : tag.is_public,
                  }))}
                  on_change={(tags) => {
                    set_tags(
                      tags.map((el) => ({
                        name: el.value,
                        is_public: el.is_public,
                      })),
                    )
                  }}
                  button_text="Add tag"
                  show_visibility_toggler={
                    (field.value === undefined && props.bookmark?.is_public) ||
                    field.value ||
                    false
                  }
                  max_items={system_values.bookmark.tags.limit}
                />
              )
            }}
          />
        </Box>
        <Box>
          <BoxHeading heading="Note" />
          <UiCommonTemplate_FormControllerFix>
            <Controller
              name="note"
              control={control}
              defaultValue={props.bookmark?.note}
              rules={{
                maxLength: system_values.bookmark.note.max_length,
              }}
              render={({ field }) => {
                let error_message: string | undefined

                if (errors.note?.type == 'maxLength') {
                  error_message = `Note should be no longer than ${system_values.bookmark.note.max_length} characters.`
                }

                return (
                  <Input
                    value={field.value}
                    on_change={(value) => {
                      if (!isSubmitting) {
                        field.onChange(value)
                      }
                    }}
                    message_type={error_message ? 'error' : undefined}
                    message={error_message}
                    lines={5}
                  />
                )
              }}
            />
          </UiCommonTemplate_FormControllerFix>
        </Box>
      </FormModal>
    </form>
  )
}
