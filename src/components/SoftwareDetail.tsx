import React, { useEffect, useState } from 'react';
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
import { apiService } from '../services/api';
import { Software } from '../types/software';
import './SoftwareDetail.css';

export const SoftwareDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [software, setSoftware] = useState<Software | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchSoftwareDetail(id);
    }
  }, [id]);

  const fetchSoftwareDetail = async (softwareId: string) => {
    try {
      const data = await apiService.getSoftwareDetail(softwareId);
      setSoftware(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '獲取軟體詳情失敗');
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!software) return;
    try {
      await apiService.toggleBookmark(software.name);
      // 重新獲取數據以更新書籤狀態
      // queryClient.invalidateQueries(['software', id]);
    } catch (err) {
      console.error('書籤操作失敗:', err);
    }
  };

  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤：{error}</div>;
  if (!software) return <div>找不到軟體</div>;

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
              <IonIcon icon={software.isBookmarked ? 'bookmark' : 'bookmark-outline'} />
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
