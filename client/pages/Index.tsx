import React, { useState, useRef, useEffect } from "react";
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
import { cn } from "@/lib/utils";

// Import modals
import { TestModal } from "@/components/modals/TestModal";
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
  const [fontSize, setFontSize] = useState("medium");
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light");

  // Modal states
  const [modals, setModals] = useState({
    test: false,
    userProfile: false,
    security: false,
    terms: false,
    currentPlan: false,
    availablePackages: false,
    viewBills: false,
    teams: false,
  });

  // User state (for admin check)
  const [isAdmin] = useState(true); // Set to true for demo purposes

  // Data state
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
          content: "This is the employee handbook content...",
        },
        {
          id: "doc2",
          name: "Security Guidelines",
          type: "PDF",
          size: "1.8 MB",
          pages: 32,
          createdDate: "2024-01-12",
          addedDate: "2024-01-16",
          content: "Security guidelines and protocols...",
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
          content: "Complete API documentation...",
        },
      ],
    },
  ]);

  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );
  const [currentDocumentPage, setCurrentDocumentPage] = useState(1);
  const [documentZoom, setDocumentZoom] = useState(100);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello! I'm Tia, your AI assistant. How can I help you today? I can search through your company documents and provide relevant information.",
      timestamp: "2024-01-22T10:00:00",
      documentReferences: [],
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [savedChats, setSavedChats] = useState<SavedChat[]>([
    {
      id: "1",
      name: "Chat Session 1",
      messages: chatMessages,
      createdDate: "2024-01-22",
    },
  ]);
  const [currentChatId, setCurrentChatId] = useState("1");
  const [chatSearchQuery, setChatSearchQuery] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: currentMessage,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: `I understand you're asking about "${currentMessage}". Based on the documents in your database, here's what I found. [doc1] [doc2]`,
        timestamp: new Date().toISOString(),
        documentReferences: ["doc1", "doc2"],
      };
      setChatMessages((prev) => [...prev, botMessage]);
    }, 1500);

    setCurrentMessage("");
  };

  const handleDocumentReference = (docId: string) => {
    // Find document in databases
    for (const database of databases) {
      const doc = database.documents.find((d) => d.id === docId);
      if (doc) {
        setSelectedDocument(doc);
        setShowColumn2(true);
        // Highlight document in Column 1
        setSelectedDatabase(database.id);
        setShowColumn1(true);
        break;
      }
    }
  };

  const handleSaveConversation = () => {
    const newChat: SavedChat = {
      id: Date.now().toString(),
      name: `Chat Session ${savedChats.length + 1}`,
      messages: chatMessages,
      createdDate: new Date().toISOString().split("T")[0],
    };
    setSavedChats((prev) => [...prev, newChat]);
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

  // Modal helper functions
  const openModal = (modalName: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
  };

  const toggleDatabase = (databaseId: string) => {
    setSelectedDatabase(selectedDatabase === databaseId ? null : databaseId);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
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
        {/* Column 1 - Database Management */}
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
                <Button className="w-full mt-2" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  New Database
                </Button>
              </div>

              {/* Database List */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                  {databases.map((database) => (
                    <div
                      key={database.id}
                      className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleDatabase(database.id)}
                      >
                        <div className="flex items-center space-x-2">
                          <Database className="h-4 w-4 text-blue-500" />
                          <span className="font-medium text-sm">
                            {database.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {database.documentCount} documents • {database.size}
                      </div>

                      {/* Documents List */}
                      {selectedDatabase === database.id && (
                        <div className="mt-3 ml-4 space-y-2 border-l-2 border-blue-100 pl-3">
                          {database.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className={cn(
                                "p-2 rounded border cursor-pointer hover:bg-blue-50 transition-colors",
                                selectedDocument?.id === doc.id &&
                                  "bg-blue-100 border-blue-300",
                              )}
                              onClick={() => {
                                setSelectedDocument(doc);
                                setShowColumn2(true);
                              }}
                            >
                              <div className="flex items-center space-x-2">
                                <FileText className="h-3 w-3 text-gray-500" />
                                <span className="text-xs font-medium">
                                  {doc.name}
                                </span>
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {doc.type} • {doc.pages} pages • {doc.size}
                              </div>
                              <div className="flex space-x-1 mt-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-1"
                                >
                                  <Edit3 className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-1"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Add Document
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Column 2 - Document Viewer */}
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
              </div>

              {/* Document Controls */}
              {selectedDocument && (
                <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <ZoomOut className="h-3 w-3" />
                    </Button>
                    <span className="text-xs">{documentZoom}%</span>
                    <Button variant="outline" size="sm">
                      <ZoomIn className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentDocumentPage <= 1}
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </Button>
                    <Input
                      className="w-12 h-7 text-xs text-center"
                      value={currentDocumentPage}
                      onChange={(e) =>
                        setCurrentDocumentPage(Number(e.target.value))
                      }
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={
                        currentDocumentPage >= (selectedDocument?.pages || 1)
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
                    <div className="prose prose-sm max-w-none">
                      <div className="bg-gray-100 p-4 rounded border-2 border-dashed border-gray-300 min-h-96">
                        <p className="text-gray-600">
                          {selectedDocument.content}
                        </p>
                        <div className="mt-8 text-center text-gray-400">
                          [Document content would be displayed here]
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

        {/* Column 3 - Chat Interface */}
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
                {/* Chat Search */}
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search chat..."
                    className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/70 w-48"
                    value={chatSearchQuery}
                    onChange={(e) => setChatSearchQuery(e.target.value)}
                  />
                </div>

                {/* Saved Chats */}
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
                    {savedChats.map((chat) => (
                      <DropdownMenuItem
                        key={chat.id}
                        onClick={() => setCurrentChatId(chat.id)}
                      >
                        {chat.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSaveConversation}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Current
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Settings */}
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
                  <DropdownMenuContent align="end" className="z-50">
                    <DropdownMenuLabel>Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Globe className="mr-2 h-4 w-4" />
                      Change Language
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Type className="mr-2 h-4 w-4" />
                      Adjust Font Size
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Palette className="mr-2 h-4 w-4" />
                      Customize Appearance
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Shield className="mr-2 h-4 w-4" />
                      Privacy Settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {chatMessages.map((message) => (
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
                      "max-w-lg rounded-lg p-4 shadow-md",
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
                                className="text-blue-600 underline hover:text-blue-800 font-medium mx-1"
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
                      {message.type === "user" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 text-white/70 hover:text-white hover:bg-white/20"
                          onClick={() =>
                            setChatMessages((prev) =>
                              prev.filter((m) => m.id !== message.id),
                            )
                          }
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
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

          {/* Chat Input */}
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

      {/* Footer */}
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
      <TestModal isOpen={modals.test} onClose={() => closeModal("test")} />
      <UserProfileModal
        isOpen={modals.userProfile}
        onClose={() => closeModal("userProfile")}
      />
      <SecurityModal
        isOpen={modals.security}
        onClose={() => closeModal("security")}
      />
      <TermsModal isOpen={modals.terms} onClose={() => closeModal("terms")} />
    </div>
  );
}
