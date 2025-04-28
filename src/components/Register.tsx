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
} from '@ionic/react';
import { useAuthStore } from '../store/auth';
import { useHistory } from 'react-router-dom';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuthStore();
  const history = useHistory();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('密碼不匹配');
      return;
    }
    try {
      await register(email, password);
      history.push('/software');
    } catch (err) {
      setError('註冊失敗，請稍後再試');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>註冊</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleRegister}>
          <IonItem>
            <IonLabel position="floating">電子郵件</IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonChange={e => setEmail(e.detail.value!)}
              required
            />
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
          <IonItem>
            <IonLabel position="floating">確認密碼</IonLabel>
            <IonInput
              type="password"
              value={confirmPassword}
              onIonChange={e => setConfirmPassword(e.detail.value!)}
              required
            />
          </IonItem>
          {error && <IonText color="danger">{error}</IonText>}
          <IonButton expand="block" type="submit" className="ion-margin-top">
            註冊
          </IonButton>
          <IonButton expand="block" fill="clear" onClick={() => history.push('/login')}>
            返回登入
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Register;
