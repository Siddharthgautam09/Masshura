// src/components/admin/CategoryManager.tsx

import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const { toast } = useToast();

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setAuthLoading(false);
      console.log('Auth state changed:', user ? 'Logged in' : 'Logged out');
      console.log('User UID:', user?.uid);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching items for category:', categoryName);
        
        // Create collection reference inside the effect to ensure it's fresh
        const itemsCollectionRef = collection(db, 'categories', categoryName, 'items');
        const data = await getDocs(itemsCollectionRef);
        
        console.log('Fetched data:', data.docs.length, 'items');
        const fetchedItems = data.docs.map(doc => {
          const docData = doc.data();
          console.log('Document data:', docData);
          return { ...docData, id: doc.id } as CategoryItem;
        });
        setItems(fetchedItems);
      } catch (error: any) {
        console.error('Error fetching items:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        let errorMessage = "Failed to load items. Please refresh the page.";
        if (error.code === 'permission-denied') {
          errorMessage = "Permission denied. Please check Firestore rules or try logging in again.";
        } else if (error.code === 'unavailable') {
          errorMessage = "Database temporarily unavailable. Please try again.";
        } else if (error.code === 'failed-precondition') {
          errorMessage = "Firestore rules not configured. Please deploy firestore rules.";
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (categoryName) {
      fetchItems();
    }
  }, [categoryName, toast]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid item name.",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAdding(true);
    try {
      console.log('Adding item:', newItem.trim(), 'to category:', categoryName);
      console.log('Current user:', auth.currentUser?.uid);
      
      // Create collection reference for adding
      const itemsCollectionRef = collection(db, 'categories', categoryName, 'items');
      const docRef = await addDoc(itemsCollectionRef, { 
        name: newItem.trim(),
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser?.uid || 'admin'
      });
      
      console.log('Item added with ID:', docRef.id);
      setItems(prev => [...prev, { id: docRef.id, name: newItem.trim() }]);
      setNewItem(''); // Clear the input field
      toast({
        title: "Success!",
        description: `Added "${newItem.trim()}" successfully.`,
      });
    } catch (error: any) {
      console.error('Error adding item:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      let errorMessage = "Failed to add item. Please try again.";
      if (error.code === 'permission-denied') {
        errorMessage = "Permission denied. Firestore rules may not be deployed. Please deploy rules or check authentication.";
      } else if (error.code === 'unavailable') {
        errorMessage = "Database temporarily unavailable. Please try again.";
      } else if (error.code === 'failed-precondition') {
        errorMessage = "Firestore rules not configured properly. Please deploy firestore rules.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteItem = async (id: string, itemName: string) => {
    try {
      console.log('Deleting item:', itemName, 'from category:', categoryName);
      
      // Create document reference for deleting
      const itemDoc = doc(db, 'categories', categoryName, 'items', id);
      await deleteDoc(itemDoc);
      
      setItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Success!",
        description: `Deleted "${itemName}" successfully.`,
      });
    } catch (error: any) {
      console.error('Error deleting item:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      let errorMessage = "Failed to delete item. Please try again.";
      if (error.code === 'permission-denied') {
        errorMessage = "Permission denied. Please ensure you're logged in as admin.";
      } else if (error.code === 'unavailable') {
        errorMessage = "Database temporarily unavailable. Please try again.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Authentication Status */}
      <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
        <div className="text-white font-medium">
          {title || `Manage ${categoryName}`}
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-slate-300">
            {authLoading ? 'Checking auth...' : isAuthenticated ? 'Authenticated' : 'Not authenticated'}
          </span>
        </div>
      </div>

      {/* Debug info */}
      <div className="text-xs text-slate-400 mb-2 p-2 bg-slate-700/20 rounded">
        <span className="text-white font-medium">Category:</span> {categoryName} | 
        <span className="text-white font-medium"> Items:</span> {items.length} | 
        <span className="text-white font-medium"> Status:</span> {isLoading ? 'Loading...' : 'Ready'} |
        <span className="text-white font-medium"> User:</span> {auth.currentUser?.uid || 'Not logged in'}
      </div>
      
      <form onSubmit={handleAddItem} className="flex gap-3">
        <Input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Enter new item name"
          className="flex-grow bg-slate-700/50 border-slate-500 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400 focus:text-white"
        />
        <Button 
          type="submit"
          disabled={isAdding || !newItem.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Adding...
            </div>
          ) : (
            'Add Item'
          )}
        </Button>
      </form>
      
      {isLoading ? (
        <div className="text-white text-center py-6 bg-slate-700/30 rounded-lg">
          <div className="animate-pulse">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full mx-auto mb-2"></div>
            Loading items...
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-8 bg-slate-700/20 rounded-lg border border-slate-600/30">
              <div className="text-slate-400 mb-2">No items found</div>
              <div className="text-white text-sm">Add your first item using the form above</div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-white font-medium mb-2">
                Current Items ({items.length}):
              </div>
              {items.map((item, index) => (
                <div key={item.id} className="flex justify-between items-center p-4 bg-slate-700/40 rounded-lg border border-slate-600/30 hover:bg-slate-700/60 transition-colors">
                  <div className="flex items-center">
                    <span className="text-xs text-slate-400 w-6">{index + 1}.</span>
                    <span className="text-white font-medium ml-2">{item.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteItem(item.id, item.name)}
                    className="text-red-400 hover:text-white hover:bg-red-600/20 border border-red-500/30 hover:border-red-400"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
