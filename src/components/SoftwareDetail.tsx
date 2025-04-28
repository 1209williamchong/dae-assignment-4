import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonChip,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { bookmark, bookmarkOutline } from 'ionicons/icons';
import { api } from '../services/api';
import './SoftwareDetail.css';

const SoftwareDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: software,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['software', id],
    queryFn: () => api.getSoftwareDetail(id!),
  });

  const handleBookmark = async () => {
    if (!software) return;
    try {
      await api.toggleBookmark(software.name);
      // 重新獲取數據以更新書籤狀態
      // queryClient.invalidateQueries(['software', id]);
    } catch (err) {
      console.error('書籤操作失敗:', err);
    }
  };

  if (isLoading) {
    return (
      <IonPage>
        <IonContent>
          <div className="loading">載入中...</div>
        </IonContent>
      </IonPage>
    );
  }

  if (error || !software) {
    return (
      <IonPage>
        <IonContent>
          <div className="error">載入失敗，請稍後再試</div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/software" />
          </IonButtons>
          <IonTitle>{software.name}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleBookmark}>
              <IonIcon icon={software.isBookmarked ? bookmark : bookmarkOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <img src={software.icon} alt={`${software.name} 圖示`} className="software-icon" />
            <IonCardTitle>{software.name}</IonCardTitle>
            <IonCardSubtitle>版本：{software.version}</IonCardSubtitle>
            <IonCardSubtitle>授權：{software.license}</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <p className="description">{software.description}</p>
            <div className="tags">
              <IonBadge color="primary">{software.category}</IonBadge>
              {software.tags.map(tag => (
                <IonChip key={tag} color="secondary">
                  {tag}
                </IonChip>
              ))}
            </div>
            {software.video && (
              <div className="video-container">
                <iframe
                  src={software.video}
                  title={`${software.name} 示範影片`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default SoftwareDetail;
