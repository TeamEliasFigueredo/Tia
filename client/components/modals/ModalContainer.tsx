import React, { memo, Suspense, lazy } from "react";
import { Translations } from "@/lib/i18n";

// Lazy load modals for better performance
const UserProfileModal = lazy(() => import("./UserProfileModal"));
const SecurityModal = lazy(() => import("./SecurityModal"));
const TermsModal = lazy(() => import("./TermsModal"));
const CurrentPlanModal = lazy(() => import("./CurrentPlanModal"));
const AvailablePackagesModal = lazy(() => import("./AvailablePackagesModal"));
const ViewBillsModal = lazy(() => import("./ViewBillsModal"));
const CompanyModal = lazy(() => import("./CompanyModal"));
const TeamsModal = lazy(() => import("./TeamsModal"));

interface ModalContainerProps {
  modals: {
    userProfile: boolean;
    security: boolean;
    terms: boolean;
    currentPlan: boolean;
    availablePackages: boolean;
    viewBills: boolean;
    company: boolean;
    teams: boolean;
  };
  onClose: (modalName: string) => void;
  companies: any[];
  setCompanies: any;
  selectedCompany: any;
  setSelectedCompany: any;
  t: Translations;
}

// Simple loading component for modals
const ModalLoadingFallback = memo(() => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        Loading...
      </p>
    </div>
  </div>
));

const ModalContainer = memo<ModalContainerProps>(
  ({
    modals,
    onClose,
    companies,
    setCompanies,
    selectedCompany,
    setSelectedCompany,
    t,
  }) => {
    return (
      <>
        <Suspense fallback={<ModalLoadingFallback />}>
          {modals.userProfile && (
            <UserProfileModal
              isOpen={modals.userProfile}
              onClose={() => onClose("userProfile")}
              t={t}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {modals.security && (
            <SecurityModal
              isOpen={modals.security}
              onClose={() => onClose("security")}
              t={t}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {modals.terms && (
            <TermsModal
              isOpen={modals.terms}
              onClose={() => onClose("terms")}
              t={t}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {modals.currentPlan && (
            <CurrentPlanModal
              isOpen={modals.currentPlan}
              onClose={() => onClose("currentPlan")}
              t={t}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {modals.availablePackages && (
            <AvailablePackagesModal
              isOpen={modals.availablePackages}
              onClose={() => onClose("availablePackages")}
              t={t}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {modals.viewBills && (
            <ViewBillsModal
              isOpen={modals.viewBills}
              onClose={() => onClose("viewBills")}
              t={t}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {modals.company && (
            <CompanyModal
              isOpen={modals.company}
              onClose={() => onClose("company")}
              companies={companies}
              setCompanies={setCompanies}
              selectedCompany={selectedCompany}
              setSelectedCompany={setSelectedCompany}
              t={t}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {modals.teams && (
            <TeamsModal
              isOpen={modals.teams}
              onClose={() => onClose("teams")}
              t={t}
            />
          )}
        </Suspense>
      </>
    );
  },
);

ModalContainer.displayName = "ModalContainer";

export default ModalContainer;
