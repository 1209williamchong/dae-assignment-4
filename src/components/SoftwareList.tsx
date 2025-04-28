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
} from '@ionic/react';
import { bookmarkOutline, bookmark } from 'ionicons/icons';
import { softwareData } from '../data/softwareData';
import { useAuthStore } from '../stores/auth';
import { apiService } from '../services/api';

const SoftwareList: React.FC = () => {
  const [software, setSoftware] = useState(softwareData);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuthStore();

  const categories = Array.from(new Set(softwareData.flatMap(item => item.categories)));

  const filteredSoftware = software.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = !selectedCategory || item.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleBookmark = async (name: string) => {
    if (!isAuthenticated) {
      setError('請先登入以使用書籤功能');
      return;
    }

    try {
      setIsLoading(true);
      await apiService.toggleBookmark(name);
      setSoftware(prev => prev.map(item => 
        item.name === name ? { ...item, isBookmarked: !item.isBookmarked } : item
      ));
    } catch (err) {
      setError('書籤操作失敗');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>開源軟體清單</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSearchbar
          value={searchText}
          onIonChange={e => setSearchText(e.detail.value!)}
          placeholder="搜尋軟體..."
        />
        <IonSelect
          value={selectedCategory}
          placeholder="選擇分類"
          onIonChange={e => setSelectedCategory(e.detail.value)}
        >
          <IonSelectOption value="">全部</IonSelectOption>
          {categories.map(category => (
            <IonSelectOption key={category} value={category}>
              {category}
            </IonSelectOption>
          ))}
        </IonSelect>
        <IonList>
          {filteredSoftware.map(item => (
            <IonItem key={item.name}>
              <IonLabel>
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <p>版本: {item.version}</p>
                <p>授權: {item.license}</p>
                <p>分類: {item.categories.join(', ')}</p>
              </IonLabel>
              <IonButton
                fill="clear"
                onClick={() => handleBookmark(item.name)}
              >
                <IonIcon
                  icon={item.isBookmarked ? bookmark : bookmarkOutline}
                  color={item.isBookmarked ? 'primary' : 'medium'}
                />
              </IonButton>
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
