// src/components/admin/CategoryManager.tsx

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface CategoryManagerProps {
  categoryName: string;
  title?: string;
}

interface CategoryItem {
  id: string;
  name: string;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categoryName, title }) => {
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  // Reference to the specific sub-collection inside 'categories'
  const itemsCollectionRef = collection(db, 'categories', categoryName, 'items');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching items for category:', categoryName);
        const data = await getDocs(itemsCollectionRef);
        console.log('Fetched data:', data.docs.length, 'items');
        setItems(data.docs.map(doc => ({ ...doc.data(), id: doc.id } as CategoryItem)));
      } catch (error) {
        console.error('Error fetching items:', error);
        toast({
          title: "Error",
          description: "Failed to load items. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, [categoryName, toast]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    
    setIsAdding(true);
    try {
      console.log('Adding item:', newItem.trim(), 'to category:', categoryName);
      const docRef = await addDoc(itemsCollectionRef, { name: newItem.trim() });
      console.log('Item added with ID:', docRef.id);
      setItems(prev => [...prev, { id: docRef.id, name: newItem.trim() }]);
      setNewItem(''); // Clear the input field
      toast({
        title: "Success",
        description: `Added "${newItem.trim()}" successfully.`,
      });
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteItem = async (id: string, itemName: string) => {
    try {
      const itemDoc = doc(db, 'categories', categoryName, 'items', id);
      await deleteDoc(itemDoc);
      setItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: `Deleted "${itemName}" successfully.`,
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Debug info */}
      <div className="text-xs text-slate-400 mb-2">
        Category: {categoryName} | Items: {items.length} | Loading: {isLoading.toString()}
      </div>
      
      <form onSubmit={handleAddItem} className="flex gap-2">
        <Input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item"
          className="flex-grow bg-slate-700/50 border-slate-500 text-slate-200 placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400"
        />
        <Button 
          type="submit"
          disabled={isAdding || !newItem.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          {isAdding ? 'Adding...' : 'Add'}
        </Button>
      </form>
      
      {isLoading ? (
        <div className="text-slate-300 text-center py-4">Loading...</div>
      ) : (
        <div className="space-y-2">
          {items.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No items added yet</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                <span className="text-slate-200">{item.name}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDeleteItem(item.id, item.name)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
