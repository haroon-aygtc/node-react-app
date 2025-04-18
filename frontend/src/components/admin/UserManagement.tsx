import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  UserPlus,
  Lock,
  Unlock,
} from "lucide-react";

import { User } from '@/types/user';
import { Role, Permission } from '@/types/role';
import * as userService from '@/services/userService';
import * as roleService from '@/services/roleService';
import * as permissionService from '@/services/permissionService';
import { useToast } from '@/components/ui/use-toast';

interface UserData extends Omit<User, 'roles'> {
  status: "active" | "inactive" | "pending";
  organization?: string;
  role?: string;
  name?: string;
  lastLogin?: Date | null;
  roles?: Role[];
  password?: string;
}

interface RoleData extends Role {
  userCount?: number;
}

interface UserManagementPanelProps {
  defaultTab?: string;
}

const UserManagementPanel: React.FC<UserManagementPanelProps> = ({ defaultTab = "users" }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Update activeTab when defaultTab changes
  useEffect(() => {
    console.log('defaultTab changed to:', defaultTab);
    setActiveTab(defaultTab);
  }, [defaultTab]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);

  // State for users and roles
  const [users, setUsers] = useState<UserData[]>([]);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { toast } = useToast();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all-roles");
  const [statusFilter, setStatusFilter] = useState("all-status");

  // Fetch users and roles on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel to reduce loading time
        const [usersResponse, rolesResponse, permissionsResponse] = await Promise.all([
          userService.getAllUsers().catch(error => {
            console.error('Error fetching users:', error);
            return [];
          }),
          roleService.getAllRoles().catch(error => {
            console.error('Error fetching roles:', error);
            return [];
          }),
          permissionService.getAllPermissions().catch(error => {
            console.error('Error fetching permissions:', error);
            return [];
          })
        ]);

        // Process users
        const mappedUsers: UserData[] = [];
        if (Array.isArray(usersResponse)) {
          for (const user of usersResponse) {
            if (user && typeof user === 'object') {
              // Safely determine primary role
              let primaryRole = 'user';
              let userRoles: Role[] = [];

              if (user.roles) {
                if (Array.isArray(user.roles) && user.roles.length > 0) {
                  userRoles = user.roles;
                  if (user.roles[0] && user.roles[0].name) {
                    primaryRole = user.roles[0].name.toLowerCase();
                  }
                }
              }

              // If no roles are assigned, create a default user role
              if (userRoles.length === 0) {
                const now = new Date().toISOString();
                userRoles = [{
                  id: 'default',
                  name: 'user',
                  description: 'Default user role',
                  isDefault: true,
                  isSystem: true,
                  createdAt: now,
                  updatedAt: now
                }];
              }

              // Create a safe user object with fallbacks for all properties
              mappedUsers.push({
                id: user.id || 'unknown',
                email: user.email || 'no-email',
                fullName: user.fullName || '',
                name: user.fullName || (user.email ? user.email.split('@')[0] : 'Unknown User'),
                isActive: user.isActive !== undefined ? user.isActive : true,
                emailVerified: user.emailVerified || false,
                avatarUrl: user.avatarUrl || '',
                lastLoginAt: user.lastLoginAt || null,
                lastLogin: user.lastLoginAt ? new Date(user.lastLoginAt) : null,
                createdAt: user.createdAt || new Date().toISOString(),
                updatedAt: user.updatedAt || new Date().toISOString(),
                status: user.isActive !== undefined ? (user.isActive ? "active" : "inactive") : "active",
                organization: "Organization", // This would come from your API in a real app
                role: primaryRole,
                roles: userRoles
              } as UserData);
            }
          }
          setUsers(mappedUsers);
        } else {
          console.error('Expected users data to be an array, got:', usersResponse);
          setUsers([]);
          toast({
            title: "Error",
            description: "Failed to load user data. Please try again.",
            variant: "destructive"
          });
        }

        // Process roles
        const mappedRoles: RoleData[] = [];
        if (Array.isArray(rolesResponse)) {
          for (const role of rolesResponse) {
            if (role && typeof role === 'object') {
              // Get user count from role object if available, otherwise default to 0
              let userCount = role.userCount || 0;

              // Ensure permissions is an array
              let permissions = [];
              if (role.permissions && Array.isArray(role.permissions)) {
                permissions = role.permissions;
              } else if (role.rolePermissions && Array.isArray(role.rolePermissions)) {
                // Extract permissions from rolePermissions if available
                permissions = role.rolePermissions
                  .filter((rp: any) => rp.permission)
                  .map((rp: any) => rp.permission);
              }

              // Create a safe role object with fallbacks for all properties
              mappedRoles.push({
                id: role.id || 'unknown',
                name: role.name || 'Unnamed Role',
                description: role.description || '',
                isDefault: role.isDefault || false,
                isSystem: role.isSystem || false,
                createdAt: role.createdAt || new Date().toISOString(),
                updatedAt: role.updatedAt || new Date().toISOString(),
                userCount: userCount,
                permissions: permissions
              } as RoleData);
            }
          }
          setRoles(mappedRoles);
        } else {
          console.error('Expected roles data to be an array, got:', rolesResponse);
          setRoles([]);
          toast({
            title: "Error",
            description: "Failed to load role data. Please try again.",
            variant: "destructive"
          });
        }

        // Process permissions
        let allPermissions: Permission[] = [];
        if (Array.isArray(permissionsResponse) && permissionsResponse.length > 0) {
          allPermissions = permissionsResponse;
        } else {
          // If we didn't get any permissions, use defaults
          console.warn('No permissions found from API, using defaults');
          const now = new Date().toISOString();
          allPermissions = [
            { id: '1', name: 'user:create', description: 'Can create users', category: 'user', action: 'create', createdAt: now, updatedAt: now },
            { id: '2', name: 'user:read', description: 'Can read users', category: 'user', action: 'read', createdAt: now, updatedAt: now },
            { id: '3', name: 'user:update', description: 'Can update users', category: 'user', action: 'update', createdAt: now, updatedAt: now },
            { id: '4', name: 'user:delete', description: 'Can delete users', category: 'user', action: 'delete', createdAt: now, updatedAt: now },
            { id: '5', name: 'role:create', description: 'Can create roles', category: 'role', action: 'create', createdAt: now, updatedAt: now },
            { id: '6', name: 'role:read', description: 'Can read roles', category: 'role', action: 'read', createdAt: now, updatedAt: now },
            { id: '7', name: 'role:update', description: 'Can update roles', category: 'role', action: 'update', createdAt: now, updatedAt: now },
            { id: '8', name: 'content:read', description: 'Can read content', category: 'content', action: 'read', createdAt: now, updatedAt: now },
            { id: '9', name: 'content:create', description: 'Can create content', category: 'content', action: 'create', createdAt: now, updatedAt: now },
            { id: '10', name: 'content:update', description: 'Can update content', category: 'content', action: 'update', createdAt: now, updatedAt: now },
            { id: '11', name: 'analytics:read', description: 'Can view analytics', category: 'analytics', action: 'read', createdAt: now, updatedAt: now },
            { id: '12', name: 'settings:update', description: 'Can update settings', category: 'settings', action: 'update', createdAt: now, updatedAt: now }
          ];

          toast({
            title: "Warning",
            description: "Using default permissions. Some features may be limited.",
            variant: "default"
          });
        }
        setPermissions(allPermissions);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setActiveTab("edit-user");
  };

  const handleCreateNewUser = () => {
    setSelectedUser(null);
    setActiveTab("edit-user");
  };

  const handleSaveUser = async (userData: Partial<UserData>) => {
    setLoading(true);
    try {
      if (selectedUser) {
        // Update existing user
        await userService.updateUser(selectedUser.id, userData);
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      } else {
        // Create new user
        if (!userData.email || !userData.password) {
          throw new Error("Email and password are required");
        }

        await userService.createUser({
          email: userData.email,
          password: userData.password as string,
          fullName: userData.fullName || null,
          isActive: userData.isActive !== undefined ? userData.isActive : true,
          roleIds: userData.roles?.map(r => r.id) || []
        });
        toast({
          title: "Success",
          description: "User created successfully",
        });
      }

      // Refresh user list
      try {
        const usersData = await userService.getAllUsers();

        if (!Array.isArray(usersData)) {
          console.error('Expected users data to be an array, got:', usersData);
          throw new Error('Invalid response format');
        }

        const mappedUsers = usersData.map(user => {
          if (!user || typeof user !== 'object') {
            console.error('Invalid user object:', user);
            return null;
          }

          // Safely determine primary role and roles array
          let primaryRole = 'user';
          let userRoles: Role[] = [];

          if (user.roles) {
            if (Array.isArray(user.roles) && user.roles.length > 0) {
              userRoles = user.roles;
              if (user.roles[0] && user.roles[0].name) {
                primaryRole = user.roles[0].name.toLowerCase();
              }
            }
          }

          // If no roles are assigned, create a default user role
          if (userRoles.length === 0) {
            const now = new Date().toISOString();
            userRoles = [{
              id: 'default',
              name: 'user',
              description: 'Default user role',
              isDefault: true,
              isSystem: true,
              createdAt: now,
              updatedAt: now
            }];
          }

          return {
            id: user.id || 'unknown',
            email: user.email || 'no-email',
            fullName: user.fullName || '',
            name: user.fullName || user.email?.split('@')[0] || 'Unknown User',
            isActive: user.isActive !== undefined ? user.isActive : true,
            emailVerified: user.emailVerified || false,
            avatarUrl: user.avatarUrl || '',
            lastLoginAt: user.lastLoginAt || null,
            lastLogin: user.lastLoginAt ? new Date(user.lastLoginAt) : null,
            createdAt: user.createdAt || new Date().toISOString(),
            updatedAt: user.updatedAt || new Date().toISOString(),
            status: user.isActive !== undefined ? (user.isActive ? "active" : "inactive") : "active",
            organization: "Organization",
            role: primaryRole,
            roles: userRoles
          } as UserData;
        }).filter(Boolean); // Remove any null entries

        setUsers(mappedUsers);
      } catch (error) {
        console.error('Error refreshing user list:', error);
        toast({
          title: "Warning",
          description: "User saved but could not refresh the list. Please reload the page.",
          variant: "destructive"
        });
      }

      // Return to user list
      setActiveTab("users");
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save user",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await userService.deleteUser(userId);
      setUsers(users.filter((user) => user.id !== userId));
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  const handleEditRole = (role: RoleData) => {
    setSelectedRole(role);
    setActiveTab("edit-role");
  };

  const handleCreateNewRole = () => {
    setSelectedRole(null);
    setActiveTab("edit-role");
  };

  const handleSaveRole = async (roleData: Partial<RoleData>) => {
    setLoading(true);
    try {
      if (selectedRole) {
        // Update existing role
        await roleService.updateRole(selectedRole.id, roleData);
        toast({
          title: "Success",
          description: "Role updated successfully",
        });
      } else {
        // Create new role
        if (!roleData.name) {
          throw new Error("Role name is required");
        }

        await roleService.createRole({
          name: roleData.name,
          description: roleData.description,
          isDefault: roleData.isDefault,
          permissionIds: roleData.permissions?.map(p => p.id) || []
        });
        toast({
          title: "Success",
          description: "Role created successfully",
        });
      }

      // Refresh role list
      try {
        const rolesData = await roleService.getAllRoles();

        if (!Array.isArray(rolesData)) {
          console.error('Expected roles data to be an array, got:', rolesData);
          throw new Error('Invalid response format');
        }

        const mappedRoles = rolesData.map(role => {
          if (!role || typeof role !== 'object') {
            console.error('Invalid role object:', role);
            return null;
          }

          return {
            ...role,
            userCount: role.userCount || 0,
            permissions: Array.isArray(role.permissions) ? role.permissions : []
          };
        });

        // Filter out null values
        const validRoles = mappedRoles.filter(Boolean);
        setRoles(validRoles);
      } catch (error) {
        console.error('Error refreshing role list:', error);
        toast({
          title: "Warning",
          description: "Role saved but could not refresh the list. Please reload the page.",
          variant: "destructive"
        });
      }

      // Return to role list
      setActiveTab("roles");
    } catch (error) {
      console.error('Error saving role:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save role",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      await roleService.deleteRole(roleId);
      setRoles(roles.filter((role) => role.id !== roleId));
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
    } catch (error) {
      console.error(`Error deleting role ${roleId}:`, error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete role",
        variant: "destructive"
      });
    }
  };

  const getRoleBadge = (role?: string) => {
    if (!role) return null;

    switch (role.toLowerCase()) {
      case "admin":
      case "administrator":
        return <Badge className="bg-purple-500">Admin</Badge>;
      case "editor":
      case "manager":
        return <Badge className="bg-blue-500">Editor</Badge>;
      case "viewer":
      case "user":
        return <Badge className="bg-green-500">User</Badge>;
      case "guest":
        return <Badge className="bg-gray-500">Guest</Badge>;
      default:
        return <Badge className="bg-gray-500">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: UserData["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="text-green-500 border-green-500">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="outline" className="text-gray-500 border-gray-500">
            Inactive
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  // Helper function to check if a role has specific permissions
  const hasPermission = (role: RoleData | null, permissionNames: string[]): boolean => {
    if (!role) return false;

    // Get permissions from either permissions array or rolePermissions
    let displayPermissions: Permission[] = [];

    if (Array.isArray(role.permissions) && role.permissions.length > 0) {
      displayPermissions = role.permissions;
    } else if (Array.isArray(role.rolePermissions) && role.rolePermissions.length > 0) {
      displayPermissions = role.rolePermissions
        .filter(rp => rp.permission)
        .map(rp => rp.permission as Permission);
    }

    return displayPermissions.some(p => permissionNames.includes(p.name));
  };

  console.log('UserManagement rendering with tab:', activeTab);

  return (
    <div className="w-full h-full bg-background p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={handleCreateNewUser}>
          <UserPlus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-primary/10 p-1 rounded-md">
          <TabsTrigger value="users" className="font-medium">Users</TabsTrigger>
          <TabsTrigger value="roles" className="font-medium">Roles & Permissions</TabsTrigger>
          {(activeTab === 'edit-user') && (
            <TabsTrigger value="edit-user" className="font-medium">
              {selectedUser ? "Edit User" : "Add User"}
            </TabsTrigger>
          )}
          {(activeTab === 'edit-role') && (
            <TabsTrigger value="edit-role" className="font-medium">
              {selectedRole ? "Edit Role" : "Add Role"}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users and their access to the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      className="max-w-sm mr-2 pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select
                    defaultValue="all-roles"
                    value={roleFilter}
                    onValueChange={setRoleFilter}
                  >
                    <SelectTrigger className="w-[180px] mr-2">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-roles">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="guest">Guest</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    defaultValue="all-status"
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-status">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Bulk Import
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users
                      .filter(user => {
                        // Apply search filter
                        const searchLower = searchTerm.toLowerCase();
                        const matchesSearch = searchTerm === '' ||
                          user.email.toLowerCase().includes(searchLower) ||
                          (user.name?.toLowerCase() || '').includes(searchLower) ||
                          (user.fullName?.toLowerCase() || '').includes(searchLower);

                        // Apply role filter
                        const matchesRole = roleFilter === 'all-roles' ||
                          (user.role?.toLowerCase() === roleFilter.toLowerCase());

                        // Apply status filter
                        const matchesStatus = statusFilter === 'all-status' ||
                          user.status === statusFilter;

                        return matchesSearch && matchesRole && matchesStatus;
                      })
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>{user.organization}</TableCell>
                          <TableCell>
                            {user.lastLogin
                              ? user.lastLogin.toLocaleDateString()
                              : user.lastLoginAt
                                ? new Date(user.lastLoginAt).toLocaleDateString()
                                : "Never"}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {user.status === "active" ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-amber-500 hover:text-amber-700"
                                >
                                  <Lock className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-green-500 hover:text-green-700"
                                >
                                  <Unlock className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>
                Manage roles and their associated permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search roles..."
                    className="max-w-sm pl-8"
                  />
                </div>
                <Button onClick={handleCreateNewRole}>
                  <Plus className="mr-2 h-4 w-4" /> Add Role
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{role.description}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(() => {
                              // Get permissions from either permissions array or rolePermissions
                              let displayPermissions: Permission[] = [];

                              if (Array.isArray(role.permissions) && role.permissions.length > 0) {
                                displayPermissions = role.permissions;
                              } else if (Array.isArray(role.rolePermissions) && role.rolePermissions.length > 0) {
                                displayPermissions = role.rolePermissions
                                  .filter(rp => rp.permission)
                                  .map(rp => rp.permission as Permission);
                              }

                              if (displayPermissions.length > 0) {
                                return (
                                  <>
                                    {displayPermissions.slice(0, 2).map((permission) => (
                                      <Badge
                                        key={permission.id || `perm-${Math.random()}`}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {permission.name ? permission.name.replace(/:/g, " ") : 'Unknown'}
                                      </Badge>
                                    ))}
                                    {displayPermissions.length > 2 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{displayPermissions.length - 2}
                                      </Badge>
                                    )}
                                  </>
                                );
                              } else {
                                return <Badge variant="secondary" className="text-xs">No permissions</Badge>;
                              }
                            })()
                            }
                          </div>
                        </TableCell>
                        <TableCell>{role.userCount || 0} users</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditRole(role)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteRole(role.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit-user">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedUser ? "Edit User" : "Create New User"}
              </CardTitle>
              <CardDescription>
                {selectedUser
                  ? "Update user details and permissions"
                  : "Add a new user to the system"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user-name">Full Name</Label>
                  <Input
                    id="user-name"
                    placeholder="John Doe"
                    defaultValue={selectedUser?.name || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-email">Email Address</Label>
                  <Input
                    id="user-email"
                    type="email"
                    placeholder="john@example.com"
                    defaultValue={selectedUser?.email || ""}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user-role">Role</Label>
                  <Select defaultValue={selectedUser?.role || "viewer"}>
                    <SelectTrigger id="user-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="guest">Guest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-organization">Organization</Label>
                  <Input
                    id="user-organization"
                    placeholder="Company Name"
                    defaultValue={selectedUser?.organization || ""}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user-password">Password</Label>
                  <Input
                    id="user-password"
                    type="password"
                    placeholder={selectedUser ? "••••••••" : "Enter password"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-confirm-password">
                    Confirm Password
                  </Label>
                  <Input
                    id="user-confirm-password"
                    type="password"
                    placeholder={selectedUser ? "••••••••" : "Confirm password"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="status-active"
                      name="status"
                      value="active"
                      aria-label="Active status"
                      placeholder="Active"
                      defaultChecked={
                        selectedUser?.status === "active" || !selectedUser
                      }
                      className="h-4 w-4 text-blue-600"
                    />
                    <Label htmlFor="status-active" className="cursor-pointer">
                      Active
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="status-inactive"
                      name="status"
                      value="inactive"
                      aria-label="Inactive status"
                      placeholder="Inactive"
                      defaultChecked={selectedUser?.status === "inactive"}
                      className="h-4 w-4 text-blue-600"
                    />
                    <Label htmlFor="status-inactive" className="cursor-pointer">
                      Inactive
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="status-pending"
                      name="status"
                      value="pending"
                      aria-label="Pending status"
                      placeholder="Pending"
                      defaultChecked={selectedUser?.status === "pending"}
                      className="h-4 w-4 text-blue-600"
                    />
                    <Label htmlFor="status-pending" className="cursor-pointer">
                      Pending
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="send-welcome-email">Send Welcome Email</Label>
                  <Switch
                    id="send-welcome-email"
                    defaultChecked={!selectedUser}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("users")}>
                Cancel
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  // Get form data
                  const form = e.currentTarget.closest('form');
                  if (!form) return;

                  const formData = new FormData(form);
                  const userData: Partial<UserData> = {
                    email: formData.get('user-email') as string,
                    fullName: formData.get('user-name') as string,
                    password: formData.get('user-password') as string,
                    isActive: formData.get('status') === 'active',
                    // In a real app, you would get the selected role ID
                    roles: [{ id: '1', name: 'user', description: '', isDefault: false, isSystem: false, createdAt: '', updatedAt: '' }]
                  };

                  handleSaveUser(userData);
                }}
              >
                {selectedUser ? "Update User" : "Create User"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="edit-role">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedRole ? "Edit Role" : "Create New Role"}
              </CardTitle>
              <CardDescription>
                {selectedRole
                  ? "Update role details and permissions"
                  : "Define a new role with specific permissions"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role-name">Role Name</Label>
                <Input
                  id="role-name"
                  placeholder="e.g., Content Manager"
                  defaultValue={selectedRole?.name || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role-description">Description</Label>
                <Input
                  id="role-description"
                  placeholder="Brief description of this role"
                  defaultValue={selectedRole?.description || ""}
                />
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Permissions</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">User Management</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          aria-label="Manage Users"
                          type="checkbox"
                          id="perm-manage-users"
                          defaultChecked={hasPermission(selectedRole, ["user:create", "user:update"])}
                          className="h-4 w-4 text-blue-600"
                        />
                        <Label
                          htmlFor="perm-manage-users"
                          className="cursor-pointer"
                        >
                          Manage Users
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          aria-label="Manage Roles"
                          type="checkbox"
                          id="perm-manage-roles"
                          defaultChecked={hasPermission(selectedRole, ["role:create", "role:update"])}
                          className="h-4 w-4 text-blue-600"
                        />
                        <Label
                          htmlFor="perm-manage-roles"
                          className="cursor-pointer"
                        >
                          Manage Roles
                        </Label>
                      </div>
                    </div>

                    <h4 className="font-medium">Content</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          aria-label="View Content"
                          type="checkbox"
                          id="perm-view-content"
                          defaultChecked={hasPermission(selectedRole, ["content:read"])}
                          className="h-4 w-4 text-blue-600"
                        />
                        <Label
                          htmlFor="perm-view-content"
                          className="cursor-pointer"
                        >
                          View Content
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          aria-label="Manage Content"
                          type="checkbox"
                          id="perm-manage-content"
                          defaultChecked={hasPermission(selectedRole, ["content:create", "content:update"])}
                          className="h-4 w-4 text-blue-600"
                        />
                        <Label
                          htmlFor="perm-manage-content"
                          className="cursor-pointer"
                        >
                          Manage Content
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Analytics</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          aria-label="View Analytics"
                          type="checkbox"
                          id="perm-view-analytics"
                          defaultChecked={hasPermission(selectedRole, ["analytics:read"])}
                          className="h-4 w-4 text-blue-600"
                        />
                        <Label
                          htmlFor="perm-view-analytics"
                          className="cursor-pointer"
                        >
                          View Analytics
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          aria-label="Export Data"
                          type="checkbox"
                          id="perm-export-data"
                          defaultChecked={hasPermission(selectedRole, ["analytics:export", "content:export"])}
                          className="h-4 w-4 text-blue-600"
                        />
                        <Label
                          htmlFor="perm-export-data"
                          className="cursor-pointer"
                        >
                          Export Data
                        </Label>
                      </div>
                    </div>

                    <h4 className="font-medium">System</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          aria-label="Manage Settings"
                          type="checkbox"
                          id="perm-manage-settings"
                          defaultChecked={hasPermission(selectedRole, ["settings:update"])}
                          className="h-4 w-4 text-blue-600"
                        />
                        <Label
                          htmlFor="perm-manage-settings"
                          className="cursor-pointer"
                        >
                          Manage Settings
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("roles")}>
                Cancel
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  // Get form data
                  const form = e.currentTarget.closest('form');
                  if (!form) return;

                  // Get permission checkboxes
                  const permissionIds: string[] = [];
                  if (form.querySelector('#perm-manage-users:checked')) {
                    permissionIds.push('1', '2'); // user:create, user:update
                  }
                  if (form.querySelector('#perm-manage-roles:checked')) {
                    permissionIds.push('3', '4'); // role:create, role:update
                  }
                  if (form.querySelector('#perm-view-content:checked')) {
                    permissionIds.push('5'); // content:read
                  }
                  if (form.querySelector('#perm-manage-content:checked')) {
                    permissionIds.push('6', '7'); // content:create, content:update
                  }
                  if (form.querySelector('#perm-view-analytics:checked')) {
                    permissionIds.push('8'); // analytics:read
                  }
                  if (form.querySelector('#perm-export-data:checked')) {
                    permissionIds.push('9', '10'); // analytics:export, content:export
                  }
                  if (form.querySelector('#perm-manage-settings:checked')) {
                    permissionIds.push('11'); // settings:update
                  }

                  // Create a role data object with the form values
                  const roleData: any = {
                    name: (form.querySelector('#role-name') as HTMLInputElement)?.value,
                    description: (form.querySelector('#role-description') as HTMLInputElement)?.value,
                    permissionIds: permissionIds
                  };

                  handleSaveRole(roleData);
                }}
              >
                {selectedRole ? "Update Role" : "Create Role"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagementPanel;
