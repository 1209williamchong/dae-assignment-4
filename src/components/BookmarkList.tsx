import React, { useEffect, useState } from 'react';
import { IonList, IonItem, IonLabel, IonButton, IonIcon, IonLoading } from '@ionic/react';
import { bookmark, trash } from 'ionicons/icons';
import { apiService } from '../services/api';
import { ApiException, HttpStatusCode } from '../config/api';

interface Bookmark {
  id: string;
  title: string;
  description: string;
}

const BookmarkList: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = async () => {
    try {
      const response = await apiService.getBookmarks();
      setBookmarks(response.item_ids);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '獲取書籤失敗');
      setLoading(false);
    }
  };

  const handleToggleBookmark = async (itemId: string) => {
    try {
      const response = await apiService.toggleBookmark(itemId);
      console.log('收藏狀態更新:', response.message);
      fetchBookmarks(); // 重新獲取書籤列表
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新書籤失敗');
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤：{error}</div>;

  return (
    <>
      <IonLoading isOpen={loading} message="載入中..." />

      {error && (
        <IonItem>
          <IonLabel color="danger">{error}</IonLabel>
        </IonItem>
      )}

      <IonList>
        {bookmarks.map(itemId => (
          <IonItem key={itemId}>
            <IonLabel>項目 ID: {itemId}</IonLabel>
            <IonButton fill="clear" onClick={() => handleToggleBookmark(itemId)}>
              <IonIcon slot="icon-only" icon={trash} />
            </IonButton>
          </IonItem>
        ))}
      </IonList>

      {bookmarks.length === 0 && !error && (
        <IonItem>
          <IonLabel>暫無收藏項目</IonLabel>
        </IonItem>
      )}
    </>
  );
};

export default BookmarkList;
