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
import { useAuth } from '../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (err) {
      // 錯誤已經在 login 函數中處理
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
