import React, { useEffect, useRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonLoading,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonAlert,
} from '@ionic/react';
import { heart, heartOutline } from 'ionicons/icons';
import { useInfiniteQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useSoftwareStore } from '@/store/projectStore';
import type { HTMLIonInfiniteScrollElement } from '@ionic/core';

const SoftwareList: React.FC = () => {
  const { favorites, toggleFavorite } = useSoftwareStore();
  const infiniteScrollRef = useRef<HTMLIonInfiniteScrollElement>(null);

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['software'],
      queryFn: ({ pageParam = 1 }) => apiService.getSoftwareList(pageParam),
      getNextPageParam: lastPage => {
        if (lastPage.data.hasMore) {
          return lastPage.data.page + 1;
        }
        return undefined;
      },
    });

  const loadMore = async (event: CustomEvent<void>): Promise<void> => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
    (event.target as HTMLIonInfiniteScrollElement).complete();
  };

  useEffect(() => {
    if (infiniteScrollRef.current && !hasNextPage) {
      infiniteScrollRef.current.disabled = true;
    }
  }, [hasNextPage]);

  const handleToggleFavorite = async (softwareId: string): Promise<void> => {
    try {
      await toggleFavorite(softwareId);
    } catch (error) {
      console.error('收藏操作失敗:', error);
    }
  };

  const softwareList = data?.pages.flatMap(page => page.data.items) || [];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>開源軟體列表</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={isLoading} message="載入中..." />

        <IonList>
          {softwareList.map(software => {
            const isFavorite = favorites.some(fav => fav.id === software.id);
            return (
              <IonItem key={software.id}>
                <IonLabel>
                  <h2>{software.name}</h2>
                  <p>{software.description}</p>
                  <p>
                    ⭐ {software.stars} | 🍴 {software.forks}
                  </p>
                </IonLabel>
                <IonButton fill="clear" onClick={() => handleToggleFavorite(software.id)}>
                  <IonIcon
                    icon={isFavorite ? heart : heartOutline}
                    color={isFavorite ? 'danger' : 'medium'}
                  />
                </IonButton>
              </IonItem>
            );
          })}
        </IonList>

        <IonInfiniteScroll
          ref={infiniteScrollRef}
          onIonInfinite={loadMore}
          threshold="100px"
          disabled={!hasNextPage}
        >
          <IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="載入更多..." />
        </IonInfiniteScroll>

        <IonAlert
          isOpen={!!error}
          onDidDismiss={() => {}}
          header="錯誤"
          message={error?.message || '載入失敗，請稍後再試'}
          buttons={['確定']}
        />
      </IonContent>
    </IonPage>
  );
};

export default SoftwareList;
