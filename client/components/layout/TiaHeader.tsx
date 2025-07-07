import React, { memo, useCallback } from "react";
import {
  Users,
  Package,
  CreditCard,
  Receipt,
  User,
  Shield,
  FileCheck,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Language, Translations } from "@/lib/i18n";

interface Company {
  id: string;
  name: string;
  email: string;
  website: string;
  logo?: string;
  createdDate: string;
  updatedDate: string;
}

interface TiaHeaderProps {
  isAdmin: boolean;
  currentUser: {
    name: string;
    initials: string;
  };
  selectedCompany: Company | null;
  onOpenModal: (modalName: string) => void;
  language: Language;
  t: Translations;
}

const TiaHeader = memo<TiaHeaderProps>(
  ({ isAdmin, currentUser, onOpenModal, language, t }) => {
    // Memoized event handlers to prevent unnecessary re-renders
    const handleTeamsClick = useCallback(() => {
      onOpenModal("teams");
    }, [onOpenModal]);

    const handlePlanClick = useCallback(
      (planType: string) => {
        onOpenModal(planType);
      },
      [onOpenModal],
    );

    const handleUserMenuClick = useCallback(
      (menuType: string) => {
        if (menuType === "logout") {
          if (confirm("Are you sure you want to log out?")) {
            // Implement logout logic
            console.log("Logging out...");
          }
        } else {
          onOpenModal(menuType);
        }
      },
      [onOpenModal],
    );

    return (
      <header className="header-container">
        <div className="flex items-center space-x-6">
          {/* Company Logo - clickable */}
          <button
            onClick={() => window.open("https://softia.ca", "_blank")}
            className="logo-button group"
          >
            <div className="logo-icon">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="logo-text">Softia</span>
          </button>

          <Separator orientation="vertical" className="h-6" />

          {/* Navigation with enhanced accessibility */}
          <nav className="flex items-center space-x-6" role="navigation">
            {isAdmin && (
              <Button
                variant="ghost"
                className="nav-button"
                onClick={handleTeamsClick}
                aria-label={`Open ${t.teams} management`}
              >
                <Users className="h-4 w-4" />
                {t.teams}
              </Button>
            )}

            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="nav-button"
                    aria-label={`Open ${t.yourPlan} menu`}
                  >
                    {t.yourPlan}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="z-50 dropdown-width-md">
                  <DropdownMenuLabel>Plan Management</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handlePlanClick("currentPlan")}
                    className="cursor-pointer"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    {t.currentPlan}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handlePlanClick("availablePackages")}
                    className="cursor-pointer"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {t.availablePackages}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handlePlanClick("viewBills")}
                    className="cursor-pointer"
                  >
                    <Receipt className="mr-2 h-4 w-4" />
                    {t.viewBills}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>

        {/* Enhanced User Profile Section */}
        <div className="flex items-center space-x-4">
          <Separator orientation="vertical" className="h-6" />

          <span className="user-name">{currentUser.name}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="user-avatar">
                <AvatarImage src="" alt={`${currentUser.name} avatar`} />
                <AvatarFallback className="user-avatar-fallback">
                  {currentUser.initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="z-50 dropdown-width-sm"
              sideOffset={5}
            >
              <DropdownMenuLabel>{t.myAccount}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleUserMenuClick("userProfile")}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                {t.profile}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUserMenuClick("security")}
                className="cursor-pointer"
              >
                <Shield className="mr-2 h-4 w-4" />
                {t.security}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUserMenuClick("terms")}
                className="cursor-pointer"
              >
                <FileCheck className="mr-2 h-4 w-4" />
                {t.termsOfUse}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleUserMenuClick("logout")}
                className="logout-menu-item"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t.logOut}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    );
  },
);

TiaHeader.displayName = "TiaHeader";

export default TiaHeader;
