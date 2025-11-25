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
  Brain,
  Newspaper,
  CloudDownload
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
  { title: "Homepage", url: "/app/homepage", icon: Home },
  { title: "Meus Cursos", url: "/app/meus-cursos", icon: BookOpen },
  { title: "Marketplace", url: "/app/marketplace", icon: ShoppingCart },
  { title: "Noticias", url: "/app/noticias", icon: Newspaper },
  { title: "Simulador 3D", url: "/app/simulador-3d", icon: Box },
  { title: "Inteligência Artificial", url: "/app/ia", icon: Brain },
  { title: "Downloads", url: "/app/downloads", icon: CloudDownload },
];

const bottomItems = [
  { title: "Perfil", url: "/app/perfil", icon: User },
  { title: "Configurações", url: "/app/configuracoes", icon: Settings },
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
        {/* Main Navigation */}
        <div className="flex-1 py-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-3">
                {mainItems.map((item, index) => (
                  <SidebarMenuItem key={item.title} className={index === 0 ? "mt-4" : "mt-3"}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
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
              <SidebarMenu className="space-y-3">
                {bottomItems.map((item, index) => (
                  <SidebarMenuItem key={item.title} className={index === 0 ? "mt-4" : "mt-3"}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
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