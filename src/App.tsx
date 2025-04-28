import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { bookmarkOutline, listOutline, personOutline } from 'ionicons/icons';
import SoftwareList from './components/SoftwareList';
import LoginForm from './components/LoginForm';
import { useAuthStore } from './stores/auth';
import { useEffect } from 'react';

const App: React.FC = () => {
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/software">
              <SoftwareList />
            </Route>
            <Route exact path="/login">
              <LoginForm />
            </Route>
            <Route exact path="/">
              <Redirect to="/software" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="software" href="/software">
              <IonIcon icon={listOutline} />
              <IonLabel>軟體列表</IonLabel>
            </IonTabButton>
            <IonTabButton tab="bookmarks" href="/bookmarks">
              <IonIcon icon={bookmarkOutline} />
              <IonLabel>我的書籤</IonLabel>
            </IonTabButton>
            <IonTabButton tab="profile" href={isAuthenticated ? '/profile' : '/login'}>
              <IonIcon icon={personOutline} />
              <IonLabel>{isAuthenticated ? '個人資料' : '登入'}</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
