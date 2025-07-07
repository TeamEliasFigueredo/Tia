import React, { memo, useCallback, useState, useEffect } from "react";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Search,
  ZoomIn,
  ZoomOut,
  FileImage,
  FileSpreadsheet,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Document } from "@/hooks/use-optimized-tia-app";
import { Translations } from "@/lib/i18n";
import { useDocumentSearch } from "@/hooks/use-optimized-tia-app";

interface DocumentViewerProps {
  isVisible: boolean;
  selectedDocument: Document | null;
  currentPage: number;
  zoom: number;
  onToggleVisibility: () => void;
  onPageChange: (page: number) => void;
  onZoomChange: (zoom: number) => void;
  t: Translations;
}

const DocumentViewer = memo<DocumentViewerProps>(
  ({
    isVisible,
    selectedDocument,
    currentPage,
    zoom,
    onToggleVisibility,
    onPageChange,
    onZoomChange,
    t,
  }) => {
    const [isFullWidth, setIsFullWidth] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Mobile detection
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };

      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const {
      searchQuery,
      setSearchQuery,
      searchResults,
      currentResult,
      navigateResults,
    } = useDocumentSearch(selectedDocument);

    const getFileTypeIcon = (fileType: Document["fileType"]) => {
      switch (fileType) {
        case "PDF":
          return <FileText className="h-4 w-4 text-red-500" />;
        case "Word":
          return <FileText className="h-4 w-4 text-blue-500" />;
        case "Excel":
          return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
        case "PowerPoint":
          return <FileImage className="h-4 w-4 text-orange-500" />;
        case "Image":
          return <FileImage className="h-4 w-4 text-purple-500" />;
        default:
          return <FileText className="h-4 w-4 text-gray-500" />;
      }
    };

    const renderHighlightedText = useCallback(
      (text: string, searchQuery: string) => {
        if (!searchQuery) return text;

        const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
        return parts.map((part, index) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <mark key={index} className="search-highlight">
              {part}
            </mark>
          ) : (
            part
          ),
        );
      },
      [],
    );

    const renderDocumentContent = useCallback(
      (document: Document) => {
        const baseContentClass =
          "leading-relaxed whitespace-pre-wrap text-gray-800 dark:text-gray-200";

        switch (document.fileType) {
          case "PDF":
            return (
              <div className="document-page min-h-600">
                <div className="p-6">
                  <div
                    className={cn(
                      "prose prose-sm max-w-none document-content",
                      baseContentClass,
                    )}
                  >
                    {renderHighlightedText(document.content, searchQuery)}
                  </div>
                </div>
              </div>
            );

          case "Word":
            return (
              <div className="document-page border-blue-200 min-h-600">
                <div className="p-6">
                  <div
                    className={cn(
                      "prose prose-blue max-w-none document-content",
                      baseContentClass,
                    )}
                  >
                    {renderHighlightedText(document.content, searchQuery)}
                  </div>
                </div>
              </div>
            );

          case "Excel":
            return (
              <div className="bg-white dark:bg-gray-900 border border-green-200 rounded-lg min-h-600">
                <div className="p-4">
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm">
                      <thead>
                        <tr className="bg-green-50 dark:bg-green-900/20">
                          <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-medium">
                            Column A
                          </th>
                          <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-medium">
                            Column B
                          </th>
                          <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-medium">
                            Column C
                          </th>
                          <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-medium">
                            Column D
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 8 }, (_, i) => (
                          <tr
                            key={i}
                            className={
                              i % 2 === 0
                                ? "bg-white dark:bg-gray-900"
                                : "bg-gray-50 dark:bg-gray-800"
                            }
                          >
                            <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                              Data {i + 1}A
                            </td>
                            <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                              Data {i + 1}B
                            </td>
                            <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                              Data {i + 1}C
                            </td>
                            <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                              Data {i + 1}D
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className={cn("text-sm", baseContentClass)}>
                    {renderHighlightedText(document.content, searchQuery)}
                  </div>
                </div>
              </div>
            );

          case "PowerPoint":
            return (
              <div className="bg-white dark:bg-gray-900 border border-orange-200 rounded-lg min-h-600">
                <div className="p-4">
                  <div className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800 border border-orange-200 dark:border-orange-700 rounded-lg p-6 mb-4 aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                        Slide {currentPage}
                      </h3>
                      <div className="text-gray-600 dark:text-gray-300 text-sm max-w-md">
                        {renderHighlightedText(
                          `${document.content.substring(0, 150)}...`,
                          searchQuery,
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={cn("text-sm", baseContentClass)}>
                    {renderHighlightedText(document.content, searchQuery)}
                  </div>
                </div>
              </div>
            );

          case "Image":
            return (
              <div className="bg-white dark:bg-gray-900 border border-purple-200 rounded-lg min-h-600">
                <div className="p-4">
                  <div className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 border border-purple-200 dark:border-purple-700 rounded-lg p-8 mb-4 aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <FileImage className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {document.name}
                      </p>
                    </div>
                  </div>
                  <div className={cn("text-sm", baseContentClass)}>
                    {renderHighlightedText(document.content, searchQuery)}
                  </div>
                </div>
              </div>
            );

          default:
            return (
              <div className="bg-white dark:bg-gray-900 border rounded-lg min-h-600 p-6">
                <div className={cn("prose max-w-none", baseContentClass)}>
                  {renderHighlightedText(document.content, searchQuery)}
                </div>
              </div>
            );
        }
      },
      [searchQuery, renderHighlightedText, currentPage],
    );

    if (!isVisible) return null;

    return (
      <div
        className={cn(
          "bg-white dark:bg-gray-800 border-r-2 border-blue-100 dark:border-blue-800 transition-all duration-300 shadow-lg column-transition",
          isFullWidth ? "w-full" : "w-144",
          isMobile && "document-viewer-mobile",
        )}
      >
        <div className="h-full flex flex-col">
          {/* Compact Header with Essential Controls */}
          <div
            className={cn(
              "px-3 py-2 border-b document-viewer-header flex items-center gap-2",
              isMobile && "document-controls-mobile",
            )}
          >
            {/* Document Info */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {selectedDocument && (
                <>
                  {getFileTypeIcon(selectedDocument.fileType)}
                  <span
                    className="font-medium text-sm truncate"
                    title={selectedDocument.name}
                  >
                    {selectedDocument.name}
                  </span>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {currentPage}/{selectedDocument.pages}
                  </span>
                </>
              )}
            </div>

            {/* Essential Controls */}
            {selectedDocument && (
              <div className="flex items-center gap-1">
                {/* Search Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setShowSearch(!showSearch)}
                  title="Search in document"
                >
                  <Search className="h-3 w-3" />
                </Button>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1 border-r pr-2 mr-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => onZoomChange(Math.max(50, zoom - 25))}
                    title="Zoom out"
                  >
                    <ZoomOut className="h-3 w-3" />
                  </Button>
                  <span className="text-xs font-mono w-10 text-center">
                    {zoom}%
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => onZoomChange(Math.min(200, zoom + 25))}
                    title="Zoom in"
                  >
                    <ZoomIn className="h-3 w-3" />
                  </Button>
                </div>

                {/* Page Navigation */}
                <div className="flex items-center gap-1 border-r pr-2 mr-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    title="Previous page"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    disabled={currentPage >= selectedDocument.pages}
                    onClick={() =>
                      onPageChange(
                        Math.min(selectedDocument.pages, currentPage + 1),
                      )
                    }
                    title="Next page"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>

                {/* Layout Controls */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setIsFullWidth(!isFullWidth)}
                  title={isFullWidth ? "Restore width" : "Full width"}
                >
                  {isFullWidth ? (
                    <Minimize2 className="h-3 w-3" />
                  ) : (
                    <Maximize2 className="h-3 w-3" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={onToggleVisibility}
                  title="Close document viewer"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {/* Close only when no document */}
            {!selectedDocument && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={onToggleVisibility}
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t.openDocumentViewer}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          {/* Search Bar (Collapsible) */}
          {showSearch && selectedDocument && (
            <div className="px-3 py-2 border-b bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                  <Input
                    placeholder="Search in document..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-7 text-xs"
                    autoFocus
                  />
                </div>
                {searchResults.length > 0 && (
                  <>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {currentResult + 1}/{searchResults.length}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => navigateResults("prev")}
                        disabled={searchResults.length === 0}
                      >
                        <ChevronLeft className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => navigateResults("next")}
                        disabled={searchResults.length === 0}
                      >
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Document Content - Maximized Reading Area */}
          <ScrollArea className="flex-1 document-viewer-content">
            {selectedDocument ? (
              <div className={cn("p-4", isMobile && "p-2")}>
                <div
                  className="transform-gpu zoom-transition zoom-transform"
                  style={
                    {
                      "--zoom-scale": zoom / 100,
                      transformOrigin: "top center",
                    } as React.CSSProperties
                  }
                >
                  {renderDocumentContent(selectedDocument)}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <FileText className="h-16 w-16 mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No Document Selected</p>
                <p className="text-sm text-center max-w-xs">
                  Select a document from the database panel to view its contents
                  here.
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    );
  },
);

DocumentViewer.displayName = "DocumentViewer";

export default DocumentViewer;
