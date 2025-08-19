import React, { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../components/firebase';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  EyeIcon,
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Fragment } from 'react';

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
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ContactEntry | null>(null);
  const [industryFilter, setIndustryFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

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

  // Get unique industries and services for filter dropdowns
  const allIndustries = Array.from(new Set(contacts.map(c => c.industry).filter(Boolean))).sort();
  const allServices = Array.from(new Set(contacts.flatMap(c => c.services || [])).values()).sort();

  // Filtered and searched contacts
  const filteredContacts = contacts.filter(c => {
    const matchesIndustry = !industryFilter || c.industry === industryFilter;
    const matchesService = !serviceFilter || (c.services || []).includes(serviceFilter);
    const matchesSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    return matchesIndustry && matchesService && matchesSearch;
  });

  const clearFilters = () => {
    setIndustryFilter('');
    setServiceFilter('');
    setSearch('');
  };

  const hasActiveFilters = industryFilter || serviceFilter || search;

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 h-16 rounded-xl"></div>
        </div>
      ))}
    </div>
  );

  // Contact Card Component for Grid View
  const ContactCard = ({ contact, index }: { contact: ContactEntry; index: number }) => (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <UserIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                {contact.name}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <BuildingOfficeIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
                {contact.company}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 dark:from-indigo-900 dark:to-blue-900 dark:text-indigo-200">
            #{index + 1}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <EnvelopeIcon className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
            <span className="text-slate-600 dark:text-slate-300 truncate">{contact.email}</span>
          </div>
          
          {contact.phone && (
            <div className="flex items-center gap-2 text-sm">
              <PhoneIcon className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
              <span className="text-slate-600 dark:text-slate-300">{contact.phone}</span>
            </div>
          )}

          {contact.industry && (
            <div className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {contact.industry}
            </div>
          )}

          {contact.services && contact.services.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {contact.services.slice(0, 2).map((service, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  {service}
                </span>
              ))}
              {contact.services.length > 2 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                  +{contact.services.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <ClockIcon className="h-3 w-3" />
            {contact.submittedAt || 'N/A'}
          </div>
          <button
            onClick={() => { setSelected(contact); setOpen(true); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
          >
            <EyeIcon className="h-3 w-3" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 mt-25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Contact Submissions
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Manage and review customer inquiries
              </p>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {contacts.length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {filteredContacts.length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Filtered</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-end">
              {/* Search */}
              <div className="flex-1 min-w-[280px]">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Search by name, company, or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Industry Filter */}
              <div className="min-w-[160px]">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Industry
                </label>
                <select
                  className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={industryFilter}
                  onChange={e => setIndustryFilter(e.target.value)}
                >
                  <option value="">All Industries</option>
                  {allIndustries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              {/* Service Filter */}
              <div className="min-w-[160px]">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Service
                </label>
                <select
                  className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={serviceFilter}
                  onChange={e => setServiceFilter(e.target.value)}
                >
                  <option value="">All Services</option>
                  {allServices.map(serv => (
                    <option key={serv} value={serv}>{serv}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                )}
                
                {/* View Toggle */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
                  <button
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      viewMode === 'table'
                        ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                    onClick={() => setViewMode('table')}
                  >
                    Table
                  </button>
                  <button
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                    onClick={() => setViewMode('grid')}
                  >
                    Grid
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Section */}
        {loading ? (
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <LoadingSkeleton />
            </CardContent>
          </Card>
        ) : filteredContacts.length === 0 ? (
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <DocumentTextIcon className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                No contacts found
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                {hasActiveFilters 
                  ? "Try adjusting your filters to see more results." 
                  : "No contact submissions have been received yet."
                }
              </p>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredContacts.map((contact, idx) => (
              <ContactCard key={contact.id} contact={contact} index={idx} />
            ))}
          </div>
        ) : (
          /* Table View */
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Company & Industry
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Services
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredContacts.map((contact, idx) => (
                      <tr key={contact.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                          #{idx + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                              {contact.name}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              {contact.email}
                            </div>
                            {contact.phone && (
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {contact.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                              {contact.company}
                            </div>
                            {contact.industry && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 mt-1">
                                {contact.industry}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {contact.services?.slice(0, 2).map((service, serviceIdx) => (
                              <span key={serviceIdx} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                {service}
                              </span>
                            ))}
                            {contact.services && contact.services.length > 2 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                                +{contact.services.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                          {contact.submittedAt || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => { setSelected(contact); setOpen(true); }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                          >
                            <EyeIcon className="h-4 w-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Modal Dialog */}
        <Transition appear show={open} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white dark:bg-slate-800 p-8 text-left align-middle shadow-2xl transition-all border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-6">
                      <Dialog.Title className="text-2xl font-bold text-slate-900 dark:text-white">
                        Contact Details
                      </Dialog.Title>
                      <button
                        onClick={() => setOpen(false)}
                        className="p-2 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>

                    {selected && (
                      <div className="space-y-6">
                        {/* Personal Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                              <UserIcon className="h-4 w-4" />
                              Full Name
                            </div>
                            <div className="text-lg font-semibold text-slate-900 dark:text-white">
                              {selected.name}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                              <BuildingOfficeIcon className="h-4 w-4" />
                              Company
                            </div>
                            <div className="text-lg font-semibold text-slate-900 dark:text-white">
                              {selected.company}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                              <EnvelopeIcon className="h-4 w-4" />
                              Email
                            </div>
                            <div className="text-lg font-semibold text-slate-900 dark:text-white">
                              {selected.email}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                              <PhoneIcon className="h-4 w-4" />
                              Phone
                            </div>
                            <div className="text-lg font-semibold text-slate-900 dark:text-white">
                              {selected.phone || 'Not provided'}
                            </div>
                          </div>
                        </div>

                        {/* Industry & Services */}
                        <div className="space-y-4">
                          {selected.industry && (
                            <div>
                              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                                Industry
                              </div>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                                {selected.industry}
                              </span>
                            </div>
                          )}

                          {selected.services && selected.services.length > 0 && (
                            <div>
                              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                                Requested Services
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {selected.services.map((service, idx) => (
                                  <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                                    {service}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Message */}
                        {selected.message && (
                          <div>
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
                              <DocumentTextIcon className="h-4 w-4" />
                              Message
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-slate-700 dark:text-slate-300 leading-relaxed">
                              {selected.message}
                            </div>
                          </div>
                        )}

                        {/* Timestamp */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <ClockIcon className="h-4 w-4" />
                            Submitted: {selected.submittedAt || 'Unknown'}
                          </div>
                          <button
                            onClick={() => setOpen(false)}
                            className="px-6 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default AdminContactList;
