// src/components/admin/CategoryManager.tsx

import React, { useState, useEffect } from 'react';
import { db } from '../firebase.ts';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

const CategoryManager = ({ categoryName, title }) => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Reference to the specific sub-collection inside 'categories'
  const itemsCollectionRef = collection(db, 'categories', categoryName, 'items');

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getDocs(itemsCollectionRef);
      setItems(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setIsLoading(false);
    };
    fetchItems();
  }, [categoryName]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    try {
      const docRef = await addDoc(itemsCollectionRef, { name: newItem });
      setItems([...items, { id: docRef.id, name: newItem }]);
      setNewItem(''); // Clear the input field
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const itemDoc = doc(db, 'categories', categoryName, 'items', id);
      await deleteDoc(itemDoc);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <form onSubmit={handleAddItem} className="flex gap-2 mb-4">
        <Input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={`Add new ${title}`}
          className="flex-grow"
        />
        <Button type="submit">Add</Button>
      </form>
      {isLoading ? <p>Loading...</p> : (
        <ul className="space-y-2">
          {items.map(item => (
            <li key={item.id} className="flex justify-between items-center p-2 bg-muted rounded">
              <span>{item.name}</span>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryManager;
