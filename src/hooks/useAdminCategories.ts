// src/hooks/useAdminCategories.ts

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../components/firebase';

interface CategoryItem {
  id: string;
  name: string;
}

export const useAdminCategories = (categoryName: string) => {
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const itemsCollectionRef = collection(db, 'categories', categoryName, 'items');
      const snapshot = await getDocs(itemsCollectionRef);
      
      const fetchedItems = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }));
      
      setItems(fetchedItems);
    } catch (err) {
      console.error(`Error fetching ${categoryName}:`, err);
      setError(`Failed to load ${categoryName}`);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryName) {
      fetchCategories();
    }
  }, [categoryName]);

  return { items, loading, error, refetch: fetchCategories };
};

// Hook for multiple categories at once
export const useAllCategories = () => {
  const countries = useAdminCategories('countries');
  const emirates = useAdminCategories('emirates');
  const yearsInOperation = useAdminCategories('yearsOfOperation');
  const businessTypes = useAdminCategories('businessTypes');
  const employeeCount = useAdminCategories('employeeCount');

  return {
    countries,
    emirates,
    yearsInOperation,
    businessTypes,
    employeeCount,
    loading: countries.loading || emirates.loading || yearsInOperation.loading || businessTypes.loading || employeeCount.loading,
    error: countries.error || emirates.error || yearsInOperation.error || businessTypes.error || employeeCount.error
  };
};
