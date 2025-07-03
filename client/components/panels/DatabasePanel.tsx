import React, { memo, useCallback } from "react";
import {
  Database,
  Plus,
  Trash2,
  Edit3,
  FileText,
  ChevronLeft,
  Play,
  Loader2,
  FileImage,
  FileSpreadsheet,
  Folder,
  FolderPlus,
  Upload,
  ChevronRight,
  ChevronDown,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Document,
  Database as DatabaseType,
} from "@/hooks/use-optimized-tia-app";
import { Translations } from "@/lib/i18n";

interface DatabasePanelProps {
  isVisible: boolean;
  databases: DatabaseType[];
  selectedDatabase: string | null;
  processing: {
    isProcessing: boolean;
    progress: number;
    documentsToProcess: number;
    processedDocuments: number;
  };
  dragState: {
    draggedDocument: { docId: string; fromDbId: string } | null;
    dragOver: string | null;
    dragOverFolder: string | null;
    chatDragOver: boolean;
    isDraggingFiles: boolean;
  };
  onToggleVisibility: () => void;
  onDatabaseAction: React.Dispatch<React.SetStateAction<DatabaseType[]>>;
  onSelectDocument: (document: Document, databaseId: string) => void;
  onFileUpload: (files: FileList | null, targetDbId: string) => void;
  onDragHandlers: {
    onDragStart: (docId: string, fromDbId: string) => void;
    onDragOver: (e: React.DragEvent, dbId?: string, folderId?: string) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent, dbId?: string, folderId?: string) => void;
    onFileDrop: (e: React.DragEvent, dbId: string, folderId?: string) => void;
    processDocuments: () => Promise<void>;
  };
  t: Translations;
}

const DatabasePanel = memo<DatabasePanelProps>(
  ({
    isVisible,
    databases,
    selectedDatabase,
    processing,
    dragState,
    onToggleVisibility,
    onDatabaseAction,
    onSelectDocument,
    onFileUpload,
    onDragHandlers,
    t,
  }) => {
    const [editingDatabase, setEditingDatabase] = React.useState<string | null>(
      null,
    );
    const [editingDocument, setEditingDocument] = React.useState<string | null>(
      null,
    );
    const [editingFolder, setEditingFolder] = React.useState<string | null>(
      null,
    );
    const [editingFolderName, setEditingFolderName] = React.useState("");
    const [newDatabaseName, setNewDatabaseName] = React.useState("");
    const [newFolderName, setNewFolderName] = React.useState("");
    const [showNewFolderInput, setShowNewFolderInput] = React.useState<
      string | null
    >(null);
    const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(
      new Set(),
    );

    const createDatabase = useCallback(() => {
      if (!newDatabaseName.trim()) return;

      const newDb: DatabaseType = {
        id: Date.now().toString(),
        name: newDatabaseName,
        size: "0 MB",
        documentCount: 0,
        createdDate: new Date().toISOString().split("T")[0],
        lastModified: new Date().toISOString().split("T")[0],
        documents: [],
      };

      onDatabaseAction((prev) => [...prev, newDb]);
      setNewDatabaseName("");
    }, [newDatabaseName, onDatabaseAction]);

    const deleteDatabase = useCallback(
      (dbId: string) => {
        if (confirm(t.confirmDelete)) {
          onDatabaseAction((prev) => prev.filter((db) => db.id !== dbId));
        }
      },
      [onDatabaseAction, t.confirmDelete],
    );

    const renameDatabase = useCallback(
      (dbId: string, newName: string) => {
        onDatabaseAction((prev) =>
          prev.map((db) =>
            db.id === dbId
              ? {
                  ...db,
                  name: newName,
                  lastModified: new Date().toISOString().split("T")[0],
                }
              : db,
          ),
        );
        setEditingDatabase(null);
      },
      [onDatabaseAction],
    );

    const deleteDocument = useCallback(
      (dbId: string, docId: string) => {
        if (confirm(t.confirmDelete)) {
          onDatabaseAction((prev) =>
            prev.map((db) =>
              db.id === dbId
                ? {
                    ...db,
                    documents: db.documents.filter((doc) => doc.id !== docId),
                    documentCount: db.documentCount - 1,
                    lastModified: new Date().toISOString().split("T")[0],
                  }
                : db,
            ),
          );
        }
      },
      [onDatabaseAction, t.confirmDelete],
    );

    const renameDocument = useCallback(
      (dbId: string, docId: string, newName: string) => {
        onDatabaseAction((prev) =>
          prev.map((db) =>
            db.id === dbId
              ? {
                  ...db,
                  documents: db.documents.map((doc) =>
                    doc.id === docId ? { ...doc, name: newName } : doc,
                  ),
                  lastModified: new Date().toISOString().split("T")[0],
                }
              : db,
          ),
        );
        setEditingDocument(null);
      },
      [onDatabaseAction],
    );

    const createFolder = useCallback(
      (dbId: string, folderName: string) => {
        if (!folderName.trim()) return;

        const newFolder = {
          id: `folder-${Date.now()}`,
          name: folderName,
          parentId: null,
          createdDate: new Date().toISOString().split("T")[0],
          documents: [],
          subfolders: [],
        };

        onDatabaseAction((prev) =>
          prev.map((db) =>
            db.id === dbId
              ? {
                  ...db,
                  folders: [...(db.folders || []), newFolder],
                  lastModified: new Date().toISOString().split("T")[0],
                }
              : db,
          ),
        );
        setNewFolderName("");
        setShowNewFolderInput(null);
      },
      [onDatabaseAction],
    );

    const deleteFolder = useCallback(
      (dbId: string, folderId: string) => {
        if (confirm(t.confirmDelete)) {
          onDatabaseAction((prev) =>
            prev.map((db) =>
              db.id === dbId
                ? {
                    ...db,
                    folders: (db.folders || []).filter(
                      (f) => f.id !== folderId,
                    ),
                    documents: db.documents.map((doc) =>
                      doc.folderId === folderId
                        ? { ...doc, folderId: null }
                        : doc,
                    ),
                    lastModified: new Date().toISOString().split("T")[0],
                  }
                : db,
            ),
          );
        }
      },
      [onDatabaseAction, t.confirmDelete],
    );

    const toggleFolder = useCallback((folderId: string) => {
      setExpandedFolders((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(folderId)) {
          newSet.delete(folderId);
        } else {
          newSet.add(folderId);
        }
        return newSet;
      });
    }, []);

    const startEditFolder = useCallback((folder: any) => {
      setEditingFolder(folder.id);
      setEditingFolderName(folder.name);
    }, []);

    const saveEditFolder = useCallback(
      (dbId: string, folderId: string) => {
        if (!editingFolderName.trim()) return;

        onDatabaseAction((prev) =>
          prev.map((db) =>
            db.id === dbId
              ? {
                  ...db,
                  folders: (db.folders || []).map((f) =>
                    f.id === folderId ? { ...f, name: editingFolderName } : f,
                  ),
                  lastModified: new Date().toISOString().split("T")[0],
                }
              : db,
          ),
        );
        setEditingFolder(null);
        setEditingFolderName("");
      },
      [editingFolderName, onDatabaseAction],
    );

    const cancelEditFolder = useCallback(() => {
      setEditingFolder(null);
      setEditingFolderName("");
    }, []);

    const startEditDocument = useCallback((docId: string) => {
      setEditingDocument(docId);
    }, []);

    const [expandedDatabases, setExpandedDatabases] = React.useState<
      Set<string>
    >(new Set());

    // Handle document highlighting from chat references
    React.useEffect(() => {
      const handleHighlightDocument = (event: CustomEvent) => {
        const { documentId, databaseId } = event.detail;

        // Expand the database if not already expanded
        setExpandedDatabases((prev) => new Set(prev.add(databaseId)));

        // Highlight the document
        setTimeout(() => {
          const documentElement = document.querySelector(
            `[data-document-id="${documentId}"]`,
          );
          if (documentElement) {
            documentElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            documentElement.classList.add("highlight-document");
            setTimeout(() => {
              documentElement.classList.remove("highlight-document");
            }, 3000);
          }
        }, 100);
      };

      window.addEventListener(
        "highlightDocument",
        handleHighlightDocument as EventListener,
      );
      return () => {
        window.removeEventListener(
          "highlightDocument",
          handleHighlightDocument as EventListener,
        );
      };
    }, []);

    const toggleDatabase = useCallback((databaseId: string) => {
      setExpandedDatabases((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(databaseId)) {
          newSet.delete(databaseId);
        } else {
          newSet.add(databaseId);
        }
        return newSet;
      });
    }, []);

    // Calculate unprocessed documents count
    const unprocessedDocsCount = databases.reduce(
      (count, db) =>
        count + db.documents.filter((doc) => !doc.isProcessed).length,
      0,
    );

    const getFileTypeIcon = (fileType: Document["fileType"]) => {
      switch (fileType) {
        case "PDF":
          return <FileText className="h-3 w-3 text-red-500" />;
        case "Word":
          return <FileText className="h-3 w-3 text-blue-500" />;
        case "Excel":
          return <FileSpreadsheet className="h-3 w-3 text-green-500" />;
        case "PowerPoint":
          return <FileImage className="h-3 w-3 text-orange-500" />;
        case "Image":
          return <FileImage className="h-3 w-3 text-purple-500" />;
        default:
          return <FileText className="h-3 w-3 text-gray-500" />;
      }
    };

    if (!isVisible) return null;

    return (
      <div className="w-80 bg-white dark:bg-gray-800 border-r-2 border-blue-100 dark:border-blue-800 transition-all duration-300 shadow-lg">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-800 dark:text-white flex items-center">
                <Database className="mr-2 h-5 w-5 text-blue-600" />
                {t.documents}
              </h2>
              <Button variant="ghost" size="sm" onClick={onToggleVisibility}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            {/* New Database Input */}
            <div className="mt-2 flex gap-2">
              <Input
                placeholder={t.databaseName}
                value={newDatabaseName}
                onChange={(e) => setNewDatabaseName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createDatabase()}
                className="flex-1"
                size="sm"
              />
              <Button onClick={createDatabase} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Process Documents - Only show when there are unprocessed documents */}
            {unprocessedDocsCount > 0 && (
              <div className="mt-2 flex gap-2">
                <Button
                  onClick={onDragHandlers.processDocuments}
                  disabled={processing.isProcessing}
                  size="sm"
                  className="flex-1"
                >
                  {processing.isProcessing ? (
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  ) : (
                    <Play className="mr-2 h-3 w-3" />
                  )}
                  {t.processDocuments} ({unprocessedDocsCount})
                </Button>
              </div>
            )}

            {/* Enhanced Processing Progress */}
            {processing.isProcessing && (
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>{t.processing}</span>
                  <span>
                    {processing.processedDocuments}/
                    {processing.documentsToProcess}
                  </span>
                </div>
                <Progress value={processing.progress} className="h-2" />
                <div className="text-xs text-gray-500 mt-1 text-center">
                  {processing.progress}% complete
                </div>
              </div>
            )}
          </div>

          {/* Database List */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {databases
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((database) => (
                  <div
                    key={database.id}
                    className={cn(
                      "border rounded-lg p-3 hover:shadow-md transition-all",
                      dragState.dragOver === database.id &&
                        "border-blue-400 bg-blue-50 dark:bg-blue-900/20",
                      dragState.isDraggingFiles &&
                        "border-dashed border-blue-400",
                    )}
                    onDragOver={(e) =>
                      onDragHandlers.onDragOver(e, database.id)
                    }
                    onDragLeave={onDragHandlers.onDragLeave}
                    onDrop={(e) => {
                      if (e.dataTransfer.files.length > 0) {
                        onDragHandlers.onFileDrop(e, database.id);
                      } else {
                        onDragHandlers.onDrop(e, database.id);
                      }
                    }}
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleDatabase(database.id)}
                    >
                      <div className="flex items-center space-x-2 flex-1">
                        <Database className="h-4 w-4 text-blue-500" />
                        {editingDatabase === database.id ? (
                          <Input
                            value={database.name}
                            onChange={(e) =>
                              renameDatabase(database.id, e.target.value)
                            }
                            onBlur={() => setEditingDatabase(null)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") setEditingDatabase(null);
                              if (e.key === "Escape") setEditingDatabase(null);
                            }}
                            autoFocus
                            className="h-6 text-sm"
                          />
                        ) : (
                          <span className="font-medium text-sm">
                            {database.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowNewFolderInput(database.id);
                          }}
                          title="Create Folder"
                        >
                          <FolderPlus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            document
                              .getElementById(`file-upload-${database.id}`)
                              ?.click();
                          }}
                          title="Upload Documents"
                        >
                          <Upload className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingDatabase(database.id);
                          }}
                          title="Edit Database"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDatabase(database.id);
                          }}
                          title="Delete Database"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      {database.documentCount} {t.documents} • {database.size}
                    </div>

                    {/* Folders and Documents List */}
                    {expandedDatabases.has(database.id) && (
                      <div className="mt-2 space-y-1">
                        {/* New Folder Input */}
                        {showNewFolderInput === database.id && (
                          <div className="p-2 border rounded bg-blue-50 dark:bg-blue-900/20">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Folder name"
                                value={newFolderName}
                                onChange={(e) =>
                                  setNewFolderName(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter")
                                    createFolder(database.id, newFolderName);
                                  if (e.key === "Escape")
                                    setShowNewFolderInput(null);
                                }}
                                autoFocus
                                className="h-6 text-xs"
                              />
                              <Button
                                size="sm"
                                onClick={() =>
                                  createFolder(database.id, newFolderName)
                                }
                                disabled={!newFolderName.trim()}
                                className="h-6 px-2"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowNewFolderInput(null)}
                                className="h-6 px-2"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Folders */}
                        {(database.folders || [])
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((folder) => (
                            <div key={folder.id} className="space-y-1">
                              <div
                                className={cn(
                                  "p-1.5 rounded border cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all",
                                  dragState.dragOverFolder === folder.id &&
                                    "border-blue-400 bg-blue-100 dark:bg-blue-900/30",
                                  dragState.isDraggingFiles &&
                                    "border-dashed border-blue-400",
                                )}
                                onClick={() => toggleFolder(folder.id)}
                                onDragOver={(e) =>
                                  onDragHandlers.onDragOver(
                                    e,
                                    database.id,
                                    folder.id,
                                  )
                                }
                                onDragLeave={onDragHandlers.onDragLeave}
                                onDrop={(e) => {
                                  if (e.dataTransfer.files.length > 0) {
                                    onDragHandlers.onFileDrop(
                                      e,
                                      database.id,
                                      folder.id,
                                    );
                                  } else {
                                    onDragHandlers.onDrop(
                                      e,
                                      database.id,
                                      folder.id,
                                    );
                                  }
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-1 flex-1">
                                    {expandedFolders.has(folder.id) ? (
                                      <ChevronDown className="h-3 w-3" />
                                    ) : (
                                      <ChevronRight className="h-3 w-3" />
                                    )}
                                    <Folder className="h-3 w-3 text-blue-600" />
                                    {editingFolder === folder.id ? (
                                      <div className="flex gap-1 flex-1">
                                        <Input
                                          value={editingFolderName}
                                          onChange={(e) =>
                                            setEditingFolderName(e.target.value)
                                          }
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter")
                                              saveEditFolder(
                                                database.id,
                                                folder.id,
                                              );
                                            if (e.key === "Escape")
                                              cancelEditFolder();
                                          }}
                                          autoFocus
                                          className="h-5 text-xs"
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-5 w-5 p-0"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            saveEditFolder(
                                              database.id,
                                              folder.id,
                                            );
                                          }}
                                        >
                                          <Check className="h-2 w-2" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-5 w-5 p-0"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            cancelEditFolder();
                                          }}
                                        >
                                          <X className="h-2 w-2" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <span className="font-medium text-xs">
                                        {folder.name}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-4 w-4 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        startEditFolder(folder);
                                      }}
                                    >
                                      <Edit3 className="h-2 w-2" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-4 w-4 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteFolder(database.id, folder.id);
                                      }}
                                    >
                                      <Trash2 className="h-2 w-2" />
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              {/* Documents in folder */}
                              {expandedFolders.has(folder.id) && (
                                <div className="ml-4 space-y-1">
                                  {database.documents
                                    .filter((doc) => doc.folderId === folder.id)
                                    .sort((a, b) =>
                                      a.name.localeCompare(b.name),
                                    )
                                    .map((doc) => (
                                      <div
                                        key={doc.id}
                                        data-document-id={doc.id}
                                        className={cn(
                                          "p-1.5 rounded border cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-xs",
                                          selectedDatabase === database.id &&
                                            "bg-blue-100 dark:bg-blue-900/30 border-blue-300",
                                          doc.processingStatus ===
                                            "processing" &&
                                            "bg-yellow-50 border-yellow-300",
                                          doc.isProcessed &&
                                            "bg-green-50 border-green-300",
                                          dragState.draggedDocument?.docId ===
                                            doc.id && "opacity-50",
                                        )}
                                        draggable
                                        onDragStart={(e) => {
                                          onDragHandlers.onDragStart(
                                            doc.id,
                                            database.id,
                                          );
                                          e.dataTransfer.effectAllowed = "move";
                                        }}
                                        onClick={() =>
                                          onSelectDocument(doc, database.id)
                                        }
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-2 flex-1">
                                            {getFileTypeIcon(doc.fileType)}
                                            {editingDocument === doc.id ? (
                                              <Input
                                                value={doc.name}
                                                onChange={(e) =>
                                                  renameDocument(
                                                    database.id,
                                                    doc.id,
                                                    e.target.value,
                                                  )
                                                }
                                                onBlur={() =>
                                                  setEditingDocument(null)
                                                }
                                                onKeyDown={(e) => {
                                                  if (e.key === "Enter")
                                                    setEditingDocument(null);
                                                  if (e.key === "Escape")
                                                    setEditingDocument(null);
                                                }}
                                                autoFocus
                                                className="h-5 text-xs"
                                                onClick={(e) =>
                                                  e.stopPropagation()
                                                }
                                              />
                                            ) : (
                                              <span className="font-medium truncate text-xs">
                                                {doc.name}
                                              </span>
                                            )}
                                          </div>
                                          <div className="flex space-x-1">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-4 w-4 p-0"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingDocument(doc.id);
                                              }}
                                            >
                                              <Edit3 className="h-2 w-2" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-4 w-4 p-0"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                deleteDocument(
                                                  database.id,
                                                  doc.id,
                                                );
                                              }}
                                            >
                                              <Trash2 className="h-2 w-2" />
                                            </Button>
                                          </div>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-0.5 truncate">
                                          {doc.type} • {doc.size}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              )}
                            </div>
                          ))}

                        {/* Documents not in folders */}
                        {database.documents
                          .filter((doc) => !doc.folderId)
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((doc) => (
                            <div
                              key={doc.id}
                              data-document-id={doc.id}
                              className={cn(
                                "p-1.5 rounded border cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-xs",
                                selectedDatabase === database.id &&
                                  "bg-blue-100 dark:bg-blue-900/30 border-blue-300",
                                doc.processingStatus === "processing" &&
                                  "bg-yellow-50 border-yellow-300",
                                doc.isProcessed &&
                                  "bg-green-50 border-green-300",
                                dragState.draggedDocument?.docId === doc.id &&
                                  "opacity-50",
                              )}
                              draggable
                              onDragStart={(e) => {
                                onDragHandlers.onDragStart(doc.id, database.id);
                                e.dataTransfer.effectAllowed = "move";
                              }}
                              onClick={() => onSelectDocument(doc, database.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 flex-1">
                                  {getFileTypeIcon(doc.fileType)}
                                  {editingDocument === doc.id ? (
                                    <Input
                                      value={doc.name}
                                      onChange={(e) =>
                                        renameDocument(
                                          database.id,
                                          doc.id,
                                          e.target.value,
                                        )
                                      }
                                      onBlur={() => setEditingDocument(null)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter")
                                          setEditingDocument(null);
                                        if (e.key === "Escape")
                                          setEditingDocument(null);
                                      }}
                                      autoFocus
                                      className="h-5 text-xs"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  ) : (
                                    <span className="font-medium truncate text-xs">
                                      {doc.name}
                                    </span>
                                  )}
                                </div>
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-4 w-4 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingDocument(doc.id);
                                    }}
                                  >
                                    <Edit3 className="h-2 w-2" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-4 w-4 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteDocument(database.id, doc.id);
                                    }}
                                  >
                                    <Trash2 className="h-2 w-2" />
                                  </Button>
                                </div>
                              </div>
                              <div className="text-xs text-gray-400 mt-0.5 truncate">
                                {doc.type} • {doc.size}
                              </div>
                            </div>
                          ))}

                        {/* Hidden file input for uploads */}
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          id={`file-upload-${database.id}`}
                          onChange={(e) =>
                            onFileUpload(e.target.files, database.id)
                          }
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt"
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  },
);

DatabasePanel.displayName = "DatabasePanel";

export default DatabasePanel;
