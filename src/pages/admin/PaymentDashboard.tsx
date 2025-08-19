// src/pages/admin/PaymentDashboard.tsx

import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../../components/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  DollarSign,
  Calendar,
  Building,
  Filter,
  Download,
  Search,
  Users,
  TrendingUp,
  Eye,
  RefreshCw,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

interface PaymentRecord {
  id: string;
  companyName: string;
  email: string;
  contactPerson?: string;
  paymentStatus: string;
  paymentDate?: string;
  paymentAmount?: number;
  registrationAmount?: number;
  subscriptionAmount?: number;
  subscriptionDuration?: number;
  paymentMethod?: string;
  paymentId?: string;
  subscriptionExpiryDate?: string;
  submittedAt?: string;
  status: string;
  businessType?: string;
  phone?: string;
}

interface PaymentStats {
  totalPayments: number;
  totalRevenue: number;
  completedPayments: number;
  pendingPayments: number;
  averagePayment: number;
}

const PaymentDashboard = () => {
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<PaymentRecord[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    totalPayments: 0,
    totalRevenue: 0,
    completedPayments: 0,
    pendingPayments: 0,
    averagePayment: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<PaymentRecord | null>(
    null
  );

  // Filter states
  const [filters, setFilters] = useState({
    companyName: "",
    paymentStatus: "all",
    dateFrom: "",
    dateTo: "",
    businessType: "",
    subscriptionStatus: "all",
  });

  const { toast } = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    fetchPaymentRecords();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [paymentRecords, filters]);

  const fetchPaymentRecords = async () => {
    setIsLoading(true);
    try {
      const suppliersRef = collection(db, "suppliers");
      const suppliersSnapshot = await getDocs(suppliersRef);

      const records: PaymentRecord[] = [];

      suppliersSnapshot.forEach((doc) => {
        const data = doc.data();
        records.push({
          id: doc.id,
          companyName: data.companyName || "N/A",
          email: data.email || "N/A",
          contactPerson: data.contactPerson || data.contactName,
          paymentStatus: data.paymentStatus || "pending",
          paymentDate: data.paymentDate,
          paymentAmount: data.paymentAmount,
          registrationAmount: data.registrationAmount,
          subscriptionAmount: data.subscriptionAmount,
          subscriptionDuration: data.subscriptionDuration,
          paymentMethod: data.paymentMethod,
          paymentId: data.paymentId,
          subscriptionExpiryDate: data.subscriptionExpiryDate,
          submittedAt: data.submittedAt,
          status: data.status || "pending",
          businessType: data.businessType,
          phone: data.phone,
        });
      });

      // Sort by payment date (most recent first)
      records.sort((a, b) => {
        if (!a.paymentDate && !b.paymentDate) return 0;
        if (!a.paymentDate) return 1;
        if (!b.paymentDate) return -1;
        return (
          new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
        );
      });

      setPaymentRecords(records);
      calculateStats(records);
    } catch (error) {
      console.error("Error fetching payment records:", error);
      toast({
        title: "Error",
        description: "Failed to fetch payment records.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (records: PaymentRecord[]) => {
    const completedPayments = records.filter(
      (r) => r.paymentStatus === "completed"
    );
    const pendingPayments = records.filter(
      (r) => r.paymentStatus !== "completed"
    );
    const totalRevenue = completedPayments.reduce(
      (sum, r) => sum + (r.paymentAmount || 0),
      0
    );
    const averagePayment =
      completedPayments.length > 0
        ? totalRevenue / completedPayments.length
        : 0;

    setStats({
      totalPayments: records.length,
      totalRevenue,
      completedPayments: completedPayments.length,
      pendingPayments: pendingPayments.length,
      averagePayment,
    });
  };

  const applyFilters = () => {
    let filtered = [...paymentRecords];

    // Company name filter
    if (filters.companyName) {
      filtered = filtered.filter(
        (record) =>
          record.companyName
            .toLowerCase()
            .includes(filters.companyName.toLowerCase()) ||
          record.email.toLowerCase().includes(filters.companyName.toLowerCase())
      );
    }

    // Payment status filter
    if (filters.paymentStatus !== "all") {
      filtered = filtered.filter(
        (record) => record.paymentStatus === filters.paymentStatus
      );
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter((record) => {
        if (!record.paymentDate) return false;
        return new Date(record.paymentDate) >= new Date(filters.dateFrom);
      });
    }

    if (filters.dateTo) {
      filtered = filtered.filter((record) => {
        if (!record.paymentDate) return false;
        return new Date(record.paymentDate) <= new Date(filters.dateTo);
      });
    }

    // Business type filter
    if (filters.businessType) {
      filtered = filtered.filter((record) =>
        record.businessType
          ?.toLowerCase()
          .includes(filters.businessType.toLowerCase())
      );
    }

    // Subscription status filter
    if (filters.subscriptionStatus !== "all") {
      filtered = filtered.filter((record) => {
        if (!record.subscriptionExpiryDate)
          return filters.subscriptionStatus === "no-subscription";

        const expiryDate = new Date(record.subscriptionExpiryDate);
        const now = new Date();
        const daysRemaining = Math.ceil(
          (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        switch (filters.subscriptionStatus) {
          case "active":
            return daysRemaining > 30;
          case "expiring-soon":
            return daysRemaining <= 30 && daysRemaining > 0;
          case "expired":
            return daysRemaining <= 0;
          default:
            return true;
        }
      });
    }

    setFilteredRecords(filtered);
  };

  const clearFilters = () => {
    setFilters({
      companyName: "",
      paymentStatus: "all",
      dateFrom: "",
      dateTo: "",
      businessType: "",
      subscriptionStatus: "all",
    });
  };

  const exportToCSV = () => {
    const csvContent = [
      [
        "Company Name",
        "Email",
        "Contact Person",
        "Payment Status",
        "Payment Date",
        "Amount",
        "Method",
        "Subscription Expires",
        "Business Type",
      ].join(","),
      ...filteredRecords.map((record) =>
        [
          record.companyName,
          record.email,
          record.contactPerson || "",
          record.paymentStatus,
          record.paymentDate
            ? new Date(record.paymentDate).toLocaleDateString()
            : "",
          record.paymentAmount || "",
          record.paymentMethod || "",
          record.subscriptionExpiryDate
            ? new Date(record.subscriptionExpiryDate).toLocaleDateString()
            : "",
          record.businessType || "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payment-records-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getSubscriptionStatus = (record: PaymentRecord) => {
    if (!record.subscriptionExpiryDate)
      return {
        status: "no-subscription",
        label: "No Subscription",
        color: "bg-slate-600/20 text-slate-400 border-slate-600/30",
      };

    const expiryDate = new Date(record.subscriptionExpiryDate);
    const now = new Date();
    const daysRemaining = Math.ceil(
      (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysRemaining <= 0) {
      return {
        status: "expired",
        label: `Expired ${Math.abs(daysRemaining)}d ago`,
        color: "bg-red-600/20 text-red-400 border-red-600/30",
      };
    } else if (daysRemaining <= 30) {
      return {
        status: "expiring-soon",
        label: `${daysRemaining}d left`,
        color: "bg-orange-600/20 text-orange-400 border-orange-600/30",
      };
    } else {
      return {
        status: "active",
        label: `${daysRemaining}d left`,
        color: "bg-green-600/20 text-green-400 border-green-600/30",
      };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full mb-4"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white font-medium"
              >
                Loading payment dashboard...
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="pt-20 pb-8">
        <button
          className="mt-4 ml-8 px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 transition"
          style={{ alignSelf: "flex-start" }}
          onClick={() => navigate("/admin")}
        >
          ← Back
        </button>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <CreditCard className="w-10 h-10 text-green-400" />
                  Payment Dashboard
                </h1>
                <p className="text-slate-400 text-lg">
                  Monitor company payments and subscription status
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={fetchPaymentRecords}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button
                  onClick={exportToCSV}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
          >
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Companies</p>
                    <p className="text-2xl font-bold text-white">
                      {stats.totalPayments}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">
                      ₹{stats.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Paid Companies</p>
                    <p className="text-2xl font-bold text-white">
                      {stats.completedPayments}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Pending Payments</p>
                    <p className="text-2xl font-bold text-white">
                      {stats.pendingPayments}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Avg Payment</p>
                    <p className="text-2xl font-bold text-white">
                      ₹{Math.round(stats.averagePayment).toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-400" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Company Name Filter */}
                  <div>
                    <Label className="text-slate-300 text-sm font-medium">
                      Company Name / Email
                    </Label>
                    <Input
                      placeholder="Search company or email..."
                      value={filters.companyName}
                      onChange={(e) =>
                        setFilters({ ...filters, companyName: e.target.value })
                      }
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 mt-2"
                    />
                  </div>

                  {/* Payment Status Filter */}
                  <div>
                    <Label className="text-slate-300 text-sm font-medium">
                      Payment Status
                    </Label>
                    <Select
                      value={filters.paymentStatus}
                      onValueChange={(value) =>
                        setFilters({ ...filters, paymentStatus: value })
                      }
                    >
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Range Filters */}
                  <div>
                    <Label className="text-slate-300 text-sm font-medium">
                      Payment Date From
                    </Label>
                    <Input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) =>
                        setFilters({ ...filters, dateFrom: e.target.value })
                      }
                      className="bg-slate-700/50 border-slate-600 text-white mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300 text-sm font-medium">
                      Payment Date To
                    </Label>
                    <Input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) =>
                        setFilters({ ...filters, dateTo: e.target.value })
                      }
                      className="bg-slate-700/50 border-slate-600 text-white mt-2"
                    />
                  </div>

                  {/* Business Type Filter */}
                  <div>
                    <Label className="text-slate-300 text-sm font-medium">
                      Business Type
                    </Label>
                    <Input
                      placeholder="e.g., Manufacturing, Trading..."
                      value={filters.businessType}
                      onChange={(e) =>
                        setFilters({ ...filters, businessType: e.target.value })
                      }
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 mt-2"
                    />
                  </div>

                  {/* Subscription Status Filter */}
                  <div>
                    <Label className="text-slate-300 text-sm font-medium">
                      Subscription Status
                    </Label>
                    <Select
                      value={filters.subscriptionStatus}
                      onValueChange={(value) =>
                        setFilters({ ...filters, subscriptionStatus: value })
                      }
                    >
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="all">All Subscriptions</SelectItem>
                        <SelectItem value="active">
                          Active (30+ days)
                        </SelectItem>
                        <SelectItem value="expiring-soon">
                          Expiring Soon
                        </SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="no-subscription">
                          No Subscription
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Clear Filters Button */}
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50"
                  >
                    Clear Filters
                  </Button>

                  {/* Results Count */}
                  <div className="text-center pt-4 border-t border-slate-600/30">
                    <p className="text-slate-400 text-sm">
                      Showing {filteredRecords.length} of{" "}
                      {paymentRecords.length} records
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Records Table */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3"
            >
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-400" />
                      Payment Records
                    </div>
                    <Badge
                      variant="outline"
                      className="text-slate-300 border-slate-500"
                    >
                      {filteredRecords.length} Records
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-600/30">
                          <th className="text-left py-3 px-4 text-slate-300 font-medium">
                            Company
                          </th>
                          <th className="text-left py-3 px-4 text-slate-300 font-medium">
                            Payment
                          </th>
                          <th className="text-left py-3 px-4 text-slate-300 font-medium">
                            Amount
                          </th>
                          <th className="text-left py-3 px-4 text-slate-300 font-medium">
                            Subscription
                          </th>
                          <th className="text-left py-3 px-4 text-slate-300 font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {filteredRecords.map((record, index) => {
                            const subscriptionStatus =
                              getSubscriptionStatus(record);
                            return (
                              <motion.tr
                                key={record.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.05 }}
                                className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                              >
                                <td className="py-4 px-4">
                                  <div>
                                    <p className="text-white font-medium">
                                      {record.companyName}
                                    </p>
                                    <p className="text-slate-400 text-sm">
                                      {record.email}
                                    </p>
                                    {record.businessType && (
                                      <p className="text-slate-500 text-xs">
                                        {record.businessType}
                                      </p>
                                    )}
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="space-y-1">
                                    <Badge
                                      variant="secondary"
                                      className={`${
                                        record.paymentStatus === "completed"
                                          ? "bg-green-600/20 text-green-400 border-green-600/30"
                                          : record.paymentStatus === "pending"
                                          ? "bg-orange-600/20 text-orange-400 border-orange-600/30"
                                          : "bg-red-600/20 text-red-400 border-red-600/30"
                                      }`}
                                    >
                                      {record.paymentStatus === "completed"
                                        ? "Paid"
                                        : record.paymentStatus || "Pending"}
                                    </Badge>
                                    {record.paymentDate && (
                                      <p className="text-slate-400 text-xs">
                                        {new Date(
                                          record.paymentDate
                                        ).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div>
                                    {record.paymentAmount ? (
                                      <p className="text-white font-medium">
                                        ₹{record.paymentAmount.toLocaleString()}
                                      </p>
                                    ) : (
                                      <p className="text-slate-500">
                                        No payment
                                      </p>
                                    )}
                                    {record.paymentMethod && (
                                      <p className="text-slate-400 text-xs capitalize">
                                        {record.paymentMethod}
                                      </p>
                                    )}
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <Badge
                                    variant="secondary"
                                    className={subscriptionStatus.color}
                                  >
                                    {subscriptionStatus.label}
                                  </Badge>
                                  {record.subscriptionExpiryDate && (
                                    <p className="text-slate-400 text-xs mt-1">
                                      Expires:{" "}
                                      {new Date(
                                        record.subscriptionExpiryDate
                                      ).toLocaleDateString()}
                                    </p>
                                  )}
                                </td>
                                <td className="py-4 px-4">
                                  <Button
                                    onClick={() => setSelectedRecord(record)}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                </td>
                              </motion.tr>
                            );
                          })}
                        </AnimatePresence>
                      </tbody>
                    </table>

                    {filteredRecords.length === 0 && (
                      <div className="text-center py-12">
                        <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">
                          No payment records found matching your criteria.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Payment Detail Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRecord(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Building className="w-6 h-6 text-blue-400" />
                    {selectedRecord.companyName}
                  </h3>
                  <Button
                    onClick={() => setSelectedRecord(null)}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Company Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-400">
                        Email
                      </label>
                      <p className="text-white">{selectedRecord.email}</p>
                    </div>
                    {selectedRecord.contactPerson && (
                      <div>
                        <label className="text-sm font-medium text-slate-400">
                          Contact Person
                        </label>
                        <p className="text-white">
                          {selectedRecord.contactPerson}
                        </p>
                      </div>
                    )}
                    {selectedRecord.phone && (
                      <div>
                        <label className="text-sm font-medium text-slate-400">
                          Phone
                        </label>
                        <p className="text-white">{selectedRecord.phone}</p>
                      </div>
                    )}
                    {selectedRecord.businessType && (
                      <div>
                        <label className="text-sm font-medium text-slate-400">
                          Business Type
                        </label>
                        <p className="text-white">
                          {selectedRecord.businessType}
                        </p>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-slate-600/30" />

                  {/* Payment Details */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-green-400" />
                      Payment Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-400">
                          Payment Status
                        </label>
                        <Badge
                          variant="secondary"
                          className={`${
                            selectedRecord.paymentStatus === "completed"
                              ? "bg-green-600/20 text-green-400 border-green-600/30"
                              : "bg-orange-600/20 text-orange-400 border-orange-600/30"
                          } mt-1`}
                        >
                          {selectedRecord.paymentStatus === "completed"
                            ? "Completed"
                            : selectedRecord.paymentStatus || "Pending"}
                        </Badge>
                      </div>
                      {selectedRecord.paymentDate && (
                        <div>
                          <label className="text-sm font-medium text-slate-400">
                            Payment Date
                          </label>
                          <p className="text-white">
                            {new Date(
                              selectedRecord.paymentDate
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      )}
                      {selectedRecord.paymentAmount && (
                        <div>
                          <label className="text-sm font-medium text-slate-400">
                            Total Amount
                          </label>
                          <p className="text-white font-semibold">
                            ₹{selectedRecord.paymentAmount.toLocaleString()}
                          </p>
                        </div>
                      )}
                      {selectedRecord.registrationAmount && (
                        <div>
                          <label className="text-sm font-medium text-slate-400">
                            Registration Fee
                          </label>
                          <p className="text-white">
                            ₹
                            {selectedRecord.registrationAmount.toLocaleString()}
                          </p>
                        </div>
                      )}
                      {selectedRecord.subscriptionAmount && (
                        <div>
                          <label className="text-sm font-medium text-slate-400">
                            Subscription Fee
                          </label>
                          <p className="text-white">
                            ₹
                            {selectedRecord.subscriptionAmount.toLocaleString()}
                          </p>
                        </div>
                      )}
                      {selectedRecord.paymentMethod && (
                        <div>
                          <label className="text-sm font-medium text-slate-400">
                            Payment Method
                          </label>
                          <p className="text-white capitalize">
                            {selectedRecord.paymentMethod}
                          </p>
                        </div>
                      )}
                      {selectedRecord.paymentId && (
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-slate-400">
                            Payment ID
                          </label>
                          <p className="text-white font-mono text-sm bg-slate-700/30 p-2 rounded mt-1">
                            {selectedRecord.paymentId}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subscription Details */}
                  {selectedRecord.subscriptionExpiryDate && (
                    <>
                      <Separator className="bg-slate-600/30" />
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-purple-400" />
                          Subscription Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-400">
                              Expires On
                            </label>
                            <p className="text-white">
                              {new Date(
                                selectedRecord.subscriptionExpiryDate
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          {selectedRecord.subscriptionDuration && (
                            <div>
                              <label className="text-sm font-medium text-slate-400">
                                Duration
                              </label>
                              <p className="text-white">
                                {selectedRecord.subscriptionDuration}{" "}
                                {selectedRecord.subscriptionDuration === 1
                                  ? "Year"
                                  : "Years"}
                              </p>
                            </div>
                          )}
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">
                              Status
                            </label>
                            <div className="mt-1">
                              {(() => {
                                const subscriptionStatus =
                                  getSubscriptionStatus(selectedRecord);
                                return (
                                  <Badge
                                    variant="secondary"
                                    className={subscriptionStatus.color}
                                  >
                                    {subscriptionStatus.label}
                                  </Badge>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentDashboard;
