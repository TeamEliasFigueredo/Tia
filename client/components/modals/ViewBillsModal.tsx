import React, { useState } from "react";
import {
  Receipt,
  Download,
  Eye,
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Translations } from "@/lib/i18n";

interface ViewBillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: Translations;
}

interface Invoice {
  id: string;
  date: string;
  amount: string;
  plan: string;
  period: string;
  status: "paid" | "pending" | "overdue";
  downloadUrl?: string;
}

export function ViewBillsModal({ isOpen, onClose, t }: ViewBillsModalProps) {
  const [invoices] = useState<Invoice[]>([
    {
      id: "INV-2024-001",
      date: "2024-01-15",
      amount: "$299.99",
      plan: "Enterprise Pro",
      period: "January 2024",
      status: "paid",
      downloadUrl: "/invoices/inv-2024-001.pdf",
    },
    {
      id: "INV-2023-012",
      date: "2023-12-15",
      amount: "$299.99",
      plan: "Enterprise Pro",
      period: "December 2023",
      status: "paid",
      downloadUrl: "/invoices/inv-2023-012.pdf",
    },
    {
      id: "INV-2023-011",
      date: "2023-11-15",
      amount: "$299.99",
      plan: "Enterprise Pro",
      period: "November 2023",
      status: "paid",
      downloadUrl: "/invoices/inv-2023-011.pdf",
    },
    {
      id: "INV-2023-010",
      date: "2023-10-15",
      amount: "$149.99",
      plan: "Professional",
      period: "October 2023",
      status: "paid",
      downloadUrl: "/invoices/inv-2023-010.pdf",
    },
  ]);

  const [paymentMethod] = useState({
    type: "Visa",
    lastFour: "4242",
    expiry: "12/25",
  });

  const handleDownloadInvoice = (invoice: Invoice) => {
    // Implementation for downloading invoice
    console.log("Downloading invoice:", invoice.id);
    alert(`Downloading invoice ${invoice.id}`);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    // Implementation for viewing invoice details
    console.log("Viewing invoice:", invoice.id);
    alert(`Opening invoice ${invoice.id} details`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "overdue":
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-600">{t.paid}</Badge>;
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600">
            {t.pending}
          </Badge>
        );
      case "overdue":
        return <Badge variant="destructive">{t.overdue}</Badge>;
      default:
        return null;
    }
  };

  const totalPaid = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + parseFloat(inv.amount.replace("$", "")), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-blue-600" />
            {t.billingHistory}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Billing Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-green-900">{t.totalPaid}</h3>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-2">
                ${totalPaid.toFixed(2)}
              </p>
              <p className="text-sm text-green-700">
                {invoices.filter((inv) => inv.status === "paid").length}{" "}
                {t.totalInvoices.toLowerCase()}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-blue-900">{t.paymentMethod}</h3>
              </div>
              <p className="text-lg font-semibold text-blue-600 mt-2">
                {paymentMethod.type} •••• {paymentMethod.lastFour}
              </p>
              <p className="text-sm text-blue-700">
                {t.expires} {paymentMethod.expiry}
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <h3 className="font-medium text-purple-900">{t.nextBilling}</h3>
              </div>
              <p className="text-lg font-semibold text-purple-600 mt-2">
                Feb 15, 2024
              </p>
              <p className="text-sm text-purple-700">$299.99</p>
            </div>
          </div>

          <Separator />

          {/* Invoice Table */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">
              {t.invoiceHistory} ({invoices.length}{" "}
              {t.totalInvoices.toLowerCase()})
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.invoice} ID</TableHead>
                    <TableHead>{t.date}</TableHead>
                    <TableHead>{t.plan}</TableHead>
                    <TableHead>{t.period}</TableHead>
                    <TableHead>{t.amount}</TableHead>
                    <TableHead>{t.status}</TableHead>
                    <TableHead>{t.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.id}
                      </TableCell>
                      <TableCell>
                        {new Date(invoice.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{invoice.plan}</TableCell>
                      <TableCell>{invoice.period}</TableCell>
                      <TableCell className="font-semibold">
                        {invoice.amount}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(invoice.status)}
                          {getStatusBadge(invoice.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewInvoice(invoice)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            {t.view}
                          </Button>
                          {invoice.status === "paid" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadInvoice(invoice)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              {t.download}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-gray-50 border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              Payment Information
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                • All payments are processed securely through our payment
                gateway
              </p>
              <p>
                • Invoices are automatically generated and emailed to your
                billing contact
              </p>
              <p>
                • For billing questions, contact our support team at
                billing@softia.ca
              </p>
              <p>• Download and print invoices for your accounting records</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
            <X className="mr-2 h-4 w-4" />
            {t.close}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ViewBillsModal;
