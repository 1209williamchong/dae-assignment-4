import React, { useEffect, useState, useRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonIcon,
  IonList,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonBadge,
  IonSkeletonText,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/react';
import { star, starOutline } from 'ionicons/icons';
import { Chart } from 'chart.js/auto';
import { apiService } from '../services/api';
import { notification } from '../services/notification';
import { Software, SoftwareListResponse, SoftwareSearchParams } from '../types/software';
import useProjectStore from '../store/projectStore';
import './SoftwareList.css';

const SoftwareList: React.FC = () => {
  const { software, loading, error, searchParams, setSearchParams, fetchSoftware } =
    useProjectStore();
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFields, setSearchFields] = useState<string[]>(['name', 'description', 'tags']);
  const [exactMatch, setExactMatch] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['']);
  const [sortBy, setSortBy] = useState<'stars' | 'downloads' | 'updated' | 'created'>('stars');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [activeCategoryTags, setActiveCategoryTags] = useState<string[]>([]);
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    fetchSoftware();
  }, [searchParams]);

  useEffect(() => {
    if (!loading && chartRef.current) {
      updateChart();
    }
  }, [loading, software]);

  const updateChart = () => {
    if (!chartRef.current) return;

    const categories = software.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(categories);
    const data = labels.map(label => categories[label]);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: '軟體數量',
            data,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  const handleSearch = (value: string) => {
    setSearchParams({ search: value, page: 1 });
  };

  const handleCategoryChange = (value: string) => {
    setSearchParams({ category: value, page: 1 });
  };

  const handleSortChange = (value: string) => {
    setSearchParams({ sort: value, page: 1 });
  };

  const handleLoadMore = () => {
    setSearchParams({ page: searchParams.page! + 1 });
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const filteredSoftware = software.filter(item => {
    const matchesSearch = searchTerm
      ? searchFields.some(field => {
          const value = item[field as keyof Software]?.toString().toLowerCase() || '';
          return exactMatch
            ? value === searchTerm.toLowerCase()
            : value.includes(searchTerm.toLowerCase());
        })
      : true;

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(item.category) ||
      (selectedCategories.includes('favorites') && favorites.includes(item.id));

    const matchesCategoryTags =
      activeCategoryTags.length === 0 || activeCategoryTags.includes(item.category);

    const matchesTags =
      activeCategoryTags.length === 0 || item.tags.some(tag => activeTags.includes(tag));

    const softwareDate = new Date(item.date);
    const matchesDate =
      (!startDate || softwareDate >= new Date(startDate)) &&
      (!endDate || softwareDate <= new Date(endDate));

    return matchesSearch && matchesCategory && matchesCategoryTags && matchesTags && matchesDate;
  });

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle className="ion-text-center">開源軟體清單</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchParams.search}
            onIonChange={e => handleSearch(e.detail.value!)}
            placeholder="搜尋軟體..."
            debounce={300}
            animated
            showClearButton="focus"
            className="custom-searchbar"
          />
        </IonToolbar>
        <IonToolbar>
          <IonItem lines="none" className="ion-padding-horizontal">
            <IonSelect
              label="搜尋欄位"
              value={searchFields}
              multiple={true}
              onIonChange={e => setSearchFields(e.detail.value)}
              interface="popover"
              className="custom-select"
            >
              <IonSelectOption value="name">名稱</IonSelectOption>
              <IonSelectOption value="version">版本</IonSelectOption>
              <IonSelectOption value="description">描述</IonSelectOption>
              <IonSelectOption value="tags">標籤</IonSelectOption>
            </IonSelect>
            <IonToggle
              checked={exactMatch}
              onIonChange={e => setExactMatch(e.detail.checked)}
              slot="end"
              className="custom-toggle"
            >
              精確搜尋
            </IonToggle>
          </IonItem>
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            value={viewMode}
            onIonChange={e => setViewMode(e.detail.value as 'list' | 'grid')}
            className="custom-segment"
          >
            <IonSegmentButton value="list">
              <IonLabel>列表視圖</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="grid">
              <IonLabel>網格視圖</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="chart-container">
          {loading ? <div className="skeleton-chart" /> : <canvas ref={chartRef} />}
        </div>
        <IonList className={`${viewMode}-view fade-toggle`}>
          {loading ? (
            Array(3)
              .fill(null)
              .map((_, i) => (
                <IonCard key={`skeleton-${i}`}>
                  <IonCardHeader>
                    <IonSkeletonText animated style={{ width: '40%' }} />
                    <IonSkeletonText animated style={{ width: '20%' }} />
                  </IonCardHeader>
                  <IonCardContent>
                    <IonSkeletonText animated style={{ width: '60%' }} />
                    <IonSkeletonText animated style={{ width: '80%' }} />
                  </IonCardContent>
                </IonCard>
              ))
          ) : filteredSoftware.length === 0 ? (
            <div className="no-results">
              <p>沒有找到符合條件的軟體</p>
            </div>
          ) : (
            filteredSoftware.map(item => (
              <IonCard key={item.id} className="custom-card">
                <IonCardHeader>
                  <img
                    src={item.icon}
                    alt={`${item.name} 圖示`}
                    className="software-icon"
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/48';
                    }}
                  />
                  <div className="software-details">
                    <IonCardTitle>{item.name}</IonCardTitle>
                    <IonCardSubtitle>版本：{item.version}</IonCardSubtitle>
                    <IonCardSubtitle>授權：{item.license}</IonCardSubtitle>
                  </div>
                  <IonIcon
                    icon={favorites.includes(item.id) ? star : starOutline}
                    className={`favorite-icon ${favorites.includes(item.id) ? 'favorited' : ''}`}
                    onClick={() => toggleFavorite(item.id)}
                  />
                </IonCardHeader>
                <IonCardContent>
                  <p>描述：{item.description}</p>
                  <p>
                    分類：
                    <span
                      className={`category-tag ${
                        activeCategoryTags.includes(item.category) ? 'selected' : ''
                      }`}
                      onClick={() => {
                        const newTags = activeCategoryTags.includes(item.category)
                          ? activeCategoryTags.filter(tag => tag !== item.category)
                          : [...activeCategoryTags, item.category];
                        setActiveCategoryTags(newTags);
                      }}
                    >
                      {item.category}
                    </span>
                  </p>
                  <p>
                    標籤：
                    {item.tags.map(tag => (
                      <span
                        key={tag}
                        className={`tag ${activeTags.includes(tag) ? 'selected' : ''}`}
                        onClick={() => {
                          const newTags = activeTags.includes(tag)
                            ? activeTags.filter(t => t !== tag)
                            : [...activeTags, tag];
                          setActiveTags(newTags);
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </p>
                  <div className="video-container">
                    {item.video ? (
                      <iframe
                        src={item.video}
                        title={`${item.name} 示範影片`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    ) : (
                      <div className="video-error">
                        <p>暫無示範影片</p>
                      </div>
                    )}
                  </div>
                </IonCardContent>
              </IonCard>
            ))
          )}
        </IonList>

        <IonInfiniteScroll onIonInfinite={handleLoadMore}>
          <IonInfiniteScrollContent loadingText="載入更多..." />
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default SoftwareList;
