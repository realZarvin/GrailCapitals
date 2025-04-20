import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function SiteHeader() {
  const [location] = useLocation();
  const { user, logoutMutation, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location === path;
  
  return (
    <header className="bg-black sticky top-0 z-50 shadow-md border-b border-zinc-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold flex items-center">
            <span className="text-accent mr-1">Grail</span>
            <span className="text-foreground">Capitals</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link href="/" className={`${isActive('/') ? 'text-accent' : 'text-muted-foreground'} hover:text-accent transition-colors duration-200`}>
            Home
          </Link>
          <a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">
            About
          </a>
          <a href="/#plans" className="text-muted-foreground hover:text-accent transition-colors duration-200">
            Plans
          </a>
          <a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">
            FAQ
          </a>
          <a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">
            Contact
          </a>
          
          {/* Show these buttons when not logged in */}
          {!user ? (
            <div className="flex space-x-3">
              <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-primary">
                <Link href="/auth">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth">Sign Up</Link>
              </Button>
            </div>
          ) : (
            /* Show this when logged in */
            <div className="flex items-center space-x-3">
              <Button asChild>
                <Link href={isAdmin ? "/admin" : "/dashboard"}>Dashboard</Link>
              </Button>
              <Button 
                variant="ghost" 
                className="text-muted-foreground hover:text-accent transition-colors duration-200"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                <i className="fas fa-sign-out-alt mr-1"></i> Logout
              </Button>
            </div>
          )}
        </nav>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-foreground focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className="fas fa-bars text-2xl"></i>
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black py-4 px-4 shadow-lg border-t border-zinc-800">
          <div className="flex flex-col space-y-4">
            <Link 
              href="/" 
              className={`${isActive('/') ? 'text-accent' : 'text-muted-foreground'} hover:text-accent transition-colors duration-200`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">
              About
            </a>
            <a 
              href="/#plans" 
              className="text-muted-foreground hover:text-accent transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Plans
            </a>
            <a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">
              FAQ
            </a>
            <a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">
              Contact
            </a>
            
            {/* Show these buttons when not logged in */}
            {!user ? (
              <div className="flex flex-col space-y-3 pt-2">
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full border-accent text-accent hover:bg-accent hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href="/auth">Log In</Link>
                </Button>
                <Button 
                  asChild 
                  className="w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href="/auth">Sign Up</Link>
                </Button>
              </div>
            ) : (
              /* Show this when logged in */
              <div className="flex flex-col space-y-3 pt-2">
                <Button 
                  asChild 
                  className="w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href={isAdmin ? "/admin" : "/dashboard"}>Dashboard</Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-accent text-accent hover:bg-accent hover:text-primary"
                  onClick={() => {
                    logoutMutation.mutate();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={logoutMutation.isPending}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
