
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleUser, LogOut, Menu, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-sm border-b" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-semibold tracking-tight">Mission Maker</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex space-x-1">
            <NavLink to="/" label="Home" active={location.pathname === "/"} />
            {user && (
              <>
                <NavLink to="/dashboard" label="Dashboard" active={location.pathname === "/dashboard"} />
                <NavLink to="/missions" label="My Missions" active={location.pathname === "/missions"} />
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Token Display */}
                <div className="flex items-center bg-secondary/50 px-3 py-1 rounded-full text-sm">
                  <div className="font-medium">{user.tokens} tokens</div>
                </div>

                {/* Streak Display */}
                <div className="flex items-center text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-3 py-1 rounded-full text-sm">
                  <Star className="w-4 h-4 mr-1" />
                  <div className="font-medium">{user.streak} day streak</div>
                </div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-1" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-0.5">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <CircleUser className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => logout()}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild>
                <Link to="/login">Sign in</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu />
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="bg-card/95 backdrop-blur-sm border-t px-4 py-3 space-y-3">
            <Link
              to="/"
              className="block py-2 px-3 rounded-md hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="block py-2 px-3 rounded-md hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/missions"
                  className="block py-2 px-3 rounded-md hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Missions
                </Link>
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-sm">{user.tokens} tokens</div>
                    <div className="flex items-center text-amber-500 text-sm">
                      <Star className="w-4 h-4 mr-1" />
                      <span>{user.streak} day streak</span>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={logout} size="sm">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </Button>
                </div>
              </>
            )}
            {!user && (
              <div className="py-2">
                <Button asChild className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/login">Sign in</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  active: boolean;
}

const NavLink = ({ to, label, active }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "px-3 py-2 text-sm font-medium rounded-md transition-colors",
        active
          ? "bg-secondary text-secondary-foreground"
          : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
      )}
    >
      {label}
    </Link>
  );
};

export default Navbar;
