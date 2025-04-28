import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonLoading,
  IonToast,
  IonBadge,
  IonChip,
} from '@ionic/react';
import { bookmarkOutline, bookmark, star, gitBranch, alertCircle } from 'ionicons/icons';
import { softwareData, Software } from '../data/softwareData';
import { useAuthStore } from '../stores/auth';
import { apiService } from '../services/api';
import './SoftwareList.css';

const SoftwareList: React.FC = () => {
  const [filteredSoftware, setFilteredSoftware] = useState<Software[]>(softwareData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    filterSoftware();
  }, [searchTerm, selectedCategory]);

  const filterSoftware = () => {
    let filtered = softwareData;

    if (searchTerm) {
      filtered = filtered.filter(software =>
        software.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        software.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(software =>
        software.categories.includes(selectedCategory)
      );
    }

    setFilteredSoftware(filtered);
  };

  const toggleBookmark = async (softwareName: string) => {
    if (!isAuthenticated) {
      setError('請先登入以使用書籤功能');
      return;
    }

    try {
      setIsLoading(true);
      await apiService.toggleBookmark(softwareName);
      const newBookmarks = new Set(bookmarks);
      if (newBookmarks.has(softwareName)) {
        newBookmarks.delete(softwareName);
      } else {
        newBookmarks.add(softwareName);
      }
      setBookmarks(newBookmarks);
    } catch (err) {
      setError('書籤操作失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategories = () => {
    const categories = new Set<string>();
    softwareData.forEach(software => {
      software.categories.forEach(category => categories.add(category));
    });
    return Array.from(categories);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>開源軟體清單</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="filters">
          <input
            type="text"
            placeholder="搜索軟體..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="all">所有類別</option>
            {getCategories().map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <IonList>
          {filteredSoftware.map(software => (
            <IonItem key={software.name} className="software-item">
              <div className="software-content">
                <div className="software-header">
                  <IonLabel>
                    <h2>{software.name}</h2>
                    <p>{software.description}</p>
                  </IonLabel>
                  <IonButton
                    fill="clear"
                    onClick={() => toggleBookmark(software.name)}
                    className={bookmarks.has(software.name) ? 'bookmarked' : ''}
                  >
                    <IonIcon icon={bookmark} />
                  </IonButton>
                </div>

                <div className="software-meta">
                  <div className="categories">
                    {software.categories.map(category => (
                      <IonChip key={category} color="primary">
                        {category}
                      </IonChip>
                    ))}
                  </div>

                  <div className="stats">
                    <IonBadge color="warning">
                      <IonIcon icon={star} /> {software.stars.toLocaleString()}
                    </IonBadge>
                    <IonBadge color="medium">
                      <IonIcon icon={gitBranch} /> {software.forks.toLocaleString()}
                    </IonBadge>
                    <IonBadge color="danger">
                      <IonIcon icon={alertCircle} /> {software.issues.toLocaleString()}
                    </IonBadge>
                  </div>

                  <div className="details">
                    <span>版本: {software.version}</span>
                    <span>語言: {software.language}</span>
                    <span>授權: {software.license}</span>
                    <span>更新: {software.lastUpdated}</span>
                  </div>

                  <IonButton
                    fill="outline"
                    href={software.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    查看源碼
                  </IonButton>
                </div>
              </div>
            </IonItem>
          ))}
        </IonList>
        <IonLoading isOpen={isLoading} message="處理中..." />
        <IonToast
          isOpen={!!error}
          message={error || ''}
          duration={2000}
          onDidDismiss={() => setError(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default SoftwareList;
