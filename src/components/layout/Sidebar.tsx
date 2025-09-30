import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Building2,
  Package2,
  ShoppingCart,
  Users,
  Image,
  Megaphone,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  {
    name: "Products",
    icon: Package,
    children: [
      { name: "All Products", href: "/products" },
      { name: "Add Product", href: "/products", action: "add-product" },
    ],
  },
  { name: "Categories", href: "/categories", icon: FolderTree },
  { name: "Brands & Models", href: "/brands", icon: Building2 },
  { name: "Inventory", href: "/inventory", icon: Package2 },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Users", href: "/users", icon: Users },
  { name: "Media Library", href: "/media", icon: Image },
  { name: "Marketing", href: "/marketing", icon: Megaphone },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [openSections, setOpenSections] = useState<string[]>(["Products"]);
  const navigate = useNavigate();

  const toggleSection = (name: string) => {
    setOpenSections(prev =>
      prev.includes(name)
        ? prev.filter(section => section !== name)
        : [...prev, name]
    );
  };

  return (
    <div
      className={cn(
        "bg-card border-r border-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">Riders Moto Shop</h2>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn("ml-auto", collapsed && "mx-auto")}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navigation.map((item) => {
          if (item.children) {
            const isOpen = openSections.includes(item.name);
            return (
              <Collapsible key={item.name} open={isOpen} onOpenChange={() => toggleSection(item.name)}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 text-left font-normal",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.name}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
                {!collapsed && (
                  <CollapsibleContent className="space-y-1">
                    {item.children.map((child) => {
                      if (child.action === "add-product") {
                        return (
                          <button
                            key={child.name}
                            onClick={() => {
                              navigate("/products");
                              // Trigger modal opening - we'll need to pass this up
                              window.dispatchEvent(new CustomEvent('open-product-modal'));
                            }}
                            className="block w-full px-4 py-2 text-sm rounded-md transition-colors ml-8 text-left text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            {child.name}
                          </button>
                        );
                      }
                      
                      return (
                        <NavLink
                          key={child.href}
                          to={child.href}
                          className={({ isActive }) =>
                            cn(
                              "block w-full px-4 py-2 text-sm rounded-md transition-colors ml-8",
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )
                          }
                        >
                          {child.name}
                        </NavLink>
                      );
                    })}
                  </CollapsibleContent>
                )}
              </Collapsible>
            );
          }

          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  collapsed && "justify-center px-2",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}