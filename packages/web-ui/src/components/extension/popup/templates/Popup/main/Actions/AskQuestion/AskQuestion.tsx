import { Input } from '@web-ui/components/Input'
import styles from './AskQuestion.module.scss'
import { Button } from '@web-ui/components/Button'

export namespace AskQuestion {
  export type Props = {
    on_submit: (question: string) => void
  }
}

export const AskQuestion: React.FC<AskQuestion.Props> = (props) => {
  return (
    <div className={styles.container}>
      <Input on_change={() => {}} value="" />
      <Button>Ask</Button>
    </div>
  )
}
