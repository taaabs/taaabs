'use client'

import { AuthContext } from '@/app/auth-provider'
import { browser_storage } from '@/constants/browser-storage'
import { use_has_focus } from '@/hooks/use-has-focus'
import { RecordVisit_Params } from '@repositories/modules/bookmarks/domain/types/record-visit.params'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { use_is_hydrated } from '@shared/hooks'
import { useContext, useEffect } from 'react'

export const VisitRecorder: React.FC = () => {
  const auth_context = useContext(AuthContext)
  const has_focus = use_has_focus()
  const is_hydrated = use_is_hydrated()

  useEffect(() => {
    if (has_focus && is_hydrated) {
      const record_visit_params: RecordVisit_Params | null = JSON.parse(
        localStorage.getItem(
          browser_storage.local_storage.authorized_library.record_visit_params,
        ) || 'null',
      )
      if (record_visit_params) {
        // Timeout prevents white screen when navigating back
        setTimeout(() => {
          localStorage.removeItem(
            browser_storage.local_storage.authorized_library
              .record_visit_params,
          )
          const data_source = new Bookmarks_DataSourceImpl(
            auth_context.ky_instance,
          )
          const repository = new Bookmarks_RepositoryImpl(data_source)
          repository.record_visit({
            bookmark_id: record_visit_params.bookmark_id,
            visited_at: record_visit_params.visited_at,
          })
        }, 0)
      }
    }
  }, [has_focus, is_hydrated])

  return <></>
}
