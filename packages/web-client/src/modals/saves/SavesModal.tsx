import { Dictionary } from '@/dictionaries/dictionary'
import { Modal as Ui_Modal } from '@web-ui/components/Modal'
import { Header as Ui_Modal_Header } from '@web-ui/components/Modal/Header'
import { SavesContent as Ui_Modal_SavesContent } from '@web-ui/components/Modal/SavesContent'
import { useContext, useEffect, useState } from 'react'
import { ModalContext } from '@/providers/ModalProvider'
import { AuthContext } from '@/providers/AuthProvider'
import { Saves_DataSourceImpl } from '@repositories/modules/saves/infrastructure/data_sources/saves.data-source-impl'
import { Saves_RepositoryImpl } from '@repositories/modules/saves/infrastructure/repositories/saves.repository-impl'
import { GetSaves_Ro } from '@repositories/modules/saves/domain/types/get_saves.ro'
import { usePathname, useSearchParams } from 'next/navigation'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

namespace SavesModal {
  export type Props = {
    url: string
    saves: number
    dictionary: Dictionary
    on_close: () => void
  }
}

export const SavesModal: React.FC<SavesModal.Props> = (props) => {
  const modal_context = useContext(ModalContext)
  const auth_context = useContext(AuthContext)
  const [users, set_users] = useState<GetSaves_Ro>()
  const pathname = usePathname()
  const search_params = useSearchParams()

  useUpdateEffect(() => {
    // Opened user profile from the list
    props.on_close()
  }, [pathname])

  useEffect(() => {
    const init = async () => {
      const hash_buffer = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(props.url),
      )
      const hash_array = Array.from(new Uint8Array(hash_buffer))
      const url_hash = hash_array
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')

      const data_source = new Saves_DataSourceImpl(auth_context.ky_instance)
      const repository = new Saves_RepositoryImpl(data_source)
      const result = await repository.get_saves({ url_hash })
      set_users(result)
    }
    init()
  }, [])

  const content = (
    <Ui_Modal_SavesContent
      users={
        users?.map((user) => ({
          username: user.username,
          display_name: user.display_name,
          is_following: user.is_following,
          saved_at: new Date(user.saved_at),
        })) || []
      }
      app_url={process.env.NEXT_PUBLIC_APP_URL!}
      on_follow_click={(username) => {}}
      show_follow_buttons={auth_context.auth_data !== undefined}
      locale={props.dictionary.locale}
      back={`${pathname}?${search_params.toString()}`}
      translations={{
        follow: 'Follow',
        unfollow: 'Unfollow',
      }}
    />
  )

  const header = (
    <Ui_Modal_Header
      title={props.dictionary.app.saves_modal.header}
      on_close={props.on_close}
    />
  )

  return (
    <Ui_Modal
      is_open={modal_context.is_open}
      is_dismissible={true}
      on_close={props.on_close}
      width={400}
      slot_header={header}
      slot_content={content}
      slot_footer
    />
  )
}
