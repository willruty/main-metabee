import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  ShoppingCart, 
  Box, 
  User, 
  Settings,
  ChevronRight,
  Brain
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Homepage", url: "/", icon: Home },
  { title: "Meus Cursos", url: "/meus-cursos", icon: BookOpen },
  { title: "Marketplace", url: "/marketplace", icon: ShoppingCart },
  { title: "Simulador 3D", url: "/simulador-3d", icon: Box },
  { title: "Inteligência Artificial", url: "/chat-ia", icon: Brain },
];

const bottomItems = [
  { title: "Perfil", url: "/perfil", icon: User },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path;

  // Auto-collapse when not hovered
  useEffect(() => {
    if (!isHovered && !collapsed) {
      const timer = setTimeout(() => {
        setCollapsed(true);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isHovered, collapsed]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setCollapsed(false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Sidebar
      className={`transition-all duration-300 ease-in-out overflow-hidden ${collapsed && !isHovered ? "w-16" : "w-64"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarContent className="flex flex-col h-full overflow-hidden">
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
              M
            </div>
            {(!collapsed || isHovered) && (
              <div className="text-lg font-bold text-primary">
                MetaStation
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 py-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {(!collapsed || isHovered) && (
                          <span className="text-sm font-medium">{item.title}</span>
                        )}
                        {(!collapsed || isHovered) && isActive(item.url) && (
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-sidebar-border py-4 overflow-hidden">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {bottomItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {(!collapsed || isHovered) && (
                          <span className="text-sm font-medium">{item.title}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}