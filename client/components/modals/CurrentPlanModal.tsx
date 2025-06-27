import React, { useState } from "react";
import {
  Package,
  Users,
  HardDrive,
  Calendar,
  Plus,
  CreditCard,
  TrendingUp,
  X,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CurrentPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CurrentPlanModal({ isOpen, onClose }: CurrentPlanModalProps) {
  const [planData] = useState({
    planName: "Enterprise Pro",
    planType: "Annual",
    currentUsers: 25,
    maxUsers: 50,
    storageUsed: "1.2 TB",
    storageLimit: "2 TB",
    renewalDate: "2024-12-15",
    monthlyPrice: "$299.99",
    status: "Active",
  });

  const [newUserCount, setNewUserCount] = useState(planData.maxUsers);
  const [newStorageLimit, setNewStorageLimit] = useState("2");

  const handleRenewPlan = () => {
    // Implementation for plan renewal
    console.log("Initiating plan renewal");
    alert(
      "Plan renewal process initiated. You will receive a confirmation email.",
    );
  };

  const handleIncreaseUsers = () => {
    // Implementation for increasing user count
    console.log("Increasing users to:", newUserCount);
    alert(`User limit will be increased to ${newUserCount} users.`);
  };

  const handleIncreaseStorage = () => {
    // Implementation for increasing storage
    console.log("Increasing storage to:", newStorageLimit);
    alert(`Storage limit will be increased to ${newStorageLimit} TB.`);
  };

  const calculateStoragePercentage = () => {
    const used = parseFloat(planData.storageUsed.replace(" TB", ""));
    const limit = parseFloat(planData.storageLimit.replace(" TB", ""));
    return Math.round((used / limit) * 100);
  };

  const calculateUserPercentage = () => {
    return Math.round((planData.currentUsers / planData.maxUsers) * 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Current Plan Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Plan Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {planData.planName}
                </h3>
                <p className="text-sm text-gray-600">
                  {planData.planType} Subscription
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {planData.monthlyPrice}
                </div>
                <Badge
                  variant={
                    planData.status === "Active" ? "default" : "secondary"
                  }
                  className="bg-green-600"
                >
                  {planData.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Users */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium">Users</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current: {planData.currentUsers}</span>
                  <span>Limit: {planData.maxUsers}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${calculateUserPercentage()}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {calculateUserPercentage()}% of user limit used
                </p>
              </div>
            </div>

            {/* Storage */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <HardDrive className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium">Storage</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Used: {planData.storageUsed}</span>
                  <span>Limit: {planData.storageLimit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${calculateStoragePercentage()}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {calculateStoragePercentage()}% of storage used
                </p>
              </div>
            </div>
          </div>

          {/* Renewal Information */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium">Renewal Information</h4>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Next renewal date:</p>
                <p className="font-medium">{planData.renewalDate}</p>
              </div>
              <Button
                onClick={handleRenewPlan}
                className="bg-green-600 hover:bg-green-700"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Renew Now
              </Button>
            </div>
          </div>

          <Separator />

          {/* Plan Modifications */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Increase Plan Limits
            </h4>

            {/* Increase Users */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="userCount" className="font-medium">
                    Increase User Limit
                  </Label>
                  <p className="text-sm text-gray-500">
                    Current limit: {planData.maxUsers} users
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    id="userCount"
                    type="number"
                    value={newUserCount}
                    onChange={(e) => setNewUserCount(Number(e.target.value))}
                    min={planData.maxUsers}
                    className="w-20"
                  />
                  <Button
                    size="sm"
                    onClick={handleIncreaseUsers}
                    disabled={newUserCount <= planData.maxUsers}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Increase
                  </Button>
                </div>
              </div>
            </div>

            {/* Increase Storage */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="storageLimit" className="font-medium">
                    Increase Storage Limit
                  </Label>
                  <p className="text-sm text-gray-500">
                    Current limit: {planData.storageLimit}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    id="storageLimit"
                    type="number"
                    value={newStorageLimit}
                    onChange={(e) => setNewStorageLimit(e.target.value)}
                    min="2"
                    step="0.5"
                    className="w-20"
                  />
                  <span className="text-sm text-gray-500">TB</span>
                  <Button
                    size="sm"
                    onClick={handleIncreaseStorage}
                    disabled={parseFloat(newStorageLimit) <= 2}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Increase
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
