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
} from '@ionic/react';
import { star, starOutline } from 'ionicons/icons';
import { Chart } from 'chart.js/auto';
import './SoftwareList.css';

interface Software {
  name: string;
  version: string;
  license: string;
  category: string;
  icon: string;
  video: string;
  description: string;
  tags: string[];
  date: string;
}

const softwareData: Software[] = [
  {
    name: "Mozilla Firefox",
    version: "125.0.1",
    license: "Mozilla Public License 2.0",
    category: "網頁瀏覽器",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Firefox_logo%2C_2019.svg/120px-Firefox_logo%2C_2019.svg.png",
    video: "https://www.youtube.com/embed/lmeDvSgN6zY?si=xlXxFoMH45yjawIL",
    description: "Mozilla Firefox 是一款快速、安全的開源網頁瀏覽器，支持眾多擴充功能。",
    tags: ["瀏覽器", "網頁", "開源"],
    date: "2025-04-01"
  },
  // ... 其他軟體數據
];

const SoftwareList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFields, setSearchFields] = useState<string[]>(['name', 'description', 'tags']);
  const [exactMatch, setExactMatch] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['']);
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState(true);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [activeCategoryTags, setActiveCategoryTags] = useState<string[]>([]);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('softwareFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && chartRef.current) {
      updateChart();
    }
  }, [isLoading]);

  const updateChart = () => {
    if (!chartRef.current) return;

    const categories = softwareData.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(categories);
    const data = labels.map(label => categories[label]);
    const backgroundColors = labels.map((_, i) => `hsl(${i * 36}, 70%, 50%)`);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: backgroundColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: { size: 12 },
              padding: 10
            }
          }
        }
      }
    });
  };

  const handleToggleFavorite = (name: string) => {
    const newFavorites = favorites.includes(name)
      ? favorites.filter(f => f !== name)
      : [...favorites, name];
    setFavorites(newFavorites);
    localStorage.setItem('softwareFavorites', JSON.stringify(newFavorites));
  };

  const filteredSoftware = softwareData.filter(software => {
    const matchesSearch = searchTerm ? searchFields.some(field => {
      const value = software[field as keyof Software]?.toString().toLowerCase() || '';
      return exactMatch ? value === searchTerm.toLowerCase() : value.includes(searchTerm.toLowerCase());
    }) : true;

    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(software.category) || 
      (selectedCategories.includes('favorites') && favorites.includes(software.name));

    const matchesCategoryTags = activeCategoryTags.length === 0 || 
      activeCategoryTags.includes(software.category);

    const matchesTags = activeCategoryTags.length === 0 || 
      software.tags.some(tag => activeTags.includes(tag));

    const softwareDate = new Date(software.date);
    const matchesDate = (!startDate || softwareDate >= new Date(startDate)) &&
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
            value={searchTerm}
            onIonInput={e => setSearchTerm(e.detail.value || '')}
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
          <IonSegment value={viewMode} onIonChange={e => setViewMode(e.detail.value as 'list' | 'grid')} className="custom-segment">
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
          {isLoading ? (
            <div className="skeleton-chart" />
          ) : (
            <canvas ref={chartRef} />
          )}
        </div>
        <IonList className={`${viewMode}-view fade-toggle`}>
          {filteredSoftware.length === 0 ? (
            <div className="no-results">
              <p>沒有找到符合條件的軟體</p>
            </div>
          ) : (
            filteredSoftware.map(software => (
              <IonCard key={software.name} className="custom-card">
                <IonCardHeader>
                  <img 
                    src={software.icon} 
                    alt={`${software.name} 圖示`} 
                    className="software-icon"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/48';
                    }}
                  />
                  <div className="software-details">
                    <IonCardTitle>{software.name}</IonCardTitle>
                    <IonCardSubtitle>版本：{software.version}</IonCardSubtitle>
                    <IonCardSubtitle>授權：{software.license}</IonCardSubtitle>
                  </div>
                  <IonIcon
                    icon={favorites.includes(software.name) ? star : starOutline}
                    className={`favorite-icon ${favorites.includes(software.name) ? 'favorited' : ''}`}
                    onClick={() => handleToggleFavorite(software.name)}
                  />
                </IonCardHeader>
                <IonCardContent>
                  <p>描述：{software.description}</p>
                  <p>
                    分類：
                    <span 
                      className={`category-tag ${activeCategoryTags.includes(software.category) ? 'selected' : ''}`}
                      onClick={() => {
                        const newTags = activeCategoryTags.includes(software.category)
                          ? activeCategoryTags.filter(tag => tag !== software.category)
                          : [...activeCategoryTags, software.category];
                        setActiveCategoryTags(newTags);
                      }}
                    >
                      {software.category}
                    </span>
                  </p>
                  <p>
                    標籤：
                    {software.tags.map(tag => (
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
                    {software.video ? (
                      <iframe
                        src={software.video}
                        title={`${software.name} 示範影片`}
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
      </IonContent>
    </IonPage>
  );
};

export default SoftwareList;
