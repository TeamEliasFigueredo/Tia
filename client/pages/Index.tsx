import React, { Suspense, lazy, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { useOptimizedTiaApp } from "@/hooks/use-optimized-tia-app";

// Lazy load components for better performance
const TiaHeader = lazy(() => import("@/components/layout/TiaHeader"));
const DatabasePanel = lazy(() => import("@/components/panels/DatabasePanel"));
const DocumentViewer = lazy(() => import("@/components/panels/DocumentViewer"));
const ChatInterface = lazy(() => import("@/components/panels/ChatInterface"));
const TiaFooter = lazy(() => import("@/components/layout/TiaFooter"));
const ModalContainer = lazy(() => import("@/components/modals/ModalContainer"));

// Loading skeleton component
const LoadingSkeleton = React.memo(() => (
  <div className="animate-pulse">
    <div className="h-16 bg-gray-200 dark:bg-gray-700 mb-4"></div>
    <div className="flex space-x-4">
      <div className="w-80 h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="flex-1 h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
));

export default function Index() {
  const {
    layout,
    settings,
    databases,
    setDatabases,
    documentState,
    chatState,
    setChatState,
    savedChats,
    setSavedChats,
    processing,
    computedValues,
    actions,
    modalManager,
    dragAndDrop,
    fileOperations,
  } = useOptimizedTiaApp();

  const t = useTranslation(settings.language);

  // Enhanced file upload handler with validation
  const handleFileUpload = useCallback(
    (files: FileList | null, targetDbId: string) => {
      if (!files) return;

      const validFiles = Array.from(files).filter((file) =>
        fileOperations.validateFileType(file),
      );

      if (validFiles.length !== files.length) {
        // Show user-friendly error for invalid files
        const invalidCount = files.length - validFiles.length;
        alert(
          `${invalidCount} file(s) were skipped due to unsupported format or size limit (50MB max).`,
        );
      }

      validFiles.forEach((file) => {
        const fileType = fileOperations.getFileType(file.name);
        const newDoc = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: fileType,
          size: fileOperations.formatFileSize(file.size),
          pages: Math.floor(Math.random() * 50) + 1,
          createdDate: new Date().toISOString().split("T")[0],
          addedDate: new Date().toISOString().split("T")[0],
          content: `Content of ${file.name}. This is a placeholder for the actual document content that would be extracted from the uploaded file. The file type is ${fileType} and contains structured information relevant to your organization.`,
          fileType,
        };

        setDatabases((prev) =>
          prev.map((db) =>
            db.id === targetDbId
              ? {
                  ...db,
                  documents: [...db.documents, newDoc],
                  documentCount: db.documentCount + 1,
                  size: `${(
                    parseFloat(db.size.replace(" MB", "")) +
                    file.size / (1024 * 1024)
                  ).toFixed(1)} MB`,
                  lastModified: new Date().toISOString().split("T")[0],
                }
              : db,
          ),
        );
      });
    },
    [fileOperations, setDatabases],
  );

  // Enhanced chat file upload with better UX
  const handleChatFileUpload = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      let myDocsDb = databases.find((db) => db.name === t.myDocuments);

      if (!myDocsDb) {
        const newMyDocsDb = {
          id: `my-docs-${Date.now()}`,
          name: t.myDocuments,
          size: "0 MB",
          documentCount: 0,
          createdDate: new Date().toISOString().split("T")[0],
          lastModified: new Date().toISOString().split("T")[0],
          documents: [],
        };

        setDatabases((prev) => [...prev, newMyDocsDb]);
        myDocsDb = newMyDocsDb;
      }

      handleFileUpload(files, myDocsDb.id);

      // Show success message
      setTimeout(() => {
        alert(
          `${files.length} file(s) uploaded to ${t.myDocuments} database successfully!`,
        );
      }, 500);
    },
    [databases, handleFileUpload, setDatabases, t.myDocuments],
  );

  // Memoized component props to prevent unnecessary re-renders
  const headerProps = useMemo(
    () => ({
      isAdmin: true,
      currentUser: { name: "John Doe", initials: "JD" },
      onOpenModal: modalManager.openModal,
      language: settings.language,
      t,
    }),
    [modalManager.openModal, settings.language, t],
  );

  const databasePanelProps = useMemo(
    () => ({
      isVisible: layout.showColumn1,
      databases,
      selectedDatabase: documentState.selectedDatabase,
      processing,
      dragState: dragAndDrop.dragState,
      onToggleVisibility: actions.toggleColumn1,
      onDatabaseAction: setDatabases,
      onSelectDocument: actions.selectDocument,
      onFileUpload: handleFileUpload,
      onDragHandlers: {
        onDragStart: dragAndDrop.handleDragStart,
        onDragOver: dragAndDrop.handleDragOver,
        onDragLeave: dragAndDrop.handleDragLeave,
        onDrop: (e: React.DragEvent, dbId?: string) => {
          e.preventDefault();
          dragAndDrop.resetDragState();
          if (e.dataTransfer.files.length > 0 && dbId) {
            handleFileUpload(e.dataTransfer.files, dbId);
          }
        },
      },
      t,
    }),
    [
      layout.showColumn1,
      databases,
      documentState.selectedDatabase,
      processing,
      dragAndDrop,
      actions.toggleColumn1,
      actions.selectDocument,
      handleFileUpload,
      setDatabases,
      t,
    ],
  );

  const documentViewerProps = useMemo(
    () => ({
      isVisible: layout.showColumn2,
      selectedDocument: documentState.selectedDocument,
      currentPage: documentState.currentPage,
      zoom: documentState.zoom,
      onToggleVisibility: actions.toggleColumn2,
      onPageChange: actions.setDocumentPage,
      onZoomChange: actions.setDocumentZoom,
      t,
    }),
    [
      layout.showColumn2,
      documentState,
      actions.toggleColumn2,
      actions.setDocumentPage,
      actions.setDocumentZoom,
      t,
    ],
  );

  const chatInterfaceProps = useMemo(
    () => ({
      chatState,
      savedChats,
      settings,
      dragState: dragAndDrop.dragState,
      columnStates: layout,
      onChatAction: setChatState,
      onSavedChatsAction: setSavedChats,
      onSettingsChange: actions.updateSettings,
      onToggleColumns: {
        toggleColumn1: actions.toggleColumn1,
        toggleColumn2: actions.toggleColumn2,
      },
      onFileUpload: handleChatFileUpload,
      onDragHandlers: {
        onDragOver: dragAndDrop.handleDragOver,
        onDragLeave: dragAndDrop.handleDragLeave,
        onDrop: (e: React.DragEvent) => {
          e.preventDefault();
          dragAndDrop.setChatDragOver(false);
          if (e.dataTransfer.files.length > 0) {
            handleChatFileUpload(e.dataTransfer.files);
          }
        },
        setChatDragOver: dragAndDrop.setChatDragOver,
      },
      t,
    }),
    [
      chatState,
      savedChats,
      settings,
      dragAndDrop,
      layout,
      setChatState,
      setSavedChats,
      actions,
      handleChatFileUpload,
      t,
    ],
  );

  const modalProps = useMemo(
    () => ({
      modals: modalManager.modals,
      onClose: modalManager.closeModal,
    }),
    [modalManager.modals, modalManager.closeModal],
  );

  // Apply theme with smooth transition
  React.useEffect(() => {
    const applyTheme = () => {
      const isDark =
        settings.theme === "dark" ||
        (settings.theme === "auto" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);

      document.documentElement.classList.toggle("dark", isDark);
    };

    applyTheme();

    if (settings.theme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [settings.theme]);

  return (
    <div
      className={cn(
        "h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 transition-all duration-300",
        settings.theme === "dark" && "dark:from-gray-900 dark:to-gray-800",
      )}
      style={{
        fontSize: `${settings.fontSize}px`,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Enhanced loading states */}
      <Suspense fallback={<LoadingSkeleton />}>
        {/* Header */}
        <TiaHeader {...headerProps} />

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Database Panel */}
          <DatabasePanel {...databasePanelProps} />

          {/* Document Viewer */}
          <DocumentViewer {...documentViewerProps} />

          {/* Chat Interface */}
          <ChatInterface {...chatInterfaceProps} />
        </div>

        {/* Footer */}
        <TiaFooter t={t} />

        {/* Modals */}
        <ModalContainer {...modalProps} />
      </Suspense>

      {/* Global loading overlay for processing */}
      {processing.isProcessing && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">
                Processing Documents
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Please wait while we process your documents...
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${processing.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {processing.progress}% complete
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Accessibility announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {processing.isProcessing &&
          `Processing documents: ${processing.progress}% complete`}
        {layout.showColumn1 && "Database panel opened"}
        {layout.showColumn2 && "Document viewer opened"}
      </div>

      {/* Performance monitoring script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
              if (typeof window !== 'undefined' && window.performance) {
                window.addEventListener('load', () => {
                  setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData && perfData.loadEventEnd > 3000) {
                      console.warn('Page load time is slow:', perfData.loadEventEnd + 'ms');
                    }
                  }, 0);
                });
              }
            `,
        }}
      />
    </div>
  );
}
