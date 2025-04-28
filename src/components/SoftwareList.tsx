import React, { useState, useEffect, useRef } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonChip,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSpinner,
  IonToast,
  IonBadge,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonSegment,
  IonSegmentButton,
  IonButton,
  IonDatetimeButton,
  IonModal,
  IonDatetime,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonSkeletonText,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonMenuButton,
} from '@ionic/react';
import {
  heart,
  heartOutline,
  star,
  bookmark,
  bookmarkOutline,
  gridOutline,
  listOutline,
} from 'ionicons/icons';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Software, SoftwareListResponse, SoftwareFilters } from '../types/software';
import Chart from 'chart.js/auto';
import { softwareData } from '../data/softwareData';
import { api } from '../services/api';
import { useHistory } from 'react-router-dom';
import './SoftwareList.css';

const SoftwareList: React.FC = () => {
  const history = useHistory();
  const [filters, setFilters] = useState<SoftwareFilters>({
    search: '',
    searchFields: ['name', 'description'],
    exactMatch: false,
    view: 'list',
    categories: [],
    sortBy: 'name',
    sortDirection: true,
    startDate: '',
    endDate: '',
  });

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['software', filters],
    queryFn: ({ pageParam = 1 }) => api.getSoftwareList({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const {
    data: softwareData,
    isLoading: softwareDataLoading,
    error: softwareDataError,
  } = useQuery({
    queryKey: ['software', { search: filters.search, categories: filters.categories }],
    queryFn: () => api.getSoftwareList({ search: filters.search, categories: filters.categories }),
  });

  useEffect(() => {
    const savedFilters = localStorage.getItem('softwareFilters');
    const savedFavorites = localStorage.getItem('softwareFavorites');

    if (savedFilters) {
      const filters = JSON.parse(savedFilters);
      setFilters(filters);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'softwareFilters',
      JSON.stringify({
        search: filters.search,
        searchFields: filters.searchFields,
        exactMatch: filters.exactMatch,
        view: filters.view,
        categories: filters.categories,
        sortBy: filters.sortBy,
        sortDirection: filters.sortDirection,
        startDate: filters.startDate,
        endDate: filters.endDate,
      })
    );
  }, [
    filters.search,
    filters.searchFields,
    filters.exactMatch,
    filters.view,
    filters.categories,
    filters.sortBy,
    filters.sortDirection,
    filters.startDate,
    filters.endDate,
  ]);

  useEffect(() => {
    localStorage.setItem('softwareFavorites', JSON.stringify(filters.categories));
  }, [filters.categories]);

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleViewChange = (view: 'list' | 'grid') => {
    setFilters(prev => ({ ...prev, view }));
  };

  const handleSort = (sortBy: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortDirection: prev.sortBy === sortBy ? !prev.sortDirection : true,
    }));
  };

  const handleBookmark = async (software: Software) => {
    try {
      await api.toggleBookmark(software.name);
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

  if (error) {
    return (
      <IonPage>
        <IonContent>
          <div className="error">載入失敗，請稍後再試</div>
        </IonContent>
      </IonPage>
    );
  }

  const softwareList = data?.pages.flatMap(page => page.items) || [];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>開源軟體清單</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => handleViewChange('list')}>
              <IonIcon icon={listOutline} />
            </IonButton>
            <IonButton onClick={() => handleViewChange('grid')}>
              <IonIcon icon={gridOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={filters.search}
            onIonChange={e => handleSearch(e.detail.value!)}
            placeholder="搜尋軟體..."
          />
          <IonSelect
            value={filters.sortBy}
            onIonChange={e => handleSort(e.detail.value)}
            interface="popover"
          >
            <IonSelectOption value="name">名稱</IonSelectOption>
            <IonSelectOption value="date">日期</IonSelectOption>
          </IonSelect>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ height: '150px', margin: '8px', position: 'relative' }}>
          {isLoading ? (
            <div
              className="skeleton-chart"
              style={{
                width: '150px',
                height: '150px',
                background: '#e0e0e0',
                borderRadius: '50%',
                margin: '8px auto',
              }}
            />
          ) : (
            <canvas ref={chartRef} />
          )}
        </div>
        {filters.view === 'list' ? (
          <IonList>
            {softwareList.length === 0 ? (
              <p className="no-results">無符合結果</p>
            ) : (
              softwareList.map(software => (
                <IonItem
                  key={software.name}
                  onClick={() => history.push(`/software/${software.name}`)}
                >
                  <IonLabel>
                    <h2>{software.name}</h2>
                    <p>{software.description}</p>
                    <div className="tags">
                      <IonBadge color="primary">{software.category}</IonBadge>
                      <IonBadge color="secondary">{software.license}</IonBadge>
                    </div>
                  </IonLabel>
                  <IonButton
                    slot="end"
                    fill="clear"
                    onClick={e => {
                      e.stopPropagation();
                      handleBookmark(software);
                    }}
                  >
                    <IonIcon icon={software.isBookmarked ? bookmark : bookmarkOutline} />
                  </IonButton>
                </IonItem>
              ))
            )}
          </IonList>
        ) : (
          <IonGrid>
            <IonRow>
              {softwareList.length === 0 ? (
                <p className="no-results">無符合結果</p>
              ) : (
                softwareList.map(software => (
                  <IonCol size="12" sizeMd="6" sizeLg="4" key={software.name}>
                    <IonCard onClick={() => history.push(`/software/${software.name}`)}>
                      <IonCardHeader>
                        <IonCardTitle>{software.name}</IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent>
                        <p>{software.description}</p>
                        <div className="tags">
                          <IonChip color="primary">{software.category}</IonChip>
                          <IonChip color="secondary">{software.license}</IonChip>
                        </div>
                        <IonButton
                          fill="clear"
                          onClick={e => {
                            e.stopPropagation();
                            handleBookmark(software);
                          }}
                        >
                          <IonIcon icon={software.isBookmarked ? bookmark : bookmarkOutline} />
                        </IonButton>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))
              )}
            </IonRow>
          </IonGrid>
        )}
        {hasNextPage && (
          <IonButton
            expand="block"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? '載入中...' : '載入更多'}
          </IonButton>
        )}
      </IonContent>
    </IonPage>
  );
};

export default SoftwareList;
