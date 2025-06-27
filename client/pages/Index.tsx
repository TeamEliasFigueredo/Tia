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
import { cn } from "@/lib/utils";

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
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light");

  // Modal states - Fixed to prevent menu issues
  const [modals, setModals] = useState({
    userProfile: false,
    security: false,
    terms: false,
    currentPlan: false,
    availablePackages: false,
    viewBills: false,
    teams: false,
  });

  // User state (for admin check)
  const [isAdmin] = useState(true);

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
          name: "Employee Handbook",
          type: "PDF",
          size: "2.1 MB",
          pages: 45,
          createdDate: "2024-01-10",
          addedDate: "2024-01-15",
          content:
            "This comprehensive employee handbook outlines company policies, procedures, and guidelines for all staff members. It covers workplace conduct, benefits, time-off policies, and professional development opportunities. Section 1: Introduction to Company Culture. Our company values integrity, innovation, and collaboration. We believe in creating an inclusive environment where every employee can thrive. Section 2: Code of Conduct. All employees are expected to maintain professional behavior at all times. This includes respectful communication, punctuality, and adherence to company policies.",
        },
        {
          id: "doc2",
          name: "Security Guidelines",
          type: "PDF",
          size: "1.8 MB",
          pages: 32,
          createdDate: "2024-01-12",
          addedDate: "2024-01-16",
          content:
            "Security guidelines and protocols for maintaining information security and data protection within the organization. This document covers password policies, data handling procedures, and incident response protocols. Password Requirements: Minimum 12 characters, mix of uppercase, lowercase, numbers, and special characters. Two-factor authentication is mandatory for all accounts.",
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
          name: "API Documentation",
          type: "PDF",
          size: "3.2 MB",
          pages: 78,
          createdDate: "2024-01-08",
          addedDate: "2024-01-11",
          content:
            "Complete API documentation including endpoints, authentication methods, request/response formats, and integration examples for developers. REST API Endpoints: GET /api/users - Retrieve user list. POST /api/users - Create new user. PUT /api/users/{id} - Update user. DELETE /api/users/{id} - Delete user. Authentication: Bearer token required in Authorization header.",
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
  const [newDocumentName, setNewDocumentName] = useState("");

  // Drag and drop states
  const [draggedDocument, setDraggedDocument] = useState<{
    docId: string;
    fromDbId: string;
  } | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

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

  // Fixed modal helper functions to prevent menu issues
  const openModal = useCallback((modalName: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [modalName]: true }));
  }, []);

  const closeModal = useCallback((modalName: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
    // Force a small delay to ensure proper cleanup
    setTimeout(() => {
      // This ensures dropdown menus remain functional after modal closure
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
    if (confirm("Are you sure you want to delete this database?")) {
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
    if (confirm("Are you sure you want to delete this document?")) {
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

  // File upload functions
  const handleFileUpload = (files: FileList | null, targetDbId: string) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      const newDoc: Document = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type.includes("pdf") ? "PDF" : "Document",
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        pages: Math.floor(Math.random() * 50) + 1,
        createdDate: new Date().toISOString().split("T")[0],
        addedDate: new Date().toISOString().split("T")[0],
        content: `Content of ${file.name}. This is a placeholder for the actual document content that would be extracted from the uploaded file.`,
      };

      setDatabases((prev) =>
        prev.map((db) =>
          db.id === targetDbId
            ? {
                ...db,
                documents: [...db.documents, newDoc],
                documentCount: db.documentCount + 1,
                size: `${parseFloat(db.size) + parseFloat(newDoc.size)}MB`,
                lastModified: new Date().toISOString().split("T")[0],
              }
            : db,
        ),
      );
    });
  };

  // Chat file upload with auto-create "My Documents" database
  const handleChatFileUpload = (files: FileList | null) => {
    if (!files) return;

    let myDocsDb = databases.find((db) => db.name === "My Documents");

    if (!myDocsDb) {
      const newMyDocsDb: Database = {
        id: "my-docs-" + Date.now(),
        name: "My Documents",
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

  // Drag and drop functions
  const handleDragStart = (docId: string, fromDbId: string) => {
    setDraggedDocument({ docId, fromDbId });
  };

  const handleDragOver = (e: React.DragEvent, dbId: string) => {
    e.preventDefault();
    setDragOver(dbId);
  };

  const handleDrop = (e: React.DragEvent, toDbId: string) => {
    e.preventDefault();
    setDragOver(null);

    if (!draggedDocument || draggedDocument.fromDbId === toDbId) return;

    const { docId, fromDbId } = draggedDocument;

    // Find the document to move
    const sourceDb = databases.find((db) => db.id === fromDbId);
    const docToMove = sourceDb?.documents.find((doc) => doc.id === docId);

    if (!docToMove) return;

    // Move document between databases
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

    // Update current chat
    setSavedChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId ? { ...chat, messages: newMessages } : chat,
      ),
    );

    // Simulate bot response
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: `I understand you're asking about "${currentMessage}". Based on the documents in your database, here's what I found. You can find more details in the Employee Handbook [doc1] and Security Guidelines [doc2].`,
        timestamp: new Date().toISOString(),
        documentReferences: ["doc1", "doc2"],
      };

      const updatedMessages = [...newMessages, botMessage];
      setChatMessages(updatedMessages);

      // Update current chat with bot response
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
      prompt("Enter a name for this chat session:") ||
      `Chat ${savedChats.length + 1}`;

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

    // Update current saved chat
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

  return (
    <div
      className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50"
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Header */}
      <header className="bg-white shadow-lg border-b-2 border-blue-100 px-6 py-4 flex items-center justify-between relative z-50">
        <div className="flex items-center space-x-6">
          {/* Company Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-lg font-semibold text-gray-800">Softia</span>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {isAdmin && (
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-blue-600 flex items-center gap-2"
                onClick={() => openModal("teams")}
              >
                <Users className="h-4 w-4" />
                Teams
              </Button>
            )}

            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Your Plan
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="z-50">
                  <DropdownMenuLabel>Plan Management</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => openModal("currentPlan")}>
                    <Package className="mr-2 h-4 w-4" />
                    Current Plan
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openModal("availablePackages")}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Available Packages
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openModal("viewBills")}>
                    <Receipt className="mr-2 h-4 w-4" />
                    View Bills
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">John Doe</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer ring-2 ring-blue-200 hover:ring-blue-400 transition-all">
                <AvatarImage src="" />
                <AvatarFallback className="bg-blue-600 text-white font-semibold">
                  JD
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openModal("userProfile")}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openModal("security")}>
                <Shield className="mr-2 h-4 w-4" />
                Security
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openModal("terms")}>
                <FileCheck className="mr-2 h-4 w-4" />
                Terms of Use
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Column 1 - Enhanced Database Management */}
        <div
          className={cn(
            "bg-white border-r-2 border-blue-100 transition-all duration-300 shadow-lg",
            showColumn1 ? "w-80" : "w-0 overflow-hidden",
          )}
        >
          {showColumn1 && (
            <div className="h-full flex flex-col">
              {/* Column 1 Header */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800 flex items-center">
                    <Database className="mr-2 h-5 w-5 text-blue-600" />
                    Databases
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
                    placeholder="Database name"
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
                          "border-blue-400 bg-blue-50",
                      )}
                      onDragOver={(e) => handleDragOver(e, database.id)}
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
                        {database.documentCount} documents • {database.size}
                      </div>

                      {/* Documents List */}
                      {selectedDatabase === database.id && (
                        <div className="mt-3 space-y-1">
                          {database.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className={cn(
                                "p-2 rounded border cursor-pointer hover:bg-blue-50 transition-colors text-xs",
                                selectedDocument?.id === doc.id &&
                                  "bg-blue-100 border-blue-300",
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
                                  <FileText className="h-3 w-3 text-gray-500" />
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
                                {doc.type} • {doc.pages} pages • {doc.size}
                              </div>
                            </div>
                          ))}

                          {/* Add Document Section */}
                          <div className="border-2 border-dashed border-gray-300 rounded p-3 hover:border-blue-400 transition-colors">
                            <input
                              ref={fileInputRef}
                              type="file"
                              multiple
                              className="hidden"
                              onChange={(e) =>
                                handleFileUpload(e.target.files, database.id)
                              }
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Plus className="mr-1 h-3 w-3" />
                              Add Document
                            </Button>
                            <p className="text-xs text-gray-500 mt-1 text-center">
                              Or drag & drop files here
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

        {/* Column 2 - Enhanced Document Viewer */}
        <div
          className={cn(
            "bg-white border-r-2 border-blue-100 transition-all duration-300 shadow-lg",
            showColumn2 ? "w-96" : "w-0 overflow-hidden",
          )}
        >
          {showColumn2 && (
            <div className="h-full flex flex-col">
              {/* Column 2 Header */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800 flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-blue-600" />
                    Document Viewer
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
                    <div className="text-sm font-medium">
                      {selectedDocument.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Page {currentDocumentPage} of {selectedDocument.pages}
                    </div>
                  </div>
                )}

                {/* Document Search */}
                <div className="mt-2 flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                    <Input
                      placeholder="Search in document..."
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
                <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
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

              {/* Document Content */}
              <ScrollArea className="flex-1">
                <div className="p-4">
                  {selectedDocument ? (
                    <div
                      className="prose prose-sm max-w-none"
                      style={{
                        transform: `scale(${documentZoom / 100})`,
                        transformOrigin: "top left",
                      }}
                    >
                      <div className="bg-white p-6 rounded border shadow-sm min-h-96">
                        <div className="text-gray-800 leading-relaxed">
                          {renderHighlightedText(
                            selectedDocument.content,
                            documentSearchQuery,
                          )}
                        </div>
                        <div className="mt-8 text-center text-gray-400 text-sm">
                          Page {currentDocumentPage} of {selectedDocument.pages}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      Select a document to view its content
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Column 3 - Enhanced Chat Interface */}
        <div
          className="flex-1 flex flex-col bg-white shadow-lg"
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
                <h2 className="font-semibold">Chat with Tia</h2>
              </div>

              <div className="flex items-center space-x-2">
                {/* Enhanced Chat Search */}
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search chat..."
                    className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/70 w-48"
                    value={chatSearchQuery}
                    onChange={(e) => setChatSearchQuery(e.target.value)}
                  />
                </div>

                {/* Enhanced Saved Chats */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      Saved Chats
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
                      Save Current
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Enhanced Settings */}
                <DropdownMenu>
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
                    <DropdownMenuLabel>Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Language Selection */}
                    <div className="p-2">
                      <Label className="text-sm font-medium">Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
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
                        Font Size: {fontSize}px
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
                      <Label className="text-sm font-medium">Appearance</Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="auto">Auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <DropdownMenuSeparator />

                    {/* Privacy Settings */}
                    <div className="p-2 space-y-3">
                      <Label className="text-sm font-medium">
                        Privacy Settings
                      </Label>

                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Share usage data</Label>
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
                        <Label className="text-xs">Save chat history</Label>
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
                        <Label className="text-xs">Allow analytics</Label>
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

          {/* Enhanced Chat Messages */}
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start space-x-3",
                    message.type === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {message.type === "bot" && (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">Tia</span>
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-lg rounded-lg p-4 shadow-md relative",
                      message.type === "user"
                        ? "bg-blue-600 text-white ml-12"
                        : "bg-gray-100 text-gray-800",
                    )}
                  >
                    <div className="mb-2">
                      {message.content
                        .split(/(\[doc\d+\])/)
                        .map((part, index) => {
                          if (part.match(/\[doc\d+\]/)) {
                            const docId = part.slice(1, -1);
                            return (
                              <button
                                key={index}
                                onClick={() => handleDocumentReference(docId)}
                                className="text-blue-600 underline hover:text-blue-800 font-medium mx-1 bg-blue-100 px-1 py-0.5 rounded"
                              >
                                {part}
                              </button>
                            );
                          }
                          return part;
                        })}
                    </div>

                    <div className="flex items-center justify-between text-xs opacity-70">
                      <span>{formatTimestamp(message.timestamp)}</span>
                      <div className="flex gap-1">
                        {message.type === "user" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 text-white/70 hover:text-white hover:bg-white/20"
                            onClick={() => deleteChatMessage(message.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                        {message.type === "bot" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                            onClick={() => deleteChatMessage(message.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {message.type === "user" && (
                    <Avatar className="flex-shrink-0">
                      <AvatarFallback className="bg-blue-600 text-white text-xs">
                        JD
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          {/* Enhanced Chat Input */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex space-x-3">
              <Textarea
                placeholder="Ask Tia a question..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1 min-h-[60px] resize-none"
              />
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={handleSendMessage}
                  className="bg-blue-600 hover:bg-blue-700"
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
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => chatFileInputRef.current?.click()}
                  title="Upload documents to My Documents"
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
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-gray-800 text-white py-4 px-6 border-t-4 border-blue-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Tia Brand in Footer */}
            <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg shadow-lg">
              <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
                <span className="font-bold text-xs">Tia</span>
              </div>
              <div>
                <div className="font-semibold text-sm">Tia</div>
                <div className="text-xs opacity-90">v2.1.0</div>
              </div>
            </div>
            <p className="text-sm text-gray-300">
              Tia es una creación de Softia.ca
            </p>
          </div>
          <div className="text-xs text-gray-400">
            © 2024 Softia.ca - All rights reserved
          </div>
        </div>
      </footer>

      {/* Modal Components */}
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
