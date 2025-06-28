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
  UserPlus,
  Settings,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeamsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdDate: string;
  adminId: string;
  members: TeamMember[];
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "User" | "Viewer";
  avatar?: string;
  lastActive: string;
  teams: string[];
}

interface DatabasePermission {
  databaseId: string;
  databaseName: string;
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canManage: boolean;
}

interface TeamDatabasePermission {
  teamId: string;
  permissions: DatabasePermission[];
}

export function TeamsModal({ isOpen, onClose }: TeamsModalProps) {
  const [activeTab, setActiveTab] = useState<
    "teams" | "members" | "permissions"
  >("teams");

  // New member creation state
  const [newMemberForm, setNewMemberForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "member",
    teams: [] as string[],
  });
  const [showAddMember, setShowAddMember] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");

  // Mock data
  const [teams, setTeams] = useState<Team[]>([
    {
      id: "1",
      name: "Development Team",
      description: "Software development and engineering",
      memberCount: 8,
      createdDate: "2024-01-15",
      adminId: "1",
      members: ["1", "2", "3"],
    },
    {
      id: "2",
      name: "Marketing Team",
      description: "Marketing and communications",
      memberCount: 5,
      createdDate: "2024-01-18",
      adminId: "2",
      members: ["2", "4", "5"],
    },
    {
      id: "3",
      name: "Sales Team",
      description: "Sales and customer relations",
      memberCount: 6,
      createdDate: "2024-01-20",
      adminId: "3",
      members: ["3", "4", "6"],
    },
  ]);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@softia.ca",
      role: "Admin",
      lastActive: "2024-01-22",
      teams: ["1"],
      isAdmin: true,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@softia.ca",
      role: "User",
      lastActive: "2024-01-21",
      teams: ["1", "2"],
      isAdmin: false,
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@softia.ca",
      role: "User",
      lastActive: "2024-01-20",
      teams: ["1", "3"],
      isAdmin: false,
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah.wilson@softia.ca",
      role: "Viewer",
      lastActive: "2024-01-19",
      teams: ["2", "3"],
      isAdmin: false,
    },
    {
      id: "5",
      name: "Alex Chen",
      email: "alex.chen@softia.ca",
      role: "User",
      lastActive: "2024-01-18",
      teams: ["2"],
      isAdmin: false,
    },
    {
      id: "6",
      name: "Lisa Brown",
      email: "lisa.brown@softia.ca",
      role: "User",
      lastActive: "2024-01-17",
      teams: ["3"],
      isAdmin: false,
    },
  ]);

  const [teamPermissions, setTeamPermissions] = useState<
    TeamDatabasePermission[]
  >([
    {
      teamId: "1",
      permissions: [
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
          canDelete: false,
          canManage: false,
        },
      ],
    },
    {
      teamId: "2",
      permissions: [
        {
          databaseId: "db1",
          databaseName: "Company Policies",
          canRead: true,
          canWrite: false,
          canDelete: false,
          canManage: false,
        },
        {
          databaseId: "db3",
          databaseName: "Marketing Materials",
          canRead: true,
          canWrite: true,
          canDelete: true,
          canManage: true,
        },
      ],
    },
  ]);

  const [isAdmin] = useState(true); // Current user is TIA admin
  const [currentUserId] = useState("1");

  // Member management functions
  const addNewMember = () => {
    if (
      !newMemberForm.email ||
      !newMemberForm.firstName ||
      !newMemberForm.lastName
    ) {
      return;
    }

    const newMember = {
      id: Date.now().toString(),
      name: `${newMemberForm.firstName} ${newMemberForm.lastName}`,
      email: newMemberForm.email,
      role: newMemberForm.role === "admin" ? "Admin" : "User",
      lastActive: new Date().toISOString().split("T")[0],
      teams: newMemberForm.teams,
      isAdmin: newMemberForm.role === "admin",
    };

    setTeamMembers((prev) => [...prev, newMember]);
    setNewMemberForm({
      email: "",
      firstName: "",
      lastName: "",
      role: "member",
      teams: [],
    });
    setShowAddMember(false);
    setHasUnsavedChanges(true);
  };

  const toggleMemberAdmin = (memberId: string) => {
    setTeamMembers((prev) =>
      prev.map((member) =>
        member.id === memberId
          ? {
              ...member,
              isAdmin: !member.isAdmin,
              role: !member.isAdmin ? "Admin" : "User",
            }
          : member,
      ),
    );
    setHasUnsavedChanges(true);
  };

  // Enhanced permission management
  const updateTeamPermissions = (
    teamId: string,
    databaseId: string,
    permission: keyof Omit<DatabasePermission, "databaseId" | "databaseName">,
    value: boolean,
  ) => {
    setTeamPermissions((prev) =>
      prev.map((tp) =>
        tp.teamId === teamId
          ? {
              ...tp,
              permissions: tp.permissions.map((perm) =>
                perm.databaseId === databaseId
                  ? {
                      ...perm,
                      [permission]: value,
                      // Auto-activate all permissions when Manage is enabled
                      ...(permission === "canManage" && value
                        ? {
                            canRead: true,
                            canWrite: true,
                            canDelete: true,
                          }
                        : {}),
                      // Auto-activate Manage when all other permissions are enabled
                      ...(permission !== "canManage"
                        ? {
                            canManage:
                              value &&
                              (permission === "canRead"
                                ? true
                                : perm.canRead) &&
                              (permission === "canWrite"
                                ? true
                                : perm.canWrite) &&
                              (permission === "canDelete"
                                ? true
                                : perm.canDelete),
                          }
                        : {}),
                      // Auto-deactivate Manage when any permission is disabled
                      ...(permission !== "canManage" && !value
                        ? {
                            canManage: false,
                          }
                        : {}),
                    }
                  : perm,
              ),
            }
          : tp,
      ),
    );
    setHasUnsavedChanges(true);
  };

  const saveAllChanges = () => {
    // Here you would typically make API calls to save changes
    console.log("Saving all changes...", {
      teams,
      teamMembers,
      teamPermissions,
    });
    setHasUnsavedChanges(false);
    alert("All changes saved successfully!");
  };

  // Team management functions
  const createTeam = () => {
    if (!newTeamName.trim()) return;

    const newTeam: Team = {
      id: Date.now().toString(),
      name: newTeamName,
      description: newTeamDescription,
      memberCount: 1,
      createdDate: new Date().toISOString().split("T")[0],
      adminId: currentUserId,
      members: [currentUserId],
    };

    setTeams((prev) => [...prev, newTeam]);
    setNewTeamName("");
    setNewTeamDescription("");
  };

  const deleteTeam = (teamId: string) => {
    if (confirm("Are you sure you want to delete this team?")) {
      setTeams((prev) => prev.filter((team) => team.id !== teamId));
      setTeamPermissions((prev) => prev.filter((tp) => tp.teamId !== teamId));
    }
  };

  const updateTeam = (teamId: string, updates: Partial<Team>) => {
    setTeams((prev) =>
      prev.map((team) => (team.id === teamId ? { ...team, ...updates } : team)),
    );
    setEditingTeamId(null);
  };

  const canManageTeam = (team: Team) => {
    return isAdmin || team.adminId === currentUserId;
  };

  const handlePermissionChange = (
    teamId: string,
    databaseId: string,
    permission: keyof DatabasePermission,
    value: boolean,
  ) => {
    setTeamPermissions((prev) =>
      prev.map((tp) =>
        tp.teamId === teamId
          ? {
              ...tp,
              permissions: tp.permissions.map((db) =>
                db.databaseId === databaseId
                  ? { ...db, [permission]: value }
                  : db,
              ),
            }
          : tp,
      ),
    );
  };

  const addMemberToTeam = (teamId: string, memberId: string) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? {
              ...team,
              members: [...team.members, memberId],
              memberCount: team.memberCount + 1,
            }
          : team,
      ),
    );
  };

  const removeMemberFromTeam = (teamId: string, memberId: string) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? {
              ...team,
              members: team.members.filter((id) => id !== memberId),
              memberCount: team.memberCount - 1,
            }
          : team,
      ),
    );
  };

  const getTeamMembers = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return [];
    return teamMembers.filter((member) => team.members.includes(member.id));
  };

  const getAvailableMembers = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return [];
    return teamMembers.filter((member) => !team.members.includes(member.id));
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

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedTeam = teams.find((t) => t.id === selectedTeamId);
  const selectedTeamPermissions = teamPermissions.find(
    (tp) => tp.teamId === selectedTeamId,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
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
              variant={activeTab === "teams" ? "default" : "outline"}
              onClick={() => setActiveTab("teams")}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Teams
            </Button>
            <Button
              variant={activeTab === "members" ? "default" : "outline"}
              onClick={() => setActiveTab("members")}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
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

          {/* Teams Tab */}
          {activeTab === "teams" && (
            <div className="space-y-4">
              {/* Search and Create Team */}
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search teams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Team name"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      className="w-40"
                    />
                    <Input
                      placeholder="Description"
                      value={newTeamDescription}
                      onChange={(e) => setNewTeamDescription(e.target.value)}
                      className="w-48"
                    />
                    <Button onClick={createTeam} className="bg-blue-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Team
                    </Button>
                  </div>
                )}
              </div>

              {/* Teams Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTeams.map((team) => (
                  <div
                    key={team.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      {editingTeamId === team.id ? (
                        <Input
                          value={team.name}
                          onChange={(e) =>
                            updateTeam(team.id, { name: e.target.value })
                          }
                          onBlur={() => setEditingTeamId(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") setEditingTeamId(null);
                          }}
                          autoFocus
                          className="text-lg font-semibold"
                        />
                      ) : (
                        <h3 className="text-lg font-semibold text-gray-900">
                          {team.name}
                        </h3>
                      )}

                      {canManageTeam(team) && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingTeamId(team.id)}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTeam(team.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {team.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {team.memberCount} members
                      </div>
                      <div className="text-xs text-gray-400">
                        Created: {team.createdDate}
                      </div>
                    </div>

                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setSelectedTeamId(team.id);
                          setActiveTab("members");
                        }}
                      >
                        <Settings className="mr-2 h-3 w-3" />
                        Manage Team
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Members Tab */}
          {activeTab === "members" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-lg font-semibold">
                    Select Team to Manage:
                  </Label>
                  <Select
                    value={selectedTeamId || ""}
                    onValueChange={setSelectedTeamId}
                  >
                    <SelectTrigger className="w-64 mt-2">
                      <SelectValue placeholder="Choose a team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedTeam && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Current Team Members */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Team Members ({selectedTeam.memberCount})
                    </h3>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Member</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getTeamMembers(selectedTeamId!).map((member) => (
                            <TableRow key={member.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                                      {member.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-sm">
                                      {member.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {member.email}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={getRoleBadgeColor(member.role)}
                                >
                                  {member.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {canManageTeam(selectedTeam) &&
                                  member.id !== selectedTeam.adminId && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        removeMemberFromTeam(
                                          selectedTeamId!,
                                          member.id,
                                        )
                                      }
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Available Members to Add */}
                  {canManageTeam(selectedTeam) && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Add Members
                      </h3>
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Available Members</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {getAvailableMembers(selectedTeamId!).map(
                              (member) => (
                                <TableRow key={member.id}>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-6 w-6">
                                        <AvatarFallback className="bg-gray-600 text-white text-xs">
                                          {member.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="font-medium text-sm">
                                          {member.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {member.email}
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      className={getRoleBadgeColor(member.role)}
                                    >
                                      {member.role}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        addMemberToTeam(
                                          selectedTeamId!,
                                          member.id,
                                        )
                                      }
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ),
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Database Permissions Tab */}
          {activeTab === "permissions" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  Team Database Access Permissions
                </h3>
                <Button
                  onClick={() => console.log("Save permissions")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save All Changes
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {teams.map((team) => {
                  const teamPerms = teamPermissions.find(
                    (tp) => tp.teamId === team.id,
                  );
                  if (!teamPerms) return null;

                  return (
                    <div key={team.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        {team.name}
                        <Badge variant="outline">
                          {team.memberCount} members
                        </Badge>
                      </h4>

                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Database</TableHead>
                              <TableHead className="text-center">
                                Read
                              </TableHead>
                              <TableHead className="text-center">
                                Write
                              </TableHead>
                              <TableHead className="text-center">
                                Delete
                              </TableHead>
                              <TableHead className="text-center">
                                Manage
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {teamPerms.permissions.map((permission) => (
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
                                        team.id,
                                        permission.databaseId,
                                        "canRead",
                                        value,
                                      )
                                    }
                                    disabled={!canManageTeam(team)}
                                  />
                                </TableCell>
                                <TableCell className="text-center">
                                  <Switch
                                    checked={permission.canWrite}
                                    onCheckedChange={(value) =>
                                      handlePermissionChange(
                                        team.id,
                                        permission.databaseId,
                                        "canWrite",
                                        value,
                                      )
                                    }
                                    disabled={
                                      !permission.canRead ||
                                      !canManageTeam(team)
                                    }
                                  />
                                </TableCell>
                                <TableCell className="text-center">
                                  <Switch
                                    checked={permission.canDelete}
                                    onCheckedChange={(value) =>
                                      handlePermissionChange(
                                        team.id,
                                        permission.databaseId,
                                        "canDelete",
                                        value,
                                      )
                                    }
                                    disabled={
                                      !permission.canWrite ||
                                      !canManageTeam(team)
                                    }
                                  />
                                </TableCell>
                                <TableCell className="text-center">
                                  <Switch
                                    checked={permission.canManage}
                                    onCheckedChange={(value) =>
                                      handlePermissionChange(
                                        team.id,
                                        permission.databaseId,
                                        "canManage",
                                        value,
                                      )
                                    }
                                    disabled={
                                      !permission.canDelete ||
                                      !canManageTeam(team)
                                    }
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <div className="mt-3 text-sm text-gray-600">
                        <strong>Note:</strong> These permissions apply to all
                        members of the {team.name} team. Changes affect{" "}
                        {team.memberCount} users.
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Permission Hierarchy:
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-blue-800">
                  <div>
                    <strong>Read:</strong> View and search documents
                  </div>
                  <div>
                    <strong>Write:</strong> Upload and edit documents
                  </div>
                  <div>
                    <strong>Delete:</strong> Remove documents
                  </div>
                  <div>
                    <strong>Manage:</strong> Full database control
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

export default TeamsModal;
