import { useRef, useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useSearchParams } from 'next/navigation'
import { use_popstate_count } from '@/providers/PopstateCountProvider'

export const use_popstate_rerender_trigger = () => {
  const { popstate_count } = use_popstate_count()
  const search_params = useSearchParams()
  const is_rerender_trigger_update_enabled = useRef(false)
  const [value, set_value] = useState<number>()

  useUpdateEffect(() => {
    is_rerender_trigger_update_enabled.current = true
  }, [popstate_count])

  useUpdateEffect(() => {
    if (is_rerender_trigger_update_enabled.current) {
      set_value(Date.now())
      is_rerender_trigger_update_enabled.current = false
    }
  }, [search_params])

  return { value }
}
