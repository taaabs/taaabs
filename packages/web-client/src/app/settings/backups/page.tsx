'use client'

import { useEffect } from 'react'
import {
  use_settings_backups_dispatch,
  use_settings_backups_selector,
} from './_hooks/store'
import { backups_actions } from '@repositories/stores/settings-backups/backups/backups.slice'
import { Box as UiAppAtom_Box } from '@web-ui/components/app/atoms/box'
import { BoxHeading as UiAppAtom_BoxHeading } from '@web-ui/components/app/atoms/box-heading'
import { Input as UiCommonAtom_Input } from '@web-ui/components/common/atoms/input'
import { Button as UiCommonParticle_Button } from '@web-ui/components/common/particles/button'
import { ImportExport_DataSourceImpl } from '@repositories/modules/import-export/infrastructure/data-sources/import-export.data-source-impl'
import { ImportExport_RepositoryImpl } from '@repositories/modules/import-export/infrastructure/repositories/import-export.repository-impl'
import { DownloadBackup_UseCase } from '@repositories/modules/import-export/domain/usecases/download-backup.use-case'

const Page: React.FC = () => {
  const dispatch = use_settings_backups_dispatch()
  const state = use_settings_backups_selector((state) => state.backups)

  useEffect(() => {
    dispatch(
      backups_actions.get_backups({
        api_url: process.env.NEXT_PUBLIC_API_URL,
        auth_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
      }),
    )
  }, [])

  return (
    <UiAppAtom_Box>
      <UiAppAtom_BoxHeading
        heading={'Manage backups'}
        subheading={
          'This section helps you request the creation of snapshots of all your bookmarks and tag hierarchies.'
        }
      />
      <div>
        {state.backups?.map((backup) => (
          <div>
            <div>{backup.created_at}</div>
            <UiCommonParticle_Button
              on_click={async () => {
                const data_source = new ImportExport_DataSourceImpl(
                  process.env.NEXT_PUBLIC_API_URL,
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                )
                const repository = new ImportExport_RepositoryImpl(data_source)
                const download_backup_use_case = new DownloadBackup_UseCase(
                  repository,
                )
                const data = await download_backup_use_case.invoke({
                  id: backup.id,
                })
                download({
                  filename: `${backup.created_at} - taaabs backup.json`,
                  text: data,
                })
              }}
            >
              Download
            </UiCommonParticle_Button>
          </div>
        ))}
      </div>
    </UiAppAtom_Box>
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
