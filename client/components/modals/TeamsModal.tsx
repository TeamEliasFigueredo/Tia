import React, { useState } from "react";
import {
  Users,
  Database,
  Shield,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Search,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TeamsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "User" | "Viewer";
  avatar?: string;
  lastActive: string;
}

interface DatabasePermission {
  databaseId: string;
  databaseName: string;
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canManage: boolean;
}

export function TeamsModal({ isOpen, onClose }: TeamsModalProps) {
  const [activeTab, setActiveTab] = useState<"members" | "permissions">(
    "members",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@softia.ca",
      role: "Admin",
      lastActive: "2024-01-22",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@softia.ca",
      role: "User",
      lastActive: "2024-01-21",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@softia.ca",
      role: "User",
      lastActive: "2024-01-20",
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah.wilson@softia.ca",
      role: "Viewer",
      lastActive: "2024-01-19",
    },
  ]);

  const [memberPermissions, setMemberPermissions] = useState<
    Record<string, DatabasePermission[]>
  >({
    "1": [
      {
        databaseId: "db1",
        databaseName: "Company Policies",
        canRead: true,
        canWrite: true,
        canDelete: true,
        canManage: true,
      },
      {
        databaseId: "db2",
        databaseName: "Technical Documentation",
        canRead: true,
        canWrite: true,
        canDelete: true,
        canManage: true,
      },
    ],
    "2": [
      {
        databaseId: "db1",
        databaseName: "Company Policies",
        canRead: true,
        canWrite: true,
        canDelete: false,
        canManage: false,
      },
      {
        databaseId: "db2",
        databaseName: "Technical Documentation",
        canRead: true,
        canWrite: true,
        canDelete: false,
        canManage: false,
      },
    ],
    "3": [
      {
        databaseId: "db1",
        databaseName: "Company Policies",
        canRead: true,
        canWrite: false,
        canDelete: false,
        canManage: false,
      },
      {
        databaseId: "db2",
        databaseName: "Technical Documentation",
        canRead: true,
        canWrite: true,
        canDelete: false,
        canManage: false,
      },
    ],
    "4": [
      {
        databaseId: "db1",
        databaseName: "Company Policies",
        canRead: true,
        canWrite: false,
        canDelete: false,
        canManage: false,
      },
      {
        databaseId: "db2",
        databaseName: "Technical Documentation",
        canRead: true,
        canWrite: false,
        canDelete: false,
        canManage: false,
      },
    ],
  });

  const handlePermissionChange = (
    memberId: string,
    databaseId: string,
    permission: keyof DatabasePermission,
    value: boolean,
  ) => {
    setMemberPermissions((prev) => ({
      ...prev,
      [memberId]: prev[memberId].map((db) =>
        db.databaseId === databaseId ? { ...db, [permission]: value } : db,
      ),
    }));
  };

  const handleSavePermissions = () => {
    console.log("Saving permissions:", memberPermissions);
    alert("Permissions saved successfully!");
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-600";
      case "User":
        return "bg-blue-600";
      case "Viewer":
        return "bg-gray-600";
      default:
        return "bg-gray-600";
    }
  };

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Team Management
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {/* Tab Navigation */}
          <div className="flex space-x-4 mb-6">
            <Button
              variant={activeTab === "members" ? "default" : "outline"}
              onClick={() => setActiveTab("members")}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Team Members
            </Button>
            <Button
              variant={activeTab === "permissions" ? "default" : "outline"}
              onClick={() => setActiveTab("permissions")}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Database Permissions
            </Button>
          </div>

          {/* Team Members Tab */}
          {activeTab === "members" && (
            <div className="space-y-4">
              {/* Search and Add */}
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search team members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </div>

              {/* Members Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="bg-blue-600 text-white text-xs">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{member.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {member.email}
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(member.role)}>
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {new Date(member.lastActive).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setSelectedMemberId(
                                  selectedMemberId === member.id
                                    ? null
                                    : member.id,
                                )
                              }
                            >
                              <Shield className="h-3 w-3 mr-1" />
                              Permissions
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Database Permissions Tab */}
          {activeTab === "permissions" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">
                  Database Access Permissions
                </h3>
                <Button
                  onClick={handleSavePermissions}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save All Changes
                </Button>
              </div>

              {/* Member Selection */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <Label className="text-sm font-medium mb-2 block">
                  Select team member to manage permissions:
                </Label>
                <div className="flex flex-wrap gap-2">
                  {teamMembers.map((member) => (
                    <Button
                      key={member.id}
                      variant={
                        selectedMemberId === member.id ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedMemberId(member.id)}
                      className="flex items-center gap-2"
                    >
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="bg-blue-600 text-white text-xs">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {member.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Permissions Table */}
              {selectedMemberId && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-blue-50 border-b p-3">
                    <h4 className="font-medium text-blue-900">
                      Database Permissions for{" "}
                      {teamMembers.find((m) => m.id === selectedMemberId)?.name}
                    </h4>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Database</TableHead>
                        <TableHead className="text-center">Read</TableHead>
                        <TableHead className="text-center">Write</TableHead>
                        <TableHead className="text-center">Delete</TableHead>
                        <TableHead className="text-center">Manage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {memberPermissions[selectedMemberId]?.map(
                        (permission) => (
                          <TableRow key={permission.databaseId}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Database className="h-4 w-4 text-blue-500" />
                                <span className="font-medium">
                                  {permission.databaseName}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Switch
                                checked={permission.canRead}
                                onCheckedChange={(value) =>
                                  handlePermissionChange(
                                    selectedMemberId,
                                    permission.databaseId,
                                    "canRead",
                                    value,
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Switch
                                checked={permission.canWrite}
                                onCheckedChange={(value) =>
                                  handlePermissionChange(
                                    selectedMemberId,
                                    permission.databaseId,
                                    "canWrite",
                                    value,
                                  )
                                }
                                disabled={!permission.canRead}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Switch
                                checked={permission.canDelete}
                                onCheckedChange={(value) =>
                                  handlePermissionChange(
                                    selectedMemberId,
                                    permission.databaseId,
                                    "canDelete",
                                    value,
                                  )
                                }
                                disabled={!permission.canWrite}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Switch
                                checked={permission.canManage}
                                onCheckedChange={(value) =>
                                  handlePermissionChange(
                                    selectedMemberId,
                                    permission.databaseId,
                                    "canManage",
                                    value,
                                  )
                                }
                                disabled={!permission.canDelete}
                              />
                            </TableCell>
                          </TableRow>
                        ),
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}

              {!selectedMemberId && (
                <div className="text-center py-8 text-gray-500">
                  Select a team member above to manage their database
                  permissions
                </div>
              )}

              {/* Permission Legend */}
              <div className="bg-gray-50 border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Permission Levels:
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <strong>Read:</strong> View documents and search content
                  </div>
                  <div>
                    <strong>Write:</strong> Upload and edit documents
                  </div>
                  <div>
                    <strong>Delete:</strong> Remove documents and databases
                  </div>
                  <div>
                    <strong>Manage:</strong> Full administrative control
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
