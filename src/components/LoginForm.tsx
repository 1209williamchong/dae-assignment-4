import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonText,
  IonLoading,
} from '@ionic/react';
import { useAuthStore } from '../stores/auth';

const LoginForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, signup, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const credentials = { username, password };
    if (isLogin) {
      await login(credentials);
    } else {
      await signup(credentials);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{isLogin ? '登入' : '註冊'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="floating">用戶名</IonLabel>
            <IonInput value={username} onIonChange={e => setUsername(e.detail.value!)} required />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">密碼</IonLabel>
            <IonInput
              type="password"
              value={password}
              onIonChange={e => setPassword(e.detail.value!)}
              required
            />
          </IonItem>
          {error && <IonText color="danger">{error}</IonText>}
          <IonButton expand="block" type="submit" className="ion-margin-top">
            {isLogin ? '登入' : '註冊'}
          </IonButton>
          <IonButton expand="block" fill="clear" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? '切換到註冊' : '切換到登入'}
          </IonButton>
        </form>
        <IonLoading isOpen={isLoading} message="處理中..." />
      </IonContent>
    </IonPage>
  );
};

export default LoginForm;
