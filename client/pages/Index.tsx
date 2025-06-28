import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Trash2,
  Edit3,
  FileText,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
  Send,
  Save,
  ZoomIn,
  ZoomOut,
  User,
  LogOut,
  Shield,
  FileCheck,
  Menu,
  Eye,
  EyeOff,
  Globe,
  Type,
  Palette,
  CreditCard,
  Package,
  Receipt,
  Users,
  Upload,
  X,
  Download,
  Move,
  Highlight,
  Play,
  Loader2,
  FileImage,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useTranslation, Language } from "@/lib/i18n";

// Import modals
import { UserProfileModal } from "@/components/modals/UserProfileModal";
import { SecurityModal } from "@/components/modals/SecurityModal";
import { TermsModal } from "@/components/modals/TermsModal";
import { CurrentPlanModal } from "@/components/modals/CurrentPlanModal";
import { AvailablePackagesModal } from "@/components/modals/AvailablePackagesModal";
import { ViewBillsModal } from "@/components/modals/ViewBillsModal";
import { TeamsModal } from "@/components/modals/TeamsModal";

interface Database {
  id: string;
  name: string;
  size: string;
  documentCount: number;
  createdDate: string;
  lastModified: string;
  documents: Document[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  pages: number;
  createdDate: string;
  addedDate: string;
  content: string;
  fileType: "PDF" | "Word" | "Excel" | "PowerPoint" | "Image" | "Text";
}

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: string;
  documentReferences?: string[];
}

interface SavedChat {
  id: string;
  name: string;
  messages: ChatMessage[];
  createdDate: string;
}

export default function Index() {
  // Layout state
  const [showColumn1, setShowColumn1] = useState(false);
  const [showColumn2, setShowColumn2] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("light");

  // Get translations
  const t = useTranslation(language);

  // Enhanced modal states with better cleanup
  const [modals, setModals] = useState({
    userProfile: false,
    security: false,
    terms: false,
    currentPlan: false,
    availablePackages: false,
    viewBills: false,
    teams: false,
  });

  // User state
  const [isAdmin] = useState(true);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  // Enhanced data state
  const [databases, setDatabases] = useState<Database[]>([
    {
      id: "1",
      name: "Company Policies",
      size: "25.4 MB",
      documentCount: 12,
      createdDate: "2024-01-15",
      lastModified: "2024-01-20",
      documents: [
        {
          id: "doc1",
          name: "Employee Handbook.pdf",
          type: "PDF",
          size: "2.1 MB",
          pages: 45,
          createdDate: "2024-01-10",
          addedDate: "2024-01-15",
          content:
            "This comprehensive employee handbook outlines company policies, procedures, and guidelines for all staff members. It covers workplace conduct, benefits, time-off policies, and professional development opportunities. Section 1: Introduction to Company Culture. Our company values integrity, innovation, and collaboration. We believe in creating an inclusive environment where every employee can thrive. Section 2: Code of Conduct. All employees are expected to maintain professional behavior at all times. This includes respectful communication, punctuality, and adherence to company policies.",
          fileType: "PDF",
        },
        {
          id: "doc2",
          name: "Security Guidelines.docx",
          type: "Word",
          size: "1.8 MB",
          pages: 32,
          createdDate: "2024-01-12",
          addedDate: "2024-01-16",
          content:
            "Security guidelines and protocols for maintaining information security and data protection within the organization. This document covers password policies, data handling procedures, and incident response protocols. Password Requirements: Minimum 12 characters, mix of uppercase, lowercase, numbers, and special characters. Two-factor authentication is mandatory for all accounts.",
          fileType: "Word",
        },
      ],
    },
    {
      id: "2",
      name: "Technical Documentation",
      size: "45.2 MB",
      documentCount: 28,
      createdDate: "2024-01-10",
      lastModified: "2024-01-22",
      documents: [
        {
          id: "doc3",
          name: "API Documentation.pdf",
          type: "PDF",
          size: "3.2 MB",
          pages: 78,
          createdDate: "2024-01-08",
          addedDate: "2024-01-11",
          content:
            "Complete API documentation including endpoints, authentication methods, request/response formats, and integration examples for developers. REST API Endpoints: GET /api/users - Retrieve user list. POST /api/users - Create new user. PUT /api/users/{id} - Update user. DELETE /api/users/{id} - Delete user. Authentication: Bearer token required in Authorization header.",
          fileType: "PDF",
        },
        {
          id: "doc4",
          name: "Project Timeline.xlsx",
          type: "Excel",
          size: "1.5 MB",
          pages: 12,
          createdDate: "2024-01-20",
          addedDate: "2024-01-20",
          content:
            "Project timeline and milestone tracking spreadsheet. Contains task assignments, deadlines, progress tracking, and resource allocation for the Q1 2024 development cycle.",
          fileType: "Excel",
        },
      ],
    },
  ]);

  // Document state
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );
  const [currentDocumentPage, setCurrentDocumentPage] = useState(1);
  const [documentZoom, setDocumentZoom] = useState(100);
  const [documentSearchQuery, setDocumentSearchQuery] = useState("");
  const [documentSearchResults, setDocumentSearchResults] = useState<number[]>(
    [],
  );
  const [currentSearchResult, setCurrentSearchResult] = useState(0);

  // Enhanced chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello! I'm Tia, your AI assistant. How can I help you today? I can search through your company documents and provide relevant information.",
      timestamp: new Date().toISOString(),
      documentReferences: [],
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [savedChats, setSavedChats] = useState<SavedChat[]>([
    {
      id: "1",
      name: "Welcome Session",
      messages: chatMessages,
      createdDate: "2024-01-22",
    },
  ]);
  const [currentChatId, setCurrentChatId] = useState("1");
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [filteredMessages, setFilteredMessages] = useState(chatMessages);

  // Editing states
  const [editingDatabase, setEditingDatabase] = useState<string | null>(null);
  const [editingDocument, setEditingDocument] = useState<string | null>(null);
  const [newDatabaseName, setNewDatabaseName] = useState("");

  // Enhanced drag and drop states
  const [draggedDocument, setDraggedDocument] = useState<{
    docId: string;
    fromDbId: string;
  } | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [chatDragOver, setChatDragOver] = useState(false);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);

  // File upload refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Settings states
  const [privacySettings, setPrivacySettings] = useState({
    shareUsage: true,
    saveHistory: true,
    allowAnalytics: false,
  });

  // Enhanced modal helper functions with complete cleanup
  const openModal = useCallback((modalName: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [modalName]: true }));
  }, []);

  const closeModal = useCallback((modalName: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));

    // Enhanced cleanup to ensure menus remain functional
    setTimeout(() => {
      // Remove any stuck radix attributes
      document
        .querySelectorAll("[data-radix-dropdown-menu-trigger]")
        .forEach((el) => {
          el.removeAttribute("data-state");
          el.removeAttribute("aria-expanded");
        });

      document
        .querySelectorAll("[data-radix-dropdown-menu-content]")
        .forEach((el) => {
          if (el.getAttribute("data-state") === "closed") {
            el.remove();
          }
        });

      // Force re-render of dropdown components
      const event = new Event("resize");
      window.dispatchEvent(event);
    }, 100);
  }, []);

  // Enhanced search functionality
  useEffect(() => {
    if (chatSearchQuery.trim()) {
      const filtered = chatMessages.filter((message) =>
        message.content.toLowerCase().includes(chatSearchQuery.toLowerCase()),
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(chatMessages);
    }
  }, [chatSearchQuery, chatMessages]);

  // Document search functionality
  const searchInDocument = useCallback(() => {
    if (!selectedDocument || !documentSearchQuery.trim()) {
      setDocumentSearchResults([]);
      return;
    }

    const content = selectedDocument.content.toLowerCase();
    const query = documentSearchQuery.toLowerCase();
    const results: number[] = [];
    let index = content.indexOf(query);

    while (index !== -1) {
      results.push(index);
      index = content.indexOf(query, index + 1);
    }

    setDocumentSearchResults(results);
    setCurrentSearchResult(0);
  }, [selectedDocument, documentSearchQuery]);

  useEffect(() => {
    searchInDocument();
  }, [searchInDocument]);

  // Auto-scroll chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages]);

  // Database management functions
  const createDatabase = () => {
    if (!newDatabaseName.trim()) return;

    const newDb: Database = {
      id: Date.now().toString(),
      name: newDatabaseName,
      size: "0 MB",
      documentCount: 0,
      createdDate: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
      documents: [],
    };

    setDatabases((prev) => [...prev, newDb]);
    setNewDatabaseName("");
  };

  const deleteDatabase = (dbId: string) => {
    if (confirm(t.confirmDelete)) {
      setDatabases((prev) => prev.filter((db) => db.id !== dbId));
      if (selectedDatabase === dbId) {
        setSelectedDatabase(null);
        setSelectedDocument(null);
      }
    }
  };

  const renameDatabase = (dbId: string, newName: string) => {
    setDatabases((prev) =>
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
  };

  const deleteDocument = (dbId: string, docId: string) => {
    if (confirm(t.confirmDelete)) {
      setDatabases((prev) =>
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

      if (selectedDocument?.id === docId) {
        setSelectedDocument(null);
      }
    }
  };

  const renameDocument = (dbId: string, docId: string, newName: string) => {
    setDatabases((prev) =>
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
  };

  // Process documents function
  const processDocuments = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);

    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // File type detection
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

  // Enhanced file upload functions with improved drag and drop
  const handleFileUpload = (files: FileList | null, targetDbId: string) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      const fileType = getFileType(file.name);
      const newDoc: Document = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: fileType,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
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
                  parseFloat(newDoc.size.replace(" MB", ""))
                ).toFixed(1)} MB`,
                lastModified: new Date().toISOString().split("T")[0],
              }
            : db,
        ),
      );
    });
  };

  // Enhanced chat file upload with auto-create "My Documents" database
  const handleChatFileUpload = (files: FileList | null) => {
    if (!files) return;

    let myDocsDb = databases.find((db) => db.name === t.myDocuments);

    if (!myDocsDb) {
      const newMyDocsDb: Database = {
        id: "my-docs-" + Date.now(),
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
  };

  // Enhanced drag and drop functions
  const handleDragStart = (docId: string, fromDbId: string) => {
    setDraggedDocument({ docId, fromDbId });
  };

  const handleDragOver = (e: React.DragEvent, dbId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFiles(e.dataTransfer.types.includes("Files"));
    if (dbId) {
      setDragOver(dbId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(null);
    setIsDraggingFiles(false);
  };

  const handleDrop = (e: React.DragEvent, toDbId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(null);
    setIsDraggingFiles(false);

    // Handle file drops
    if (e.dataTransfer.files.length > 0 && toDbId) {
      handleFileUpload(e.dataTransfer.files, toDbId);
      return;
    }

    // Handle document moves
    if (!draggedDocument || !toDbId || draggedDocument.fromDbId === toDbId)
      return;

    const { docId, fromDbId } = draggedDocument;
    const sourceDb = databases.find((db) => db.id === fromDbId);
    const docToMove = sourceDb?.documents.find((doc) => doc.id === docId);

    if (!docToMove) return;

    setDatabases((prev) =>
      prev.map((db) => {
        if (db.id === fromDbId) {
          return {
            ...db,
            documents: db.documents.filter((doc) => doc.id !== docId),
            documentCount: db.documentCount - 1,
            lastModified: new Date().toISOString().split("T")[0],
          };
        }
        if (db.id === toDbId) {
          return {
            ...db,
            documents: [...db.documents, docToMove],
            documentCount: db.documentCount + 1,
            lastModified: new Date().toISOString().split("T")[0],
          };
        }
        return db;
      }),
    );

    setDraggedDocument(null);
  };

  // Enhanced chat drag and drop
  const handleChatDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes("Files")) {
      setChatDragOver(true);
    }
  };

  const handleChatDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setChatDragOver(false);
    }
  };

  const handleChatDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setChatDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleChatFileUpload(e.dataTransfer.files);
    }
  };

  // Chat functions
  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: currentMessage,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...chatMessages, userMessage];
    setChatMessages(newMessages);

    setSavedChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId ? { ...chat, messages: newMessages } : chat,
      ),
    );

    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: `I understand you're asking about "${currentMessage}". Based on the documents in your database, here's what I found. You can find more details in the Employee Handbook and Security Guidelines.`,
        timestamp: new Date().toISOString(),
        documentReferences: ["doc1", "doc2"],
      };

      const updatedMessages = [...newMessages, botMessage];
      setChatMessages(updatedMessages);

      setSavedChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: updatedMessages }
            : chat,
        ),
      );
    }, 1500);

    setCurrentMessage("");
  };

  const handleDocumentReference = (docId: string) => {
    for (const database of databases) {
      const doc = database.documents.find((d) => d.id === docId);
      if (doc) {
        setSelectedDocument(doc);
        setShowColumn2(true);
        setSelectedDatabase(database.id);
        setShowColumn1(true);
        break;
      }
    }
  };

  const handleSaveConversation = () => {
    const chatName =
      prompt(`${t.chatSessionName}:`) ||
      `${t.chatSessionName} ${savedChats.length + 1}`;

    const newChat: SavedChat = {
      id: Date.now().toString(),
      name: chatName,
      messages: chatMessages,
      createdDate: new Date().toISOString().split("T")[0],
    };

    setSavedChats((prev) => [...prev, newChat]);
    setCurrentChatId(newChat.id);
  };

  const loadSavedChat = (chatId: string) => {
    const chat = savedChats.find((c) => c.id === chatId);
    if (chat) {
      setChatMessages(chat.messages);
      setCurrentChatId(chatId);
    }
  };

  const deleteChatMessage = (messageId: string) => {
    const updatedMessages = chatMessages.filter((m) => m.id !== messageId);
    setChatMessages(updatedMessages);

    setSavedChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, messages: updatedMessages }
          : chat,
      ),
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const toggleDatabase = (databaseId: string) => {
    setSelectedDatabase(selectedDatabase === databaseId ? null : databaseId);
  };

  // Render highlighted text
  const renderHighlightedText = (text: string, searchQuery: string) => {
    if (!searchQuery) return text;

    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={index} className="bg-yellow-300">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  // File type icon
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

  // Enhanced document viewer for different file types
  const renderDocumentContent = (document: Document) => {
    switch (document.fileType) {
      case "PDF":
        return (
          <div className="bg-white dark:bg-gray-900 p-6 rounded border shadow-sm min-h-96">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-red-500" />
              <span className="font-semibold">PDF Document</span>
            </div>
            <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
              {renderHighlightedText(document.content, documentSearchQuery)}
            </div>
          </div>
        );
      case "Word":
        return (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded border shadow-sm min-h-96">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-blue-500" />
              <span className="font-semibold">Word Document</span>
            </div>
            <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
              {renderHighlightedText(document.content, documentSearchQuery)}
            </div>
          </div>
        );
      case "Excel":
        return (
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded border shadow-sm min-h-96">
            <div className="flex items-center gap-2 mb-4">
              <FileSpreadsheet className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Excel Spreadsheet</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-green-100 dark:bg-green-800 p-2 rounded font-semibold">
                Task
              </div>
              <div className="bg-green-100 dark:bg-green-800 p-2 rounded font-semibold">
                Status
              </div>
              <div className="bg-green-100 dark:bg-green-800 p-2 rounded font-semibold">
                Date
              </div>
              <div className="p-2">Design Phase</div>
              <div className="p-2">Complete</div>
              <div className="p-2">2024-01-15</div>
              <div className="p-2">Development</div>
              <div className="p-2">In Progress</div>
              <div className="p-2">2024-01-20</div>
            </div>
            <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
              {renderHighlightedText(document.content, documentSearchQuery)}
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white dark:bg-gray-900 p-6 rounded border shadow-sm min-h-96">
            <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
              {renderHighlightedText(document.content, documentSearchQuery)}
            </div>
          </div>
        );
    }
  };

  // Apply theme
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div
      className={cn(
        "h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50",
        theme === "dark" && "dark:from-gray-900 dark:to-gray-800",
      )}
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Header with Tia Icon */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b-2 border-blue-100 dark:border-blue-800 px-6 py-2 flex items-center justify-between relative z-50">
        <div className="flex items-center space-x-6">
          {/* Company Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-lg font-semibold text-gray-800 dark:text-white">
              Softia
            </span>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Tia Branding in Header */}
          <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded shadow-lg">
            <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
              <span className="font-bold text-xs">Tia</span>
            </div>
            <div>
              <div className="font-semibold text-sm">Tia</div>
              <div className="text-xs opacity-90">v2.1.0</div>
            </div>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {isAdmin && (
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 flex items-center gap-2"
                onClick={() => openModal("teams")}
              >
                <Users className="h-4 w-4" />
                {t.teams}
              </Button>
            )}

            {isAdmin && (
              <DropdownMenu key={`your-plan-dropdown-${Date.now()}`}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  >
                    {t.yourPlan}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="z-50">
                  <DropdownMenuLabel>Plan Management</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => openModal("currentPlan")}>
                    <Package className="mr-2 h-4 w-4" />
                    {t.currentPlan}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openModal("availablePackages")}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {t.availablePackages}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openModal("viewBills")}>
                    <Receipt className="mr-2 h-4 w-4" />
                    {t.viewBills}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            John Doe
          </span>
          <DropdownMenu key={`user-profile-dropdown-${Date.now()}`}>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer ring-2 ring-blue-200 hover:ring-blue-400 transition-all">
                <AvatarImage src="" />
                <AvatarFallback className="bg-blue-600 text-white font-semibold">
                  JD
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50">
              <DropdownMenuLabel>{t.myAccount}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openModal("userProfile")}>
                <User className="mr-2 h-4 w-4" />
                {t.profile}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openModal("security")}>
                <Shield className="mr-2 h-4 w-4" />
                {t.security}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openModal("terms")}>
                <FileCheck className="mr-2 h-4 w-4" />
                {t.termsOfUse}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                {t.logOut}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Column 1 - Enhanced Database Management with Working Drag & Drop */}
        <div
          className={cn(
            "bg-white dark:bg-gray-800 border-r-2 border-blue-100 dark:border-blue-800 transition-all duration-300 shadow-lg",
            showColumn1 ? "w-80" : "w-0 overflow-hidden",
          )}
        >
          {showColumn1 && (
            <div className="h-full flex flex-col">
              {/* Column 1 Header */}
              <div className="p-4 border-b bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800 dark:text-white flex items-center">
                    <Database className="mr-2 h-5 w-5 text-blue-600" />
                    {t.databases}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowColumn1(false)}
                  >
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

                {/* Process Documents */}
                <div className="mt-2 flex gap-2">
                  <Button
                    onClick={processDocuments}
                    disabled={isProcessing}
                    size="sm"
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    ) : (
                      <Play className="mr-2 h-3 w-3" />
                    )}
                    {t.processDocuments}
                  </Button>
                </div>

                {/* Processing Progress */}
                {isProcessing && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{t.processing}</span>
                      <span>{processingProgress}%</span>
                    </div>
                    <Progress value={processingProgress} className="h-2" />
                  </div>
                )}
              </div>

              {/* Database List */}
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-2">
                  {databases.map((database) => (
                    <div
                      key={database.id}
                      className={cn(
                        "border rounded-lg p-3 hover:shadow-md transition-all",
                        dragOver === database.id &&
                          "border-blue-400 bg-blue-50 dark:bg-blue-900/20",
                        isDraggingFiles && "border-dashed border-blue-400",
                      )}
                      onDragOver={(e) => handleDragOver(e, database.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, database.id)}
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
                                if (e.key === "Escape")
                                  setEditingDatabase(null);
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
                              setEditingDatabase(database.id);
                            }}
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
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {database.documentCount} {t.documents} • {database.size}
                      </div>

                      {/* Documents List */}
                      {selectedDatabase === database.id && (
                        <div className="mt-3 space-y-1">
                          {database.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className={cn(
                                "p-2 rounded border cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-xs",
                                selectedDocument?.id === doc.id &&
                                  "bg-blue-100 border-blue-300 dark:bg-blue-900/30",
                              )}
                              draggable
                              onDragStart={() =>
                                handleDragStart(doc.id, database.id)
                              }
                              onClick={() => {
                                setSelectedDocument(doc);
                                setShowColumn2(true);
                              }}
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
                                    <span className="font-medium truncate">
                                      {doc.name}
                                    </span>
                                  )}
                                </div>
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0"
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
                                    className="h-5 w-5 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteDocument(database.id, doc.id);
                                    }}
                                  >
                                    <Trash2 className="h-2 w-2" />
                                  </Button>
                                </div>
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {doc.type} • {doc.pages} {t.pages} • {doc.size}
                              </div>
                            </div>
                          ))}

                          {/* Enhanced Add Document Section with Working Drag & Drop */}
                          <div
                            className={cn(
                              "border-2 border-dashed border-gray-300 rounded p-3 transition-all",
                              "hover:border-blue-400 hover:bg-blue-50/50",
                              dragOver === database.id &&
                                "border-blue-500 bg-blue-100 dark:bg-blue-900/30",
                            )}
                            onDragOver={(e) => handleDragOver(e, database.id)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, database.id)}
                          >
                            <input
                              type="file"
                              multiple
                              className="hidden"
                              id={`file-upload-${database.id}`}
                              onChange={(e) =>
                                handleFileUpload(e.target.files, database.id)
                              }
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs"
                              onClick={() =>
                                document
                                  .getElementById(`file-upload-${database.id}`)
                                  ?.click()
                              }
                            >
                              <Plus className="mr-1 h-3 w-3" />
                              {t.addDocument}
                            </Button>
                            <p className="text-xs text-gray-500 mt-1 text-center">
                              {t.dragDropFiles}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 text-center">
                              PDF, Word, Excel, PowerPoint, Images
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Column 2 - Enhanced Document Viewer with Multi-format Support */}
        <div
          className={cn(
            "bg-white dark:bg-gray-800 border-r-2 border-blue-100 dark:border-blue-800 transition-all duration-300 shadow-lg",
            showColumn2 ? "w-96" : "w-0 overflow-hidden",
          )}
        >
          {showColumn2 && (
            <div className="h-full flex flex-col">
              {/* Column 2 Header */}
              <div className="p-4 border-b bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800 dark:text-white flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-blue-600" />
                    {t.documentViewer}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowColumn2(false)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>

                {selectedDocument && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      {getFileTypeIcon(selectedDocument.fileType)}
                      <div className="text-sm font-medium">
                        {selectedDocument.name}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {t.page} {currentDocumentPage} {t.of}{" "}
                      {selectedDocument.pages}
                    </div>
                  </div>
                )}

                {/* Document Search */}
                <div className="mt-2 flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                    <Input
                      placeholder={t.searchInDocument}
                      value={documentSearchQuery}
                      onChange={(e) => setDocumentSearchQuery(e.target.value)}
                      className="pl-8 h-8 text-xs"
                    />
                  </div>
                  {documentSearchResults.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">
                        {currentSearchResult + 1}/{documentSearchResults.length}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() =>
                          setCurrentSearchResult(
                            Math.max(0, currentSearchResult - 1),
                          )
                        }
                        disabled={currentSearchResult <= 0}
                      >
                        <ChevronLeft className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() =>
                          setCurrentSearchResult(
                            Math.min(
                              documentSearchResults.length - 1,
                              currentSearchResult + 1,
                            ),
                          )
                        }
                        disabled={
                          currentSearchResult >=
                          documentSearchResults.length - 1
                        }
                      >
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Controls */}
              {selectedDocument && (
                <div className="p-3 border-b bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setDocumentZoom(Math.max(50, documentZoom - 10))
                      }
                    >
                      <ZoomOut className="h-3 w-3" />
                    </Button>
                    <span className="text-xs">{documentZoom}%</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setDocumentZoom(Math.min(200, documentZoom + 10))
                      }
                    >
                      <ZoomIn className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentDocumentPage <= 1}
                      onClick={() =>
                        setCurrentDocumentPage(
                          Math.max(1, currentDocumentPage - 1),
                        )
                      }
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </Button>
                    <Input
                      className="w-12 h-7 text-xs text-center"
                      value={currentDocumentPage}
                      onChange={(e) => {
                        const page = Math.max(
                          1,
                          Math.min(
                            selectedDocument.pages,
                            parseInt(e.target.value) || 1,
                          ),
                        );
                        setCurrentDocumentPage(page);
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentDocumentPage >= selectedDocument.pages}
                      onClick={() =>
                        setCurrentDocumentPage(
                          Math.min(
                            selectedDocument.pages,
                            currentDocumentPage + 1,
                          ),
                        )
                      }
                    >
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Enhanced Document Content */}
              <ScrollArea className="flex-1">
                <div className="p-4">
                  {selectedDocument ? (
                    <div
                      className="max-w-none"
                      style={{
                        transform: `scale(${documentZoom / 100})`,
                        transformOrigin: "top left",
                      }}
                    >
                      {renderDocumentContent(selectedDocument)}
                      <div className="mt-8 text-center text-gray-400 text-sm">
                        {t.page} {currentDocumentPage} {t.of}{" "}
                        {selectedDocument.pages}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      {t.selectDocument}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Column 3 - Enhanced Chat Interface with Working Drag & Drop */}
        <div
          className="flex-1 flex flex-col bg-white dark:bg-gray-800 shadow-lg"
          style={{ width: showColumn1 || showColumn2 ? "55%" : "100%" }}
        >
          {/* Column 3 Header */}
          <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {!showColumn1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowColumn1(true)}
                    className="text-white hover:bg-white/20"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                )}
                {!showColumn2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowColumn2(true)}
                    className="text-white hover:bg-white/20"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                <h2 className="font-semibold">{t.chatWithTia}</h2>
              </div>

              <div className="flex items-center space-x-2">
                {/* Enhanced Chat Search */}
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t.searchChat}
                    className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/70 w-48"
                    value={chatSearchQuery}
                    onChange={(e) => setChatSearchQuery(e.target.value)}
                  />
                </div>

                {/* Enhanced Saved Chats */}
                <DropdownMenu key={`saved-chats-dropdown-${Date.now()}`}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      {t.savedChats}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="z-50">
                    <DropdownMenuLabel>Chat Sessions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {savedChats.map((chat) => (
                      <DropdownMenuItem
                        key={chat.id}
                        onClick={() => loadSavedChat(chat.id)}
                        className={
                          currentChatId === chat.id ? "bg-blue-50" : ""
                        }
                      >
                        <div className="flex flex-col">
                          <span>{chat.name}</span>
                          <span className="text-xs text-gray-500">
                            {chat.createdDate}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSaveConversation}>
                      <Save className="mr-2 h-4 w-4" />
                      {t.saveCurrent}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Enhanced Settings */}
                <DropdownMenu key={`settings-dropdown-${Date.now()}`}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="z-50 w-64">
                    <DropdownMenuLabel>{t.settings}</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Language Selection */}
                    <div className="p-2">
                      <Label className="text-sm font-medium">
                        {t.language}
                      </Label>
                      <Select
                        value={language}
                        onValueChange={(value: Language) => setLanguage(value)}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <DropdownMenuSeparator />

                    {/* Font Size */}
                    <div className="p-2">
                      <Label className="text-sm font-medium">
                        {t.fontSize}: {fontSize}px
                      </Label>
                      <Slider
                        value={[fontSize]}
                        onValueChange={(value) => setFontSize(value[0])}
                        max={24}
                        min={12}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <DropdownMenuSeparator />

                    {/* Theme Selection */}
                    <div className="p-2">
                      <Label className="text-sm font-medium">
                        {t.appearance}
                      </Label>
                      <Select
                        value={theme}
                        onValueChange={(value: "light" | "dark" | "auto") =>
                          setTheme(value)
                        }
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">{t.light}</SelectItem>
                          <SelectItem value="dark">{t.dark}</SelectItem>
                          <SelectItem value="auto">{t.auto}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <DropdownMenuSeparator />

                    {/* Privacy Settings */}
                    <div className="p-2 space-y-3">
                      <Label className="text-sm font-medium">
                        {t.privacySettings}
                      </Label>

                      <div className="flex items-center justify-between">
                        <Label className="text-xs">{t.shareUsage}</Label>
                        <Switch
                          checked={privacySettings.shareUsage}
                          onCheckedChange={(checked) =>
                            setPrivacySettings((prev) => ({
                              ...prev,
                              shareUsage: checked,
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-xs">{t.saveHistory}</Label>
                        <Switch
                          checked={privacySettings.saveHistory}
                          onCheckedChange={(checked) =>
                            setPrivacySettings((prev) => ({
                              ...prev,
                              saveHistory: checked,
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-xs">{t.allowAnalytics}</Label>
                        <Switch
                          checked={privacySettings.allowAnalytics}
                          onCheckedChange={(checked) =>
                            setPrivacySettings((prev) => ({
                              ...prev,
                              allowAnalytics: checked,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Optimized Chat Messages with "Tia" instead of "T" */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start space-x-2",
                    message.type === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {message.type === "bot" && (
                    <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">Tia</span>
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-lg rounded-lg p-3 shadow-md relative text-sm leading-relaxed",
                      message.type === "user"
                        ? "bg-blue-600 text-white ml-8"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
                    )}
                  >
                    <div className="mb-1">
                      {message.type === "bot" ? (
                        <div>
                          <div>
                            {message.content.split(". References:")[0]}.
                          </div>
                          {message.documentReferences &&
                            message.documentReferences.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                                <div className="text-xs font-semibold mb-1">
                                  {t.references}:
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {message.documentReferences.map(
                                    (docId, index) => (
                                      <button
                                        key={index}
                                        onClick={() =>
                                          handleDocumentReference(docId)
                                        }
                                        className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 font-medium text-xs bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded"
                                      >
                                        [{docId}]
                                      </button>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      ) : (
                        message.content
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs opacity-70 mt-1">
                      <span>{formatTimestamp(message.timestamp)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 opacity-50 hover:opacity-100"
                        onClick={() => deleteChatMessage(message.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {message.type === "user" && (
                    <Avatar className="flex-shrink-0 w-7 h-7">
                      <AvatarFallback className="bg-blue-600 text-white text-xs">
                        J
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          {/* Enhanced Chat Input with Working Drag & Drop */}
          <div
            className={cn(
              "p-4 border-t bg-gray-50 dark:bg-gray-700 transition-all duration-200",
              chatDragOver &&
                "bg-blue-100 dark:bg-blue-900/30 border-blue-400 border-2",
            )}
            onDragOver={handleChatDragOver}
            onDragLeave={handleChatDragLeave}
            onDrop={handleChatDrop}
          >
            <div className="flex space-x-3">
              <Textarea
                placeholder={t.askQuestion}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1 min-h-[50px] resize-none"
              />
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={handleSendMessage}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>

                {/* Chat File Upload */}
                <input
                  ref={chatFileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleChatFileUpload(e.target.files)}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => chatFileInputRef.current?.click()}
                  title={`${t.uploadFiles} ${t.myDocuments}`}
                >
                  <Upload className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveConversation}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {chatDragOver && (
              <div className="text-center text-blue-600 dark:text-blue-400 text-sm mt-2 font-medium">
                <Upload className="h-5 w-5 mx-auto mb-1" />
                {t.dragDropHere} - {t.myDocuments}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reduced Footer Height */}
      <footer className="bg-gray-800 text-white py-2 px-6 border-t-4 border-blue-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="text-xs text-gray-300">{t.footerText}</p>
          </div>
          <div className="text-xs text-gray-400">
            © 2024 Softia.ca - {t.rightsReserved}
          </div>
        </div>
      </footer>

      {/* Enhanced Modal Components */}
      <UserProfileModal
        isOpen={modals.userProfile}
        onClose={() => closeModal("userProfile")}
      />
      <SecurityModal
        isOpen={modals.security}
        onClose={() => closeModal("security")}
      />
      <TermsModal isOpen={modals.terms} onClose={() => closeModal("terms")} />
      <CurrentPlanModal
        isOpen={modals.currentPlan}
        onClose={() => closeModal("currentPlan")}
      />
      <AvailablePackagesModal
        isOpen={modals.availablePackages}
        onClose={() => closeModal("availablePackages")}
      />
      <ViewBillsModal
        isOpen={modals.viewBills}
        onClose={() => closeModal("viewBills")}
      />
      <TeamsModal isOpen={modals.teams} onClose={() => closeModal("teams")} />
    </div>
  );
}
