import React, { useEffect, useState } from 'react';
import { IonList, IonItem, IonLabel, IonButton, IonIcon, IonLoading } from '@ionic/react';
import { bookmark, trash } from 'ionicons/icons';
import { apiService } from '../services/api';
import { ApiException, HttpStatusCode } from '../config/api';

const BookmarkList: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getBookmarks();
      setBookmarks(response.item_ids);
    } catch (error) {
      if (error instanceof ApiException) {
        switch (error.status) {
          case HttpStatusCode.Unauthorized:
            setError('請先登入以查看收藏列表');
            break;
          case HttpStatusCode.Forbidden:
            setError('您沒有權限訪問此資源');
            break;
          default:
            setError(error.message);
        }
      } else {
        setError('獲取收藏列表時發生錯誤');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async (itemId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.toggleBookmark(itemId);
      console.log('收藏狀態更新:', response.message);
      // 重新獲取收藏列表
      await fetchBookmarks();
    } catch (error) {
      if (error instanceof ApiException) {
        setError(error.message);
      } else {
        setError('更新收藏狀態時發生錯誤');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

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
