import React, { useState } from 'react';
import { SIDEBAR_CONFIG } from '../../constants';
import type { User } from '../../types.ts';

interface SidebarProps {
  onLogout: () => void;
  activeView: string;
  onNavigate: (viewId: string) => void;
  user: User;
  isOpen: boolean;
  onToggle: () => void;
}

const LogoutIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
);

const TraziaIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props} className="w-8 h-8 text-white">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9.75l-9-5.25m9 5.25v9.75" />
    </svg>
);

const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
);

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const NavItem = ({ item, isOpen, activeView, onNavigate, isSubItem = false }: { item: { name: string, icon?: React.ReactNode, id: string }, isOpen: boolean, activeView: string, onNavigate: (id: string) => void, isSubItem?: boolean }) => {
    const isActive = activeView === item.id;
    return (
        <li className="relative group">
            <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center p-3 my-1 rounded-md transition-colors duration-200 text-left ${
                    isActive
                        ? 'bg-[#006D77] text-white'  // secondary-dark
                        : 'text-white hover:bg-[#5ca7a0] hover:text-white'  // secondary-200 y primary-dark
                } ${!isOpen && 'justify-center'} ${isSubItem && 'pl-8'}`}
            >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span 
                    className={`whitespace-nowrap transition-all duration-200 ${isSubItem ? 'ml-3' : 'ml-3'} ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}
                >
                    {item.name}
                </span>
            </button>
            {!isOpen && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-[#83C5BE] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {item.name}
                </div>
            )}
        </li>
    );
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, activeView, onNavigate, user, isOpen, onToggle }) => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  
  const activeParent = SIDEBAR_CONFIG.find(section => section.children.some(child => child.id === activeView))?.id;

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => {
        const newSet = new Set(prev);
        if (newSet.has(sectionId)) {
            newSet.delete(sectionId);
        } else {
            newSet.add(sectionId);
        }
        return newSet;
    });
  };

  const sidebarBaseClasses = "fixed inset-y-0 left-0 bg-[#006D77] text-white flex-col z-30 transition-all duration-300 ease-in-out";
  const sidebarWidthClass = isOpen ? 'w-64' : 'w-0 lg:w-20';
  const visibilityClass = isOpen ? 'flex' : 'hidden lg:flex';

  return (
    <aside className={`${sidebarBaseClasses} ${sidebarWidthClass} ${visibilityClass}`}>
      <div className="p-4 border-b border-[#83C5BE] flex items-center justify-between min-h-[64px]">
        <div className={`flex items-center overflow-hidden ${!isOpen && 'justify-center w-full'}`}>
          <TraziaIcon />
          <h1 className={`font-bold text-xl text-white ml-2 whitespace-nowrap transition-all duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>Trazia</h1>
        </div>
        <button onClick={onToggle} className="hidden lg:block p-1 text-[#83C5BE] hover:text-white rounded-full hover:bg-[#83C5BE]">
          <ChevronLeftIcon className={`w-6 h-6 transition-transform duration-300 ${!isOpen && 'rotate-180'}`} />
        </button>
      </div>
      
      <nav className="flex-grow p-2 overflow-y-auto">
        <ul>
          {SIDEBAR_CONFIG.map((section, index) => (
            <React.Fragment key={section.id}>
              <li>
                <button
                  onClick={() => section.children.length > 0 ? toggleSection(section.id) : onNavigate(section.id)}
                  className={`w-full flex items-center p-3 my-1 rounded-md transition-colors duration-200 text-left ${
                    (activeView === section.id || activeParent === section.id)
                      ? 'bg-[#83C5BE] text-white' 
                      : 'text-white hover:bg-[#5ca7a0] hover:text-white'
                  } ${!isOpen && 'justify-center'}`}
                >
                  <span className="flex-shrink-0">{section.icon}</span>
                  <span className={`flex-1 ml-3 whitespace-nowrap transition-all duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>{section.name}</span>
                  {isOpen && section.children.length > 0 && (
                    <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${openSections.has(section.id) ? 'rotate-180' : ''}`} />
                  )}
                </button>
                {isOpen && openSections.has(section.id) && (
                  <ul className="pl-4 border-l border-[#83C5BE] ml-4">
                    {section.children.map(child => (
                      <NavItem key={child.id} item={child} isOpen={isOpen} activeView={activeView} onNavigate={onNavigate} isSubItem />
                    ))}
                  </ul>
                )}
              </li>
              {index < SIDEBAR_CONFIG.length - 1 && <hr className="border-t border-[#83C5BE] my-2" />}
            </React.Fragment>
          ))}
        </ul>
      </nav>

      <div className="p-2 border-t border-[#83C5BE]">
        <button
          onClick={onLogout}
          className={`w-full flex items-center p-3 rounded-md bg-[#E76F51] hover:bg-[#c65b42] text-white transition-colors duration-200 ${!isOpen && 'justify-center'}`}
        >
          <LogoutIcon className="w-5 h-5 flex-shrink-0"/>
          <span className={`ml-3 whitespace-nowrap transition-all duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;