import React from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { useOptimizedTiaApp } from "@/hooks/use-optimized-tia-app";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useComponentProps } from "@/hooks/use-component-props";
import { useThemeEffect } from "@/hooks/use-theme-effect";

import TiaHeader from "@/components/layout/TiaHeader";
import DatabasePanel from "@/components/panels/DatabasePanel";
import DocumentViewer from "@/components/panels/DocumentViewer";
import ChatInterface from "@/components/panels/ChatInterface";
import TiaFooter from "@/components/layout/TiaFooter";
import ModalContainer from "@/components/modals/ModalContainer";
import { ProcessingOverlay } from "@/components/ui/ProcessingOverlay";
import { AccessibilityAnnouncements } from "@/components/ui/AccessibilityAnnouncements";
import { PerformanceMonitor } from "@/components/ui/PerformanceMonitor";

export default function Index() {
  const appState = useOptimizedTiaApp();
  const {
    layout,
    settings,
    databases,
    setDatabases,
    companies,
    setCompanies,
    selectedCompany,
    setSelectedCompany,
    documentState,
    chatState,
    setChatState,
    savedChats,
    setSavedChats,
    processing,
    actions,
    modalManager,
    dragAndDrop,
    fileOperations,
  } = appState;

  const t = useTranslation(settings.language);

  // Custom hooks for cleaner organization
  useThemeEffect(settings);

  const { handleFileUpload, handleChatFileUpload } = useFileUpload({
    databases,
    setDatabases,
    fileOperations,
    t,
  });

  const {
    headerProps,
    databasePanelProps,
    documentViewerProps,
    chatInterfaceProps,
    modalProps,
  } = useComponentProps({
    layout,
    settings,
    databases,
    companies,
    selectedCompany,
    documentState,
    chatState,
    savedChats,
    processing,
    dragAndDrop,
    actions,
    modalManager,
    setChatState,
    setSavedChats,
    setDatabases,
    setCompanies,
    setSelectedCompany,
    handleFileUpload,
    handleChatFileUpload,
    t,
  });

  const containerClasses = cn(
    "app-container bg-gradient-gray-light",
    settings.theme === "dark" &&
      "dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800",
  );

  return (
    <div
      className={containerClasses}
      style={{ "--font-size": `${settings.fontSize}px` } as React.CSSProperties}
    >
      <TiaHeader {...headerProps} />

      <div className="column-layout">
        <DatabasePanel {...databasePanelProps} />
        <DocumentViewer {...documentViewerProps} />
        <ChatInterface {...chatInterfaceProps} />
      </div>

      <TiaFooter t={t} />
      <ModalContainer {...modalProps} />

      <ProcessingOverlay
        isProcessing={processing.isProcessing}
        progress={processing.progress}
        processedDocuments={processing.processedDocuments}
        documentsToProcess={processing.documentsToProcess}
      />

      <AccessibilityAnnouncements processing={processing} layout={layout} />
      <PerformanceMonitor />
    </div>
  );
}
