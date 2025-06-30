import { Database, Document } from "@/hooks/use-optimized-tia-app";

export interface DragDropHandlers {
  onDragStart: (docId: string, fromDbId: string) => void;
  onDragOver: (e: React.DragEvent, dbId?: string, folderId?: string) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, dbId?: string, folderId?: string) => void;
  onFileDrop: (e: React.DragEvent, dbId: string, folderId?: string) => void;
  processDocuments: () => Promise<void>;
}

export interface DragState {
  draggedDocument: { docId: string; fromDbId: string } | null;
  dragOver: string | null;
  dragOverFolder: string | null;
  chatDragOver: boolean;
  isDraggingFiles: boolean;
}

export function createDragDropHandlers(
  dragState: DragState,
  setDragState: (state: DragState | ((prev: DragState) => DragState)) => void,
  databases: Database[],
  setDatabases: React.Dispatch<React.SetStateAction<Database[]>>,
  handleFileUpload: (
    files: FileList,
    targetDbId: string,
    folderId?: string,
  ) => Promise<void>,
  processDocuments: () => Promise<void>,
): DragDropHandlers {
  const getFileType = (fileName: string): Document["fileType"] => {
    const extension = fileName.toLowerCase().split(".").pop();
    switch (extension) {
      case "pdf":
        return "PDF";
      case "doc":
      case "docx":
        return "Word";
      case "xls":
      case "xlsx":
        return "Excel";
      case "ppt":
      case "pptx":
        return "PowerPoint";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "Image";
      default:
        return "Text";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const processFiles = async (
    files: FileList,
    targetDbId: string,
    folderId?: string,
  ): Promise<void> => {
    const processedDocuments: Document[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Basic file validation
      if (file.size > 50 * 1024 * 1024) {
        // 50MB limit
        console.warn(`File ${file.name} is too large (over 50MB)`);
        continue;
      }

      const newDocument: Document = {
        id: `doc-${Date.now()}-${i}`,
        name: file.name,
        type: file.type || "application/octet-stream",
        size: formatFileSize(file.size),
        pages: 1,
        createdDate: new Date().toISOString().split("T")[0],
        addedDate: new Date().toISOString().split("T")[0],
        content: `Content from ${file.name}. This file was uploaded and will be processed to extract searchable content.`,
        fileType: getFileType(file.name),
        isProcessed: false,
        processingStatus: "pending",
        folderId: folderId || null,
      };

      processedDocuments.push(newDocument);
    }

    if (processedDocuments.length === 0) return;

    // Add documents to the specified database
    setDatabases((prev) =>
      prev.map((db) =>
        db.id === targetDbId
          ? {
              ...db,
              documents: [...db.documents, ...processedDocuments],
              documentCount: db.documentCount + processedDocuments.length,
              lastModified: new Date().toISOString().split("T")[0],
            }
          : db,
      ),
    );
  };

  const moveDocument = (
    fromDbId: string,
    toDbId: string,
    docId: string,
    toFolderId?: string | null,
  ): void => {
    let documentToMove: Document | null = null;

    // Find and remove the document from source database
    setDatabases((prev) =>
      prev.map((db) => {
        if (db.id === fromDbId) {
          const doc = db.documents.find((d) => d.id === docId);
          if (doc) {
            documentToMove = { ...doc, folderId: toFolderId || null };
          }
          return {
            ...db,
            documents: db.documents.filter((d) => d.id !== docId),
            documentCount: db.documentCount - 1,
            lastModified: new Date().toISOString().split("T")[0],
          };
        }
        return db;
      }),
    );

    // Add to target database
    if (documentToMove) {
      setDatabases((prev) =>
        prev.map((db) =>
          db.id === toDbId
            ? {
                ...db,
                documents: [...db.documents, documentToMove!],
                documentCount: db.documentCount + 1,
                lastModified: new Date().toISOString().split("T")[0],
              }
            : db,
        ),
      );
    }
  };

  const moveDocumentToFolder = (
    databaseId: string,
    docId: string,
    folderId: string | null,
  ): void => {
    setDatabases((prev) =>
      prev.map((db) =>
        db.id === databaseId
          ? {
              ...db,
              documents: db.documents.map((doc) =>
                doc.id === docId ? { ...doc, folderId } : doc,
              ),
              lastModified: new Date().toISOString().split("T")[0],
            }
          : db,
      ),
    );
  };

  return {
    onDragStart: (docId: string, fromDbId: string) => {
      setDragState((prev) => ({
        ...prev,
        draggedDocument: { docId, fromDbId },
      }));
    },

    onDragOver: (e: React.DragEvent, dbId?: string, folderId?: string) => {
      e.preventDefault();
      e.stopPropagation();
      setDragState((prev) => ({
        ...prev,
        isDraggingFiles: e.dataTransfer.types.includes("Files"),
        dragOver: dbId || null,
        dragOverFolder: folderId || null,
      }));
    },

    onDragLeave: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragState((prev) => ({
        ...prev,
        dragOver: null,
        dragOverFolder: null,
        isDraggingFiles: false,
      }));
    },

    onDrop: (e: React.DragEvent, dbId?: string, folderId?: string) => {
      e.preventDefault();
      e.stopPropagation();

      if (!dragState.draggedDocument || !dbId) {
        setDragState((prev) => ({
          ...prev,
          draggedDocument: null,
          dragOver: null,
          dragOverFolder: null,
          isDraggingFiles: false,
        }));
        return;
      }

      const { docId, fromDbId } = dragState.draggedDocument;

      // Move document between databases or into folder
      if (fromDbId !== dbId) {
        moveDocument(fromDbId, dbId, docId, folderId);
      } else {
        // Just move to folder within same database
        moveDocumentToFolder(dbId, docId, folderId || null);
      }

      // Reset drag state
      setDragState((prev) => ({
        ...prev,
        draggedDocument: null,
        dragOver: null,
        dragOverFolder: null,
        isDraggingFiles: false,
      }));
    },

    onFileDrop: async (e: React.DragEvent, dbId: string, folderId?: string) => {
      e.preventDefault();
      e.stopPropagation();

      const files = e.dataTransfer.files;
      if (files.length === 0) return;

      await processFiles(files, dbId, folderId);

      // Reset drag state
      setDragState((prev) => ({
        ...prev,
        draggedDocument: null,
        dragOver: null,
        dragOverFolder: null,
        isDraggingFiles: false,
      }));
    },

    processDocuments,
  };
}
