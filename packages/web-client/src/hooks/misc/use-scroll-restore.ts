import { browser_storage } from '@/constants/browser-storage'
import { use_is_hydrated } from '@shared/hooks'
import useDebouncedCallback from 'beautiful-react-hooks/useDebouncedCallback'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import useWindowScroll from 'beautiful-react-hooks/useWindowScroll'
import { useParams, useSearchParams } from 'next/navigation'

// Browser could offload site from memory, so immediate back navigation will no longer be possible.
// In such case scroll must be restored manually.
export const use_scroll_restore = () => {
  const on_window_scroll = useWindowScroll()
  const is_hydrated = use_is_hydrated()
  const search_params = useSearchParams()
  const { username }: { username?: string } = useParams()

  const on_scroll_y = useDebouncedCallback(
    (scrollY: number, search_params: string, username?: string) => {
      sessionStorage.setItem(
        browser_storage.session_storage.library.scroll_y({
          search_params,
          username,
        }),
        scrollY.toString(),
      )
    },
    [],
    100,
  )

  on_window_scroll(() => {
    on_scroll_y(window.scrollY, search_params.toString(), username)
  })

  useUpdateEffect(() => {
    const scroll_y = sessionStorage.getItem(
      browser_storage.session_storage.library.scroll_y({
        search_params: search_params.toString(),
        username,
      }),
    )
    if (scroll_y && window.scrollY != parseInt(scroll_y)) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(scroll_y))
      }, 0)
    }
  }, [search_params])

  useUpdateEffect(() => {
    const scroll_y = sessionStorage.getItem(
      browser_storage.session_storage.library.scroll_y({
        search_params: search_params.toString(),
        username,
      }),
    )
    if (scroll_y) {
      window.scrollTo(0, parseInt(scroll_y))
    }
  }, [is_hydrated])
}
