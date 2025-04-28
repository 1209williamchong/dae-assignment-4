import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import SoftwareList from './pages/SoftwareList';
import SoftwareDetail from './pages/SoftwareDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuthStore } from './store/authStore';

setupIonicReact();

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/software" element={<SoftwareList />} />
          <Route path="/software/:id" element={<SoftwareDetail />} />
          <Route path="/" element={<Navigate to="/software" replace />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
