import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  FileDown,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDownloadDocs = () => {
    // Download the documentation as Markdown file
    const link = document.createElement("a");
    link.href = "/documentation.md";
    link.download = "Restaurant-Analytics-Documentation.md";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <nav
        className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-20 font-bold text-gray-900 dark:text-white">
                  NOLA Platform
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="Ir para o painel"
              >
                <LayoutDashboard className="w-5 h-5 mr-2" aria-hidden="true" />
                Painel
              </button>

              <button
                onClick={handleDownloadDocs}
                className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                title="Baixar Documentação"
                aria-label="Baixar documentação"
              >
                <FileDown className="w-5 h-5 mr-2" aria-hidden="true" />
                Docs
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                title={
                  theme === "dark"
                    ? "Mudar para modo claro"
                    : "Mudar para modo escuro"
                }
                aria-label={
                  theme === "dark"
                    ? "Mudar para modo claro"
                    : "Mudar para modo escuro"
                }
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Moon className="w-5 h-5" aria-hidden="true" />
                )}
              </button>

              <div className="flex items-center space-x-3 ml-6 pl-6 border-l dark:border-gray-700">
                <div className="text-16">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Sair"
                  aria-label="Sair da sua conta"
                >
                  <LogOut className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 dark:text-gray-400"
                aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <Menu className="w-6 h-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden border-t dark:border-gray-700"
          >
            <div className="px-4 py-3 space-y-3" role="menu">
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                role="menuitem"
                aria-label="Ir para o painel"
              >
                <LayoutDashboard className="w-5 h-5 mr-2" aria-hidden="true" />
                Painel
              </button>
              <button
                onClick={() => {
                  handleDownloadDocs();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                role="menuitem"
                aria-label="Baixar documentação"
              >
                <FileDown className="w-5 h-5 mr-2" aria-hidden="true" />
                Baixar Documentação
              </button>
              <button
                onClick={toggleTheme}
                className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                role="menuitem"
                aria-label={
                  theme === "dark"
                    ? "Mudar para modo claro"
                    : "Mudar para modo escuro"
                }
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 mr-2" aria-hidden="true" />
                ) : (
                  <Moon className="w-5 h-5 mr-2" aria-hidden="true" />
                )}
                {theme === "dark" ? "Modo claro" : "Modo escuro"}
              </button>
              <div className="pt-3 border-t dark:border-gray-700">
                <div className="text-16 mb-2">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  role="menuitem"
                  aria-label="Sair da sua conta"
                >
                  <LogOut className="w-5 h-5 mr-2" aria-hidden="true" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
        {children}
      </main>
    </div>
  );
};
