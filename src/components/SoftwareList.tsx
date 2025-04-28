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
} from '@ionic/react';
import { heart, heartOutline, star } from 'ionicons/icons';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Software, SoftwareListResponse, SoftwareFilters } from '../types/software';
import Chart from 'chart.js/auto';

const fetchSoftware = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam?: number;
  queryKey: any[];
}): Promise<SoftwareListResponse> => {
  const [_, search, category] = queryKey;
  const response = await fetch(
    `/api/software?page=${pageParam}&search=${search}&category=${category}`
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const SoftwareList: React.FC = () => {
  const [filters, setFilters] = useState<SoftwareFilters>({
    search: '',
    searchFields: ['name', 'description', 'tags'],
    exactMatch: false,
    view: 'list',
    categories: [''],
    sortBy: 'name',
    sortDirection: true,
    startDate: '',
    endDate: '',
    activeCategoryTags: [],
    activeTags: [],
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useInfiniteQuery({
      queryKey: ['software', filters.search, filters.categories.join(',')],
      queryFn: fetchSoftware,
      getNextPageParam: lastPage => lastPage.nextPage,
      retry: 3,
      refetchOnWindowFocus: false,
    });

  useEffect(() => {
    const savedFilters = localStorage.getItem('softwareFilters');
    const savedFavorites = localStorage.getItem('softwareFavorites');

    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    localStorage.setItem('softwareFilters', JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem('softwareFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleFilterChange = (key: keyof SoftwareFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleFavorite = (name: string) => {
    setFavorites(prev => (prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      searchFields: ['name', 'description', 'tags'],
      exactMatch: false,
      view: 'list',
      categories: [''],
      sortBy: 'name',
      sortDirection: true,
      startDate: '',
      endDate: '',
      activeCategoryTags: [],
      activeTags: [],
    });
  };

  const filteredSoftware = data?.pages
    .flatMap(page => page.items)
    .filter(software => {
      const matchesSearch =
        !filters.search ||
        filters.searchFields.some(field => {
          const value = software[field as keyof Software]?.toString().toLowerCase() || '';
          return filters.exactMatch
            ? value === filters.search.toLowerCase()
            : value.includes(filters.search.toLowerCase());
        });

      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(software.category) ||
        (filters.categories.includes('favorites') && favorites.includes(software.name));

      const matchesDate =
        (!filters.startDate || software.date >= filters.startDate) &&
        (!filters.endDate || software.date <= filters.endDate);

      return matchesSearch && matchesCategory && matchesDate;
    })
    .sort((a, b) => {
      const aVal = a[filters.sortBy].toLowerCase();
      const bVal = b[filters.sortBy].toLowerCase();
      return filters.sortDirection ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

  useEffect(() => {
    if (chartRef.current && !isLoading) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const categories = filteredSoftware.reduce(
        (acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const labels = Object.keys(categories);
      const data = labels.map(label => categories[label]);
      const backgroundColors = labels.map((_, i) => `hsl(${i * 36}, 70%, 50%)`);

      chartInstance.current = new Chart(chartRef.current, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: backgroundColors,
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                font: { size: 12 },
                padding: 10,
              },
            },
          },
        },
      });
    }
  }, [filteredSoftware, isLoading]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>開源軟體清單</IonTitle>
        </IonToolbar>
        <IonSearchbar
          value={filters.search}
          onIonChange={e => handleFilterChange('search', e.detail.value)}
          placeholder="搜尋..."
          debounce={300}
        />
        <IonItem>
          <IonSelect
            label="搜尋欄位"
            value={filters.searchFields}
            multiple={true}
            onIonChange={e => handleFilterChange('searchFields', e.detail.value)}
          >
            <IonSelectOption value="name">名稱</IonSelectOption>
            <IonSelectOption value="version">版本</IonSelectOption>
            <IonSelectOption value="description">描述</IonSelectOption>
            <IonSelectOption value="tags">標籤</IonSelectOption>
          </IonSelect>
          <IonToggle
            checked={filters.exactMatch}
            onIonChange={e => handleFilterChange('exactMatch', e.detail.checked)}
            slot="end"
          >
            精確搜尋
          </IonToggle>
        </IonItem>
        <IonSegment
          value={filters.view}
          onIonChange={e => handleFilterChange('view', e.detail.value)}
        >
          <IonSegmentButton value="list">
            <IonLabel>列表</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="grid">
            <IonLabel>網格</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        <IonItem>
          <IonSelect
            label="排序方式"
            value={filters.sortBy}
            onIonChange={e => handleFilterChange('sortBy', e.detail.value)}
          >
            <IonSelectOption value="name">名稱</IonSelectOption>
            <IonSelectOption value="version">版本</IonSelectOption>
          </IonSelect>
          <IonToggle
            checked={filters.sortDirection}
            onIonChange={e => handleFilterChange('sortDirection', e.detail.checked)}
            slot="end"
          >
            降冪
          </IonToggle>
        </IonItem>
        <IonItem>
          <IonSelect
            label="分類"
            value={filters.categories}
            multiple={true}
            onIonChange={e => handleFilterChange('categories', e.detail.value)}
          >
            <IonSelectOption value="">全部</IonSelectOption>
            <IonSelectOption value="favorites">收藏</IonSelectOption>
            <IonSelectOption value="網頁瀏覽器">網頁瀏覽器</IonSelectOption>
            <IonSelectOption value="作業系統">作業系統</IonSelectOption>
            <IonSelectOption value="辦公室軟體">辦公室軟體</IonSelectOption>
            <IonSelectOption value="圖像編輯器">圖像編輯器</IonSelectOption>
            <IonSelectOption value="版本控制">版本控制</IonSelectOption>
            <IonSelectOption value="程式設計工具">程式設計工具</IonSelectOption>
            <IonSelectOption value="資料庫">資料庫</IonSelectOption>
            <IonSelectOption value="媒體播放器">媒體播放器</IonSelectOption>
            <IonSelectOption value="檔案管理">檔案管理</IonSelectOption>
            <IonSelectOption value="網頁伺服器">網頁伺服器</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel>日期範圍</IonLabel>
          <IonDatetimeButton datetime="startDate" />
          <IonDatetimeButton datetime="endDate" />
        </IonItem>
        <IonModal>
          <IonDatetime
            id="startDate"
            presentation="date"
            max="2025-12-31"
            value={filters.startDate}
            onIonChange={e => handleFilterChange('startDate', e.detail.value)}
          />
          <IonDatetime
            id="endDate"
            presentation="date"
            max="2025-12-31"
            value={filters.endDate}
            onIonChange={e => handleFilterChange('endDate', e.detail.value)}
          />
        </IonModal>
        <IonButton expand="block" color="light" onClick={resetFilters}>
          重設過濾
        </IonButton>
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
        {isLoading ? (
          <IonList>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="skeleton-card" style={{ margin: '8px', padding: '8px' }}>
                <IonSkeletonText
                  animated
                  style={{ width: '100%', height: '20px', marginBottom: '8px' }}
                />
                <IonSkeletonText
                  animated
                  style={{ width: '80%', height: '16px', marginBottom: '8px' }}
                />
                <IonSkeletonText
                  animated
                  style={{ width: '60%', height: '16px', marginBottom: '8px' }}
                />
                <IonSkeletonText animated style={{ width: '100%', height: '150px' }} />
              </div>
            ))}
          </IonList>
        ) : (
          <IonList className={`${filters.view}-view`}>
            {filteredSoftware.length === 0 ? (
              <p className="no-results">無符合結果</p>
            ) : (
              filteredSoftware.map(software => (
                <IonCard key={software.name}>
                  <IonCardHeader>
                    <img
                      src={software.icon}
                      alt={`${software.name} 圖示`}
                      className="software-icon"
                    />
                    <div className="software-details">
                      <IonCardTitle>{software.name}</IonCardTitle>
                      <IonCardSubtitle>版本：{software.version}</IonCardSubtitle>
                      <IonCardSubtitle>授權：{software.license}</IonCardSubtitle>
                    </div>
                    <IonIcon
                      icon={favorites.includes(software.name) ? star : starOutline}
                      className={`favorite-icon ${favorites.includes(software.name) ? 'favorited' : ''}`}
                      onClick={() => toggleFavorite(software.name)}
                    />
                  </IonCardHeader>
                  <IonCardContent>
                    <p>描述：{software.description}</p>
                    <p>
                      分類：<span className="category-tag">{software.category}</span>
                    </p>
                    <p>
                      標籤：
                      {software.tags.map(tag => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </p>
                    <div className="video-container">
                      <iframe
                        src={software.video}
                        title={`${software.name} 示範影片`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  </IonCardContent>
                </IonCard>
              ))
            )}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default SoftwareList;
