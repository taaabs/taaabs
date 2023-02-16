import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import ExploreContainer from '../components/ExploreContainer'
import './Tab1.css'

import styled from 'styled-components'

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonItem routerLink="/tabtest">
          <IonLabel>Login1</IonLabel>
        </IonItem>
        <$Red>red</$Red>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
          
        </IonHeader>
        <ExploreContainer name="Tab 1 page" />
      </IonContent>
    </IonPage>
  )
}

const $Red = styled.div`
  color: green;
`

export default Tab1
