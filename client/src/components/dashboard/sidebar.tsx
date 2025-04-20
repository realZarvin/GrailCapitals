import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface SidebarProps {
  isAdmin?: boolean;
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();
  
  const isActive = (path: string) => location === path;
  
  return (
    <aside className="hidden md:block bg-black w-64 min-h-screen p-4 border-r border-zinc-800">
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold">
            <span className="text-accent">Grail</span>
            <span className="text-foreground">Capitals</span>
          </span>
        </Link>
      </div>
      
      <nav className="space-y-2">
        {isAdmin ? (
          <>
            <Link 
              href="/admin" 
              className={`flex items-center py-2 px-4 rounded-md ${
                isActive('/admin') ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'
              } transition-colors duration-200`}
            >
              <i className="fas fa-th-large mr-3"></i>
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/admin/users" 
              className={`flex items-center py-2 px-4 rounded-md ${
                isActive('/admin/users') ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'
              } transition-colors duration-200`}
            >
              <i className="fas fa-users mr-3"></i>
              <span>Users</span>
            </Link>
            <Link 
              href="/admin/transactions" 
              className={`flex items-center py-2 px-4 rounded-md ${
                isActive('/admin/transactions') ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'
              } transition-colors duration-200`}
            >
              <i className="fas fa-wallet mr-3"></i>
              <span>Transactions</span>
            </Link>
            <Link 
              href="/admin/settings" 
              className={`flex items-center py-2 px-4 rounded-md ${
                isActive('/admin/settings') ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'
              } transition-colors duration-200`}
            >
              <i className="fas fa-cog mr-3"></i>
              <span>Settings</span>
            </Link>
          </>
        ) : (
          <>
            <Link 
              href="/dashboard" 
              className={`flex items-center py-2 px-4 rounded-md ${
                isActive('/dashboard') ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'
              } transition-colors duration-200`}
            >
              <i className="fas fa-th-large mr-3"></i>
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/plans" 
              className={`flex items-center py-2 px-4 rounded-md ${
                isActive('/plans') ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'
              } transition-colors duration-200`}
            >
              <i className="fas fa-chart-line mr-3"></i>
              <span>Investment Plans</span>
            </Link>
            <Link 
              href="/transactions" 
              className={`flex items-center py-2 px-4 rounded-md ${
                isActive('/transactions') ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'
              } transition-colors duration-200`}
            >
              <i className="fas fa-exchange-alt mr-3"></i>
              <span>Transactions</span>
            </Link>
            <Link 
              href="/profile" 
              className={`flex items-center py-2 px-4 rounded-md ${
                isActive('/profile') ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'
              } transition-colors duration-200`}
            >
              <i className="fas fa-user mr-3"></i>
              <span>Profile</span>
            </Link>
            <Link 
              href="/support" 
              className={`flex items-center py-2 px-4 rounded-md ${
                isActive('/support') ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'
              } transition-colors duration-200`}
            >
              <i className="fas fa-question-circle mr-3"></i>
              <span>Support</span>
            </Link>
          </>
        )}
        <button 
          className="flex items-center py-2 px-4 rounded-md text-muted-foreground hover:bg-accent/10 hover:text-accent transition-colors duration-200 w-full text-left"
          onClick={() => logoutMutation.mutate()}
        >
          <i className="fas fa-sign-out-alt mr-3"></i>
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
