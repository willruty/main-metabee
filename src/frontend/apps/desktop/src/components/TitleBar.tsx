import { useState, useEffect } from "react";
import { Minus, Square, X, Maximize2 } from "lucide-react";
import logo from "@/assets/logo-removebg-preview.png";

// Declaração de tipos para a API do Electron
declare global {
  interface Window {
    electronAPI?: {
      minimizeWindow: () => Promise<void>;
      maximizeWindow: () => Promise<void>;
      restoreWindow: () => Promise<void>;
      closeWindow: () => Promise<void>;
      isMaximized: () => Promise<boolean>;
      onWindowMaximize: (callback: () => void) => () => void;
      onWindowUnmaximize: (callback: () => void) => () => void;
    };
  }
}

export function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Verificar se está no Electron
    console.log("🔍 TitleBar: Verificando window.electronAPI...", !!window.electronAPI);
    
    if (!window.electronAPI) {
      console.log("⚠️ TitleBar: window.electronAPI não encontrado");
      setIsElectron(false);
      return;
    }

    setIsElectron(true);
    console.log("✅ TitleBar: window.electronAPI encontrado!");

    // Verificar estado inicial
    window.electronAPI.isMaximized().then((maximized) => {
      setIsMaximized(maximized);
      console.log("📐 TitleBar: Estado inicial - maximized:", maximized);
    }).catch((err) => {
      console.error("❌ TitleBar: Erro ao verificar estado:", err);
    });

    // Ouvir mudanças no estado
    const unsubscribeMaximize = window.electronAPI.onWindowMaximize(() => {
      setIsMaximized(true);
      console.log("📐 TitleBar: Janela maximizada");
    });

    const unsubscribeUnmaximize = window.electronAPI.onWindowUnmaximize(() => {
      setIsMaximized(false);
      console.log("📐 TitleBar: Janela restaurada");
    });

    return () => {
      unsubscribeMaximize();
      unsubscribeUnmaximize();
    };
  }, []);

  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimizeWindow();
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI) {
      if (isMaximized) {
        window.electronAPI.restoreWindow();
      } else {
        window.electronAPI.maximizeWindow();
      }
    }
  };

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.closeWindow();
    }
  };

  return (
    <div 
      className="h-9 bg-brand-surface border-b border-brand-border flex items-center justify-between select-none fixed top-0 left-0 right-0 w-full flex-shrink-0"
      style={{ display: 'flex', minHeight: '36px', zIndex: 9999 }}
    >
      {/* Logo e título à esquerda - região arrastável */}
      <div className="flex items-center gap-2 px-3 drag-region flex-shrink-0 flex-1 min-w-0">
        <img 
          src={logo} 
          alt="MetaStation" 
          className="h-8 w-8 flex-shrink-0"
        />
        <span className="text-sm font-semibold text-foreground whitespace-nowrap">MetaStation</span>
      </div>

      {/* Botões de controle à direita - estilo Postman */}
      <div 
        className="no-drag flex items-stretch h-full flex-shrink-0" 
        style={{ 
          pointerEvents: 'auto', 
          zIndex: 10000,
          display: 'flex',
          visibility: 'visible',
          opacity: 1
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("🔘 Botão Minimizar clicado");
            handleMinimize();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          disabled={!isElectron}
          className="no-drag h-full w-12 flex items-center justify-center hover:bg-brand-surface-hover active:bg-brand-surface-hover transition-colors group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          style={{ 
            minWidth: '48px', 
            display: 'flex', 
            pointerEvents: 'auto', 
            zIndex: 10001,
            visibility: 'visible',
            opacity: isElectron ? 1 : 0.5
          }}
          title="Minimizar"
        >
          <Minus className="h-4 w-4 text-foreground group-hover:text-foreground" style={{ display: 'block' }} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("🔘 Botão Maximizar clicado");
            handleMaximize();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          disabled={!isElectron}
          className="no-drag h-full w-12 flex items-center justify-center hover:bg-brand-surface-hover active:bg-brand-surface-hover transition-colors group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          style={{ 
            minWidth: '48px', 
            display: 'flex', 
            pointerEvents: 'auto', 
            zIndex: 10001,
            visibility: 'visible',
            opacity: isElectron ? 1 : 0.5
          }}
          title={isMaximized ? "Restaurar" : "Maximizar"}
        >
          {isMaximized ? (
            <Maximize2 className="h-3.5 w-3.5 text-foreground group-hover:text-foreground" style={{ display: 'block' }} />
          ) : (
            <Square className="h-3.5 w-3.5 text-foreground group-hover:text-foreground" style={{ display: 'block' }} />
          )}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("🔘 Botão Fechar clicado");
            handleClose();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          disabled={!isElectron}
          className="no-drag h-full w-12 flex items-center justify-center hover:bg-red-500 hover:text-white active:bg-red-600 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          style={{ 
            minWidth: '48px', 
            display: 'flex', 
            pointerEvents: 'auto', 
            zIndex: 10001,
            visibility: 'visible',
            opacity: isElectron ? 1 : 0.5
          }}
          title="Fechar"
        >
          <X className="h-4 w-4 text-foreground group-hover:text-white" style={{ display: 'block' }} />
        </button>
      </div>
    </div>
  );
}

