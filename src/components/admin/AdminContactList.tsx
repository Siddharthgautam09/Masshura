import React, { useEffect, useState } from 'react';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../components/firebase';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

interface ContactEntry {
  id: string;
  name: string;
  company: string;
  industry: string;
  email: string;
  phone: string;
  services: string[];
  message: string;
  submittedAt?: string;
}

const AdminContactList: React.FC = () => {
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'contacts'));
        let data = snapshot.docs.map(doc => {
          const d = doc.data();
          let submittedAt = d.submittedAt;
          if (submittedAt && typeof submittedAt.toDate === 'function') {
            submittedAt = submittedAt.toDate().toLocaleString();
          } else if (typeof submittedAt === 'string') {
            // fallback if string
          } else {
            submittedAt = '-';
          }
          return { id: doc.id, ...d, submittedAt };
        }) as ContactEntry[];
        // Sort by submittedAt desc if possible
        data = data.sort((a, b) => {
          const aTime = new Date(a.submittedAt || 0).getTime();
          const bTime = new Date(b.submittedAt || 0).getTime();
          return bTime - aTime;
        });
        setContacts(data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <Card className="bg-slate-800/60 border-slate-600/50 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Contact Submissions</CardTitle>
          <CardDescription className="text-slate-300">All queries submitted via the Contact Us form</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-slate-300">Loading...</div>
          ) : contacts.length === 0 ? (
            <div className="text-slate-300">No contact submissions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-slate-200">SNo.</th>
                    <th className="px-4 py-2 text-left text-slate-200">Name</th>
                    <th className="px-4 py-2 text-left text-slate-200">Company</th>
                    <th className="px-4 py-2 text-left text-slate-200">Industry</th>
                    <th className="px-4 py-2 text-left text-slate-200">Email</th>
                    <th className="px-4 py-2 text-left text-slate-200">Phone</th>
                    <th className="px-4 py-2 text-left text-slate-200">Services</th>
                    <th className="px-4 py-2 text-left text-slate-200">Message</th>
                    <th className="px-4 py-2 text-left text-slate-200">Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact, idx) => (
                    <tr key={contact.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                      <td className="px-4 py-2 text-slate-100">{idx + 1}</td>
                      <td className="px-4 py-2 text-slate-100">{contact.name}</td>
                      <td className="px-4 py-2 text-slate-100">{contact.company}</td>
                      <td className="px-4 py-2 text-slate-100">{contact.industry}</td>
                      <td className="px-4 py-2 text-slate-100">{contact.email}</td>
                      <td className="px-4 py-2 text-slate-100">{contact.phone}</td>
                      <td className="px-4 py-2 text-slate-100">{contact.services?.join(', ')}</td>
                      <td className="px-4 py-2 text-slate-100">{contact.message}</td>
                      <td className="px-4 py-2 text-slate-100">{contact.submittedAt || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContactList;
