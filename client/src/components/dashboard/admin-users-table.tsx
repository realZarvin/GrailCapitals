import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  fullName: string;
  email: string;
  balance: number;
  activePlan: string | null;
  status: 'active' | 'pending' | 'suspended';
}

interface AdminUsersTableProps {
  users: User[];
}

export function AdminUsersTable({ users }: AdminUsersTableProps) {
  const { toast } = useToast();
  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  
  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <i className="fas fa-users text-3xl mb-2"></i>
        <p>No users found</p>
      </div>
    );
  }
  
  const toggleDetails = (id: number) => {
    if (expandedUser === id) {
      setExpandedUser(null);
    } else {
      setExpandedUser(id);
    }
  };
  
  const handleUserAction = async (action: string, userId: number, userName: string) => {
    try {
      await apiRequest('POST', `/api/admin/users/${userId}/${action}`, {});
      
      // Invalidate user queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      
      toast({
        title: 'Success',
        description: `User ${userName} has been ${action}ed.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} user: ${(error as Error).message}`,
        variant: 'destructive',
      });
    }
  };
  
  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500 border-0">Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-0">Pending</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="bg-red-500/20 text-red-500 border-0">Suspended</Badge>;
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <>
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mr-3">
                      <span className="text-accent">{getInitials(user.fullName)}</span>
                    </div>
                    <span>{user.fullName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>${user.balance.toFixed(2)}</TableCell>
                <TableCell>{user.activePlan || 'None'}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      title="View Details"
                      onClick={() => toggleDetails(user.id)}
                    >
                      <i className="fas fa-eye"></i>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <i className="fas fa-ellipsis-v"></i>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleUserAction('edit', user.id, user.fullName)}>
                          <i className="fas fa-edit mr-2"></i> Edit User
                        </DropdownMenuItem>
                        {user.status !== 'suspended' ? (
                          <DropdownMenuItem 
                            className="text-red-500"
                            onClick={() => handleUserAction('suspend', user.id, user.fullName)}
                          >
                            <i className="fas fa-ban mr-2"></i> Suspend User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            className="text-green-500"
                            onClick={() => handleUserAction('activate', user.id, user.fullName)}
                          >
                            <i className="fas fa-check-circle mr-2"></i> Activate User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
              {expandedUser === user.id && (
                <TableRow>
                  <TableCell colSpan={6} className="bg-muted/30">
                    <div className="p-4">
                      <h4 className="font-medium mb-2">User Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">User ID</p>
                          <p>{user.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Registration Date</p>
                          <p>January 15, 2023</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Login</p>
                          <p>Today, 2:45 PM</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Deposits</p>
                          <p>$1,250.00</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Withdrawals</p>
                          <p>$450.00</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Current ROI</p>
                          <p>12%</p>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" variant="outline">View Transactions</Button>
                        <Button size="sm" variant="default">Add Investment</Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
