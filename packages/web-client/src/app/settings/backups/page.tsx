'use client'

import { useEffect } from 'react'
import {
  use_settings_backups_dispatch,
  use_settings_backups_selector,
} from './_hooks/store'
import { backups_actions } from '@repositories/stores/settings-backups/backups/backups.slice'
import { Box as UiAppAtom_Box } from '@web-ui/components/app/atoms/box'
import { HeadingWithSubheading as UiAppAtom_HeadingWithSubheading } from '@web-ui/components/app/atoms/heading-with-subheading'
import { Button as UiCommonParticle_Button } from '@web-ui/components/common/particles/button'
import { ImportExport_DataSourceImpl } from '@repositories/modules/import-export/infrastructure/data-sources/import-export.data-source-impl'
import { ImportExport_RepositoryImpl } from '@repositories/modules/import-export/infrastructure/repositories/import-export.repository-impl'
import { DownloadBackup_UseCase } from '@repositories/modules/import-export/domain/usecases/download-backup.use-case'
import ky from 'ky'

const Page: React.FC = () => {
  const dispatch = use_settings_backups_dispatch()
  const state = use_settings_backups_selector((state) => state.backups)
  const ky_instance = ky.create({
    prefixUrl: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhQmNEZSIsImlhdCI6MTcxMDM1MjExNn0.ZtpENZ0tMnJuGiOM-ttrTs5pezRH-JX4_vqWDKYDPWY`,
      'Content-Type': 'application/json',
    },
  })

  useEffect(() => {
    dispatch(
      backups_actions.get_backups({
        ky: ky_instance,
      }),
    )
  }, [])

  return (
    <UiAppAtom_Box>
      <UiAppAtom_HeadingWithSubheading
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
                const data_source = new ImportExport_DataSourceImpl(ky_instance)
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
