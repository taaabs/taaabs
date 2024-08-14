'use client'

import { use_has_focus } from '@/hooks/use-has-focus'
import { clear_library_session_storage } from '@/utils/clear_library_session_storage'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

// The requirement is to load fresh results on page refresh.
// We detach handler execution on link clicks by setting null to "window.onbeforeunload".
export const ClearLibraryDataOnRefresh: React.FC = () => {
  const has_focus = use_has_focus()
  const search_params = useSearchParams()
  const { username }: { username?: string } = useParams()

  useEffect(() => {
    const handleBeforeUnload = () => {
      clear_library_session_storage({
        search_params: search_params.toString(),
        hash: location.hash,
        username,
      })
    }
    window.onbeforeunload = handleBeforeUnload
  }, [has_focus])

  return <></>
}
