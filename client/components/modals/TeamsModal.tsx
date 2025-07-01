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
import { Translations } from "@/lib/i18n";

interface TeamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: Translations;
}

interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdDate: string;
  adminId: string;
  members: string[];
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "User" | "Viewer";
  avatar?: string;
  lastActive: string;
  teams: string[];
  isAdmin: boolean;
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

export function TeamsModal({ isOpen, onClose, t }: TeamsModalProps) {
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
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [editMemberForm, setEditMemberForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "member",
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Team and member state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);

  const [teams, setTeams] = useState<Team[]>([
    {
      id: "1",
      name: "Development Team",
      description: "Software development and engineering team",
      memberCount: 4,
      createdDate: "2024-01-15",
      adminId: "1",
      members: ["1", "2", "3"],
    },
    {
      id: "2",
      name: "Marketing Team",
      description: "Marketing and content creation team",
      memberCount: 3,
      createdDate: "2024-01-18",
      adminId: "2",
      members: ["2", "4", "5"],
    },
    {
      id: "3",
      name: "Sales Team",
      description: "Sales and business development team",
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
        {
          databaseId: "db3",
          databaseName: "Marketing Materials",
          canRead: true,
          canWrite: false,
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
          databaseId: "db2",
          databaseName: "Technical Documentation",
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
    {
      teamId: "3",
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
          databaseId: "db2",
          databaseName: "Technical Documentation",
          canRead: false,
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

    const newMember: TeamMember = {
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

  const startEditMember = (member: TeamMember) => {
    const [firstName, lastName] = member.name.split(" ");
    setEditMemberForm({
      firstName: firstName || "",
      lastName: lastName || "",
      email: member.email,
      role: member.isAdmin ? "admin" : "member",
    });
    setEditingMember(member.id);
  };

  const saveEditMember = () => {
    if (
      !editingMember ||
      !editMemberForm.firstName ||
      !editMemberForm.lastName ||
      !editMemberForm.email
    ) {
      return;
    }

    setTeamMembers((prev) =>
      prev.map((member) =>
        member.id === editingMember
          ? {
              ...member,
              name: `${editMemberForm.firstName} ${editMemberForm.lastName}`,
              email: editMemberForm.email,
              isAdmin: editMemberForm.role === "admin",
              role: editMemberForm.role === "admin" ? "Admin" : "User",
            }
          : member,
      ),
    );
    setEditingMember(null);
    setHasUnsavedChanges(true);
  };

  const cancelEditMember = () => {
    setEditingMember(null);
    setEditMemberForm({
      firstName: "",
      lastName: "",
      email: "",
      role: "member",
    });
  };

  const addMemberToTeam = (memberId: string, teamId: string) => {
    setTeamMembers((prev) =>
      prev.map((member) =>
        member.id === memberId
          ? { ...member, teams: [...member.teams, teamId] }
          : member,
      ),
    );
    setHasUnsavedChanges(true);
  };

  const removeMemberFromTeam = (memberId: string, teamId: string) => {
    setTeamMembers((prev) =>
      prev.map((member) =>
        member.id === memberId
          ? { ...member, teams: member.teams.filter((t) => t !== teamId) }
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
    setHasUnsavedChanges(true);
  };

  const deleteTeam = (teamId: string) => {
    if (confirm("Are you sure you want to delete this team?")) {
      setTeams((prev) => prev.filter((team) => team.id !== teamId));
      setTeamPermissions((prev) => prev.filter((tp) => tp.teamId !== teamId));
      setHasUnsavedChanges(true);
    }
  };

  const updateTeam = (teamId: string, updates: Partial<Team>) => {
    setTeams((prev) =>
      prev.map((team) => (team.id === teamId ? { ...team, ...updates } : team)),
    );
    setEditingTeamId(null);
    setHasUnsavedChanges(true);
  };

  const canManageTeam = (team: Team) => {
    return isAdmin || team.adminId === currentUserId;
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            {t.teamManagement}
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
              {t.teamsTab}
            </Button>
            <Button
              variant={activeTab === "members" ? "default" : "outline"}
              onClick={() => setActiveTab("members")}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              {t.teamMembers}
            </Button>
            <Button
              variant={activeTab === "permissions" ? "default" : "outline"}
              onClick={() => setActiveTab("permissions")}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              {t.databasePermissions}
            </Button>
          </div>

          {/* Teams Tab */}
          {activeTab === "teams" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={t.searchTeams}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Create New Team Form */}
              <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                <h3 className="font-semibold mb-4">{t.createNewTeam}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="teamName">{t.teamName}</Label>
                    <Input
                      id="teamName"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      placeholder={t.teamName}
                    />
                  </div>
                  <div>
                    <Label htmlFor="teamDescription">{t.teamDescription}</Label>
                    <Input
                      id="teamDescription"
                      value={newTeamDescription}
                      onChange={(e) => setNewTeamDescription(e.target.value)}
                      placeholder={t.teamDescription}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={createTeam} disabled={!newTeamName.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t.createTeam}
                  </Button>
                </div>
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
                        <div className="flex-1 mr-2">
                          <Input
                            value={team.name}
                            onChange={(e) =>
                              updateTeam(team.id, { name: e.target.value })
                            }
                            onBlur={() => setEditingTeamId(null)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") setEditingTeamId(null);
                              if (e.key === "Escape") setEditingTeamId(null);
                            }}
                            autoFocus
                            className="text-lg font-semibold"
                          />
                        </div>
                      ) : (
                        <h3 className="font-semibold text-lg">{team.name}</h3>
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
                        {team.memberCount} {t.members}
                      </div>
                      <div className="text-xs text-gray-400">
                        {t.created}: {team.createdDate}
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
                        {t.manageTeam}
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
                    {t.teamMembersManagement}
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {t.configurePermissions}
                  </p>
                </div>
                <Button
                  onClick={() => setShowAddMember(true)}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  {t.addNewMember}
                </Button>
              </div>

              {/* Add Member Form */}
              {showAddMember && (
                <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add New Team Member
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={newMemberForm.firstName}
                        onChange={(e) =>
                          setNewMemberForm((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={newMemberForm.lastName}
                        onChange={(e) =>
                          setNewMemberForm((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        placeholder="Enter last name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newMemberForm.email}
                        onChange={(e) =>
                          setNewMemberForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newMemberForm.role}
                        onValueChange={(value) =>
                          setNewMemberForm((prev) => ({
                            ...prev,
                            role: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="admin">
                            Team Administrator
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={addNewMember}
                      disabled={
                        !newMemberForm.email ||
                        !newMemberForm.firstName ||
                        !newMemberForm.lastName
                      }
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddMember(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Member Edit Form */}
              {editingMember && (
                <div className="border rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    Edit Team Member
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="editFirstName">First Name</Label>
                      <Input
                        id="editFirstName"
                        value={editMemberForm.firstName}
                        onChange={(e) =>
                          setEditMemberForm((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editLastName">Last Name</Label>
                      <Input
                        id="editLastName"
                        value={editMemberForm.lastName}
                        onChange={(e) =>
                          setEditMemberForm((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        placeholder="Enter last name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editEmail">Email Address</Label>
                      <Input
                        id="editEmail"
                        type="email"
                        value={editMemberForm.email}
                        onChange={(e) =>
                          setEditMemberForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editRole">Role</Label>
                      <Select
                        value={editMemberForm.role}
                        onValueChange={(value) =>
                          setEditMemberForm((prev) => ({
                            ...prev,
                            role: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="admin">
                            Team Administrator
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={saveEditMember}
                      disabled={
                        !editMemberForm.email ||
                        !editMemberForm.firstName ||
                        !editMemberForm.lastName
                      }
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={cancelEditMember}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Members List */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Teams</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Admin Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-blue-600 text-white text-xs">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-gray-500">
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getRoleBadgeColor(member.role)} text-white`}
                          >
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {member.teams.slice(0, 2).map((teamId) => {
                              const team = teams.find((t) => t.id === teamId);
                              return team ? (
                                <Badge
                                  key={teamId}
                                  variant="outline"
                                  className="text-xs cursor-pointer hover:bg-red-100 dark:hover:bg-red-900"
                                  onClick={() => {
                                    if (
                                      confirm(
                                        `Remove ${member.name} from ${team.name}?`,
                                      )
                                    ) {
                                      removeMemberFromTeam(member.id, teamId);
                                    }
                                  }}
                                  title="Click to remove from team"
                                >
                                  {team.name}
                                  <X className="ml-1 h-2 w-2" />
                                </Badge>
                              ) : null;
                            })}
                            {member.teams.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{member.teams.length - 2} more
                              </Badge>
                            )}
                            <Select
                              onValueChange={(teamId) => {
                                if (!member.teams.includes(teamId)) {
                                  addMemberToTeam(member.id, teamId);
                                }
                              }}
                            >
                              <SelectTrigger className="w-8 h-6 p-0 border-dashed">
                                <Plus className="h-3 w-3" />
                              </SelectTrigger>
                              <SelectContent>
                                {teams
                                  .filter(
                                    (team) => !member.teams.includes(team.id),
                                  )
                                  .map((team) => (
                                    <SelectItem key={team.id} value={team.id}>
                                      {team.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {member.lastActive}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={member.isAdmin}
                              onCheckedChange={() =>
                                toggleMemberAdmin(member.id)
                              }
                            />
                            <span className="text-sm">
                              {member.isAdmin ? "Admin" : "Member"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditMember(member)}
                              title="Edit Member"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (
                                  confirm(
                                    "Remove this member from the organization?",
                                  )
                                ) {
                                  setTeamMembers((prev) =>
                                    prev.filter((m) => m.id !== member.id),
                                  );
                                  setHasUnsavedChanges(true);
                                }
                              }}
                              title="Remove Member"
                            >
                              <Trash2 className="h-4 w-4" />
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
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Team Database Access Permissions
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Configure database access permissions for each team
                  </p>
                </div>
                <Button
                  onClick={saveAllChanges}
                  disabled={!hasUnsavedChanges}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save All Changes
                  {hasUnsavedChanges && (
                    <span className="ml-2 w-2 h-2 bg-orange-400 rounded-full"></span>
                  )}
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
                              <TableRow
                                key={permission.databaseId}
                                className="h-12"
                              >
                                <TableCell className="py-2">
                                  <div className="flex items-center gap-2">
                                    <Database className="h-4 w-4 text-blue-500" />
                                    <span className="font-medium text-sm">
                                      {permission.databaseName}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center py-2">
                                  <Switch
                                    checked={permission.canRead}
                                    onCheckedChange={(value) =>
                                      updateTeamPermissions(
                                        team.id,
                                        permission.databaseId,
                                        "canRead",
                                        value,
                                      )
                                    }
                                    disabled={!canManageTeam(team)}
                                  />
                                </TableCell>
                                <TableCell className="text-center py-2">
                                  <Switch
                                    checked={permission.canWrite}
                                    onCheckedChange={(value) =>
                                      updateTeamPermissions(
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
                                <TableCell className="text-center py-2">
                                  <Switch
                                    checked={permission.canDelete}
                                    onCheckedChange={(value) =>
                                      updateTeamPermissions(
                                        team.id,
                                        permission.databaseId,
                                        "canDelete",
                                        value,
                                      )
                                    }
                                    disabled={
                                      !permission.canRead ||
                                      !canManageTeam(team)
                                    }
                                  />
                                </TableCell>
                                <TableCell className="text-center py-2">
                                  <Switch
                                    checked={permission.canManage}
                                    onCheckedChange={(value) =>
                                      updateTeamPermissions(
                                        team.id,
                                        permission.databaseId,
                                        "canManage",
                                        value,
                                      )
                                    }
                                    disabled={!canManageTeam(team)}
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
                <div className="text-sm text-blue-800 space-y-1">
                  <div>
                    <strong>Read:</strong> View database content
                  </div>
                  <div>
                    <strong>Write:</strong> Add and edit documents (requires
                    Read)
                  </div>
                  <div>
                    <strong>Delete:</strong> Remove documents (requires Read)
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
