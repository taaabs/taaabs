'use client'

import { browser_storage } from '@/constants/browser-storage'
import { use_has_focus } from '@/hooks/misc/use-has-focus'
import { RecordVisit_Params } from '@repositories/modules/bookmarks/domain/types/record-visit.params'
import { RecordVisit_UseCase } from '@repositories/modules/bookmarks/domain/usecases/record-visit.use-case'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import ky from 'ky'
import { useEffect } from 'react'

export const VisitRecorder: React.FC = () => {
  const has_focus = use_has_focus()

  useEffect(() => {
    const ky_instance = ky.create({
      prefixUrl: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhQmNEZSIsImlhdCI6MTcxMDM1MjExNn0.ZtpENZ0tMnJuGiOM-ttrTs5pezRH-JX4_vqWDKYDPWY`,
        'Content-Type': 'application/json',
      },
    })

    if (has_focus) {
      const record_visit_params: RecordVisit_Params | null = JSON.parse(
        localStorage.getItem(
          browser_storage.local_storage.authorized_library.record_visit_params,
        ) || 'null',
      )
      if (record_visit_params) {
        // Timeout prevents white screen when navigating back.
        setTimeout(() => {
          localStorage.removeItem(
            browser_storage.local_storage.authorized_library
              .record_visit_params,
          )
          const data_source = new Bookmarks_DataSourceImpl(ky_instance)
          const repository = new Bookmarks_RepositoryImpl(data_source)
          const record_visit = new RecordVisit_UseCase(repository)
          record_visit.invoke({
            bookmark_id: record_visit_params.bookmark_id,
            visited_at: record_visit_params.visited_at,
          })
        }, 0)
      }
    }
  }, [has_focus])

  return <></>
}
