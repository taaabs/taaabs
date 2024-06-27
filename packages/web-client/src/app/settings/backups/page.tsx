'use client'

import { useContext } from 'react'
import {
  use_settings_backups_dispatch,
  use_settings_backups_selector,
} from './_hooks/store'
import { backups_actions } from '@repositories/stores/settings-backups/backups/backups.slice'
import { StandardSection as UiAppAtom_HeadingWithSubheading } from '@web-ui/components/settings/StandardSection'
import {
  Button,
  Button as UiCommonParticle_Button,
} from '@web-ui/components/common/particles/button'
import { ImportExport_DataSourceImpl } from '@repositories/modules/import-export/infrastructure/data-sources/import-export.data-source-impl'
import { ImportExport_RepositoryImpl } from '@repositories/modules/import-export/infrastructure/repositories/import-export.repository-impl'
import { AuthContext } from '@/app/auth-provider'
import { use_is_hydrated } from '@shared/hooks'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { toast } from 'react-toastify'

const Page: React.FC = () => {
  const auth_context = useContext(AuthContext)!
  const is_hydrated = use_is_hydrated()
  const dispatch = use_settings_backups_dispatch()
  const state = use_settings_backups_selector((state) => state.backups)

  useUpdateEffect(() => {
    dispatch(
      backups_actions.get_backups({
        ky: auth_context.ky_instance,
      }),
    )
  }, [is_hydrated])

  return (
    <UiAppAtom_HeadingWithSubheading
      heading={{
        text: 'Manage backups',
        subtext: 'Request and download export files.',
      }}
    >
      <Button
        on_click={async () => {
          try {
            const data_source = new ImportExport_DataSourceImpl(
              auth_context.ky_instance,
            )
            const repository = new ImportExport_RepositoryImpl(data_source)
            await repository.request_new_backup({})
            toast.success('Backup has beed requested!')
          } catch (error) {
            toast.error('Something went wrong, try again leter')
          }
        }}
      >
        Request backup
      </Button>

      {state.backups?.map((backup) => {
        const created_at = new Date(backup.created_at).toISOString().split('T')

        return (
          <div key={backup.id}>
            <br />
            <div>{`${created_at[0]} ${created_at[1].split('.')[0]}`}</div>
            <UiCommonParticle_Button
              on_click={async () => {
                const data_source = new ImportExport_DataSourceImpl(
                  auth_context.ky_instance,
                )
                const repository = new ImportExport_RepositoryImpl(data_source)

                const data = await repository.download_backup(
                  {
                    id: backup.id,
                  },
                  auth_context.auth_data!.encryption_key,
                )
                download({
                  filename: `${backup.created_at} - taaabs backup.json`,
                  text: JSON.stringify(data),
                })
              }}
            >
              Download
            </UiCommonParticle_Button>
          </div>
        )
      })}
    </UiAppAtom_HeadingWithSubheading>
  )
}

export default Page

function download(params: { filename: string; text: string }) {
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(params.text),
  )
  element.setAttribute('download', params.filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
