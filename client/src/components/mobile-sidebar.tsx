import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

interface MobileSidebarProps {
  isAdmin?: boolean;
}

export function MobileSidebar({ isAdmin = false }: MobileSidebarProps) {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const isActive = (path: string) => location === path;
  
  return (
    <div className="md:hidden bg-black">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold">
            <span className="text-accent">Grail</span>
            <span className="text-foreground">Capitals</span>
          </span>
        </Link>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </Button>
      </div>
      
      {isOpen && (
        <nav className="p-4 border-b border-border">
          <div className="space-y-2">
            {isAdmin ? (
              <>
                <Link 
                  href="/admin" 
                  className={`flex items-center py-2 px-4 rounded-md ${isActive('/admin') ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'} transition-colors duration-200`}
                  onClick={() => setIsOpen(false)}
                >
                  <i className="fas fa-th-large mr-3"></i>
                  <span>Dashboard</span>
                </Link>
                <Link 
                  href="/admin/users" 
                  className={`flex items-center py-2 px-4 rounded-md ${isActive('/admin/users') ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'} transition-colors duration-200`}
                  onClick={() => setIsOpen(false)}
                >
                  <i className="fas fa-users mr-3"></i>
                  <span>Users</span>
                </Link>
                <Link 
                  href="/admin/transactions" 
                  className={`flex items-center py-2 px-4 rounded-md ${isActive('/admin/transactions') ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'} transition-colors duration-200`}
                  onClick={() => setIsOpen(false)}
                >
                  <i className="fas fa-wallet mr-3"></i>
                  <span>Transactions</span>
                </Link>
                <Link 
                  href="/admin/settings" 
                  className={`flex items-center py-2 px-4 rounded-md ${isActive('/admin/settings') ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'} transition-colors duration-200`}
                  onClick={() => setIsOpen(false)}
                >
                  <i className="fas fa-cog mr-3"></i>
                  <span>Settings</span>
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/dashboard" 
                  className={`flex items-center py-2 px-4 rounded-md ${isActive('/dashboard') ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'} transition-colors duration-200`}
                  onClick={() => setIsOpen(false)}
                >
                  <i className="fas fa-th-large mr-3"></i>
                  <span>Dashboard</span>
                </Link>
                <Link 
                  href="/plans" 
                  className={`flex items-center py-2 px-4 rounded-md ${isActive('/plans') ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'} transition-colors duration-200`}
                  onClick={() => setIsOpen(false)}
                >
                  <i className="fas fa-chart-line mr-3"></i>
                  <span>Investment Plans</span>
                </Link>
                <Link 
                  href="/transactions" 
                  className={`flex items-center py-2 px-4 rounded-md ${isActive('/transactions') ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'} transition-colors duration-200`}
                  onClick={() => setIsOpen(false)}
                >
                  <i className="fas fa-exchange-alt mr-3"></i>
                  <span>Transactions</span>
                </Link>
                <Link 
                  href="/profile" 
                  className={`flex items-center py-2 px-4 rounded-md ${isActive('/profile') ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'} transition-colors duration-200`}
                  onClick={() => setIsOpen(false)}
                >
                  <i className="fas fa-user mr-3"></i>
                  <span>Profile</span>
                </Link>
                <Link 
                  href="/support" 
                  className={`flex items-center py-2 px-4 rounded-md ${isActive('/support') ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'} transition-colors duration-200`}
                  onClick={() => setIsOpen(false)}
                >
                  <i className="fas fa-question-circle mr-3"></i>
                  <span>Support</span>
                </Link>
              </>
            )}
            <button 
              className="w-full flex items-center py-2 px-4 rounded-md text-muted-foreground hover:bg-accent/10 hover:text-accent transition-colors duration-200"
              onClick={() => {
                logoutMutation.mutate();
                setIsOpen(false);
              }}
            >
              <i className="fas fa-sign-out-alt mr-3"></i>
              <span>Logout</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
