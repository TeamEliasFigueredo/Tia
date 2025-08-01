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
  Check,
  ArrowUp,
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
import { Translations } from "@/lib/i18n";

interface CurrentPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: Translations;
}

export function CurrentPlanModal({
  isOpen,
  onClose,
  t,
}: CurrentPlanModalProps) {
  const [planData, setPlanData] = useState({
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
  const [isProcessingIncrease, setIsProcessingIncrease] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState({
    users: false,
    storage: false,
  });

  const handleRenewPlan = () => {
    console.log("Initiating plan renewal");
    alert(
      "Plan renewal process initiated. You will receive a confirmation email.",
    );
  };

  const handleIncreaseUsers = async () => {
    if (newUserCount <= planData.maxUsers) return;

    setIsProcessingIncrease(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const additionalUsers = newUserCount - planData.maxUsers;
    const additionalCost = additionalUsers * 12; // $12 per user per month

    setPlanData((prev) => ({
      ...prev,
      maxUsers: newUserCount,
    }));

    setUpgradeSuccess((prev) => ({ ...prev, users: true }));
    setIsProcessingIncrease(false);

    setTimeout(() => {
      setUpgradeSuccess((prev) => ({ ...prev, users: false }));
    }, 3000);

    console.log(
      `User limit increased to ${newUserCount} users. Additional cost: $${additionalCost}/month`,
    );
  };

  const handleIncreaseStorage = async () => {
    const currentStorage = parseFloat(planData.storageLimit.replace(" TB", ""));
    const newStorage = parseFloat(newStorageLimit);

    if (newStorage <= currentStorage) return;

    setIsProcessingIncrease(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const additionalStorage = newStorage - currentStorage;
    const additionalCost = additionalStorage * 25; // $25 per TB per month

    setPlanData((prev) => ({
      ...prev,
      storageLimit: `${newStorage} TB`,
    }));

    setUpgradeSuccess((prev) => ({ ...prev, storage: true }));
    setIsProcessingIncrease(false);

    setTimeout(() => {
      setUpgradeSuccess((prev) => ({ ...prev, storage: false }));
    }, 3000);

    console.log(
      `Storage increased to ${newStorage} TB. Additional cost: $${additionalCost}/month`,
    );
  };

  const calculateStoragePercentage = () => {
    const used = parseFloat(planData.storageUsed.replace(" TB", ""));
    const limit = parseFloat(planData.storageLimit.replace(" TB", ""));
    return Math.round((used / limit) * 100);
  };

  const calculateUserPercentage = () => {
    return Math.round((planData.currentUsers / planData.maxUsers) * 100);
  };

  const calculateUserIncreaseCost = () => {
    const additionalUsers = newUserCount - planData.maxUsers;
    return additionalUsers > 0 ? additionalUsers * 12 : 0;
  };

  const calculateStorageIncreaseCost = () => {
    const currentStorage = parseFloat(planData.storageLimit.replace(" TB", ""));
    const newStorage = parseFloat(newStorageLimit);
    const additionalStorage = newStorage - currentStorage;
    return additionalStorage > 0 ? additionalStorage * 25 : 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl-responsive max-h-90vh overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            {t.currentPlanDetails}
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
                  {planData.planType === "Annual"
                    ? t.annualSubscription
                    : t.monthlySubscription}
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
                  {t.active}
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
                <h4 className="font-medium">{t.users}</h4>
                {upgradeSuccess.users && (
                  <Badge className="bg-green-600">
                    <Check className="mr-1 h-3 w-3" />
                    {t.upgraded}
                  </Badge>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    {t.currentLabel}: {planData.currentUsers}
                  </span>
                  <span>
                    {t.limit}: {planData.maxUsers}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      calculateUserPercentage() > 80
                        ? "bg-red-600"
                        : calculateUserPercentage() > 60
                          ? "bg-yellow-600"
                          : "bg-blue-600"
                    } progress-bar-width`}
                    style={
                      {
                        "--progress-width": `${calculateUserPercentage()}%`,
                      } as React.CSSProperties
                    }
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {calculateUserPercentage()}% {t.percentUsed}
                </p>
              </div>
            </div>

            {/* Storage */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <HardDrive className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium">{t.storage}</h4>
                {upgradeSuccess.storage && (
                  <Badge className="bg-green-600">
                    <Check className="mr-1 h-3 w-3" />
                    {t.upgraded}
                  </Badge>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    {t.used}: {planData.storageUsed}
                  </span>
                  <span>
                    {t.limit}: {planData.storageLimit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      calculateStoragePercentage() > 80
                        ? "bg-red-600"
                        : calculateStoragePercentage() > 60
                          ? "bg-yellow-600"
                          : "bg-green-600"
                    } progress-bar-width`}
                    style={
                      {
                        "--progress-width": `${calculateStoragePercentage()}%`,
                      } as React.CSSProperties
                    }
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {calculateStoragePercentage()}% {t.storage.toLowerCase()}{" "}
                  {t.used.toLowerCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Renewal Information */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium">{t.renewalInformation}</h4>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t.nextRenewalDate}</p>
                <p className="font-medium">{planData.renewalDate}</p>
              </div>
              <Button
                onClick={handleRenewPlan}
                className="bg-green-600 hover:bg-green-700"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {t.renewNow}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Enhanced Plan Modifications */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              {t.increasePlanLimits}
            </h4>

            {/* Increase Users */}
            <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Label
                    htmlFor="userCount"
                    className="font-medium text-blue-900"
                  >
                    {t.increaseUserLimit}
                  </Label>
                  <p className="text-sm text-blue-700">
                    {t.currentLimit}: {planData.maxUsers}{" "}
                    {t.users.toLowerCase()}
                  </p>
                </div>
                <ArrowUp className="h-5 w-5 text-blue-600" />
              </div>

              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Label htmlFor="userCount" className="text-sm">
                    {t.newUserLimit}
                  </Label>
                  <Input
                    id="userCount"
                    type="number"
                    value={newUserCount}
                    onChange={(e) => setNewUserCount(Number(e.target.value))}
                    min={planData.maxUsers}
                    className="mt-1"
                  />
                </div>

                <div className="text-sm text-blue-700">
                  <div className="font-medium">{t.additionalCost}</div>
                  <div className="text-lg font-bold">
                    +${calculateUserIncreaseCost()}/month
                  </div>
                </div>

                <Button
                  onClick={handleIncreaseUsers}
                  disabled={
                    newUserCount <= planData.maxUsers || isProcessingIncrease
                  }
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessingIncrease ? (
                    <>{t.processing}</>
                  ) : (
                    <>
                      <Plus className="mr-1 h-4 w-4" />
                      {t.increase}
                    </>
                  )}
                </Button>
              </div>

              {newUserCount > planData.maxUsers && (
                <div className="mt-3 p-3 bg-blue-200 rounded text-sm text-blue-800">
                  <strong>{t.summary}</strong> {t.addingUsers}{" "}
                  {newUserCount - planData.maxUsers} {t.users.toLowerCase()}{" "}
                  {t.perUserPerMonth}.{t.totalAdditionalCost} $
                  {calculateUserIncreaseCost()}/month.
                </div>
              )}
            </div>

            {/* Increase Storage */}
            <div className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-green-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Label
                    htmlFor="storageLimit"
                    className="font-medium text-green-900"
                  >
                    {t.increaseStorageLimit}
                  </Label>
                  <p className="text-sm text-green-700">
                    {t.currentLimit}: {planData.storageLimit}
                  </p>
                </div>
                <ArrowUp className="h-5 w-5 text-green-600" />
              </div>

              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Label htmlFor="storageLimit" className="text-sm">
                    {t.newStorageLimit}
                  </Label>
                  <Input
                    id="storageLimit"
                    type="number"
                    value={newStorageLimit}
                    onChange={(e) => setNewStorageLimit(e.target.value)}
                    min="2"
                    step="0.5"
                    className="mt-1"
                  />
                </div>

                <div className="text-sm text-green-700">
                  <div className="font-medium">{t.additionalCost}</div>
                  <div className="text-lg font-bold">
                    +${calculateStorageIncreaseCost()}/month
                  </div>
                </div>

                <Button
                  onClick={handleIncreaseStorage}
                  disabled={
                    parseFloat(newStorageLimit) <= 2 || isProcessingIncrease
                  }
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isProcessingIncrease ? (
                    <>{t.processing}</>
                  ) : (
                    <>
                      <Plus className="mr-1 h-4 w-4" />
                      {t.increase}
                    </>
                  )}
                </Button>
              </div>

              {parseFloat(newStorageLimit) > 2 && (
                <div className="mt-3 p-3 bg-green-200 rounded text-sm text-green-800">
                  <strong>{t.summary}</strong> {t.addingStorage}{" "}
                  {parseFloat(newStorageLimit) - 2} TB {t.perTBPerMonth}.{" "}
                  {t.totalAdditionalCost}: ${calculateStorageIncreaseCost()}
                  /month.
                </div>
              )}
            </div>
          </div>

          {/* Pricing Information */}
          <div className="bg-gray-50 border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              {t.pricingDetails}
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>{t.additionalUsers}</strong> $12/user/month
              </div>
              <div>
                <strong>{t.additionalStorage}</strong> $25/TB/month
              </div>
              <div>
                <strong>{t.billingCycle}</strong> {t.monthly}
              </div>
              <div>
                <strong>{t.changesTakeEffect}</strong> {t.immediately}
              </div>
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

export default CurrentPlanModal;
