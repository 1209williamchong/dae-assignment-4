import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonFooter,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { home, list, settings } from 'ionicons/icons';
import SoftwareList from './components/SoftwareList';
import './App.css';

const App: React.FC = () => {
  return (
    <IonApp>
      <Router>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>開源軟體清單</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <Routes>
            <Route path="/" element={<SoftwareList />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </IonContent>

        <IonFooter>
          <IonToolbar>
            <div className="footer-buttons">
              <IonButton fill="clear">
                <IonIcon slot="icon-only" icon={home} />
              </IonButton>
              <IonButton fill="clear">
                <IonIcon slot="icon-only" icon={list} />
              </IonButton>
              <IonButton fill="clear">
                <IonIcon slot="icon-only" icon={settings} />
              </IonButton>
            </div>
          </IonToolbar>
        </IonFooter>
      </Router>
    </IonApp>
  );
};

export default App;
