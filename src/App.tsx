import React from 'react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import SoftwareList from './components/SoftwareList';
import SoftwareDetail from './components/SoftwareDetail';
import Login from './components/Login';
import Register from './components/Register';
import { useAuthStore } from './store/auth';
import './App.css';

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/software" component={SoftwareList} />
          <Route exact path="/software/:id" component={SoftwareDetail} />
          <Route exact path="/">
            <Redirect to="/software" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
