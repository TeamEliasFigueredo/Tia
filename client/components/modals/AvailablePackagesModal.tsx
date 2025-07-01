import React from "react";
import { Package, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Translations } from "@/lib/i18n";

interface AvailablePackagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: Translations;
}

export function AvailablePackagesModal({
  isOpen,
  onClose,
  t,
}: AvailablePackagesModalProps) {
  const handleViewPackages = () => {
    // Open packages page in new tab
    window.open("https://softia.ca/pricing-packages", "_blank");
  };

  const packages = [
    {
      name: t.starter,
      price: "$49.99/month",
      users: `${t.upToUsers} 10 ${t.users.toLowerCase()}`,
      storage: "500 GB",
      features: [t.basicAISupport, t.standardSecurity, t.emailSupport],
    },
    {
      name: t.professional,
      price: "$149.99/month",
      users: `${t.upToUsers} 25 ${t.users.toLowerCase()}`,
      storage: "1 TB",
      features: [
        t.advancedAISupport,
        t.enhancedSecurity,
        t.prioritySupport,
        t.apiAccess,
      ],
    },
    {
      name: t.enterprisePro,
      price: "$299.99/month",
      users: `${t.upToUsers} 50 ${t.users.toLowerCase()}`,
      storage: "2 TB",
      features: [
        t.advancedAISupport,
        t.enhancedSecurity,
        t.slaSupport,
        t.apiAccess,
        t.customIntegrations,
      ],
      current: true,
    },
    {
      name: "Enterprise Max",
      price: "$599.99/month",
      users: `${t.upToUsers} 100 ${t.users.toLowerCase()}`,
      storage: "5 TB",
      features: [
        t.advancedAISupport,
        t.enhancedSecurity,
        t.dedicatedAccountManager,
        t.apiAccess,
        t.customIntegrations,
        t.onPremiseDeployment,
      ],
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            {t.availablePackages}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600">{t.viewAllPackages}</p>
          </div>

          {/* Quick Link to Full Packages Page */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-900">
                  {t.viewAllPackages}
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  {t.availablePackages}
                </p>
              </div>
              <Button
                onClick={handleViewPackages}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                {t.viewOnWebsite}
              </Button>
            </div>
          </div>

          {/* Package Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  pkg.current
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                } transition-colors`}
              >
                <div className="text-center">
                  {pkg.current && (
                    <div className="mb-2">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        {t.currentPlanDetails}
                      </span>
                    </div>
                  )}
                  <h3 className="font-semibold text-lg text-gray-900">
                    {pkg.name}
                  </h3>
                  <div className="text-2xl font-bold text-blue-600 mt-2">
                    {pkg.price}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{pkg.users}</div>
                  <div className="text-sm text-gray-500">{pkg.storage}</div>
                </div>

                <div className="mt-4 space-y-2">
                  <h4 className="font-medium text-sm">{t.features}:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {!pkg.current && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() =>
                      alert(`Upgrade to ${pkg.name} plan initiated`)
                    }
                  >
                    {t.upgrade}
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
            <p className="text-sm text-gray-600">{t.needCustomSolution}</p>
            <Button variant="outline" size="sm" className="mt-2">
              {t.contactSales}
            </Button>
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

export default AvailablePackagesModal;
