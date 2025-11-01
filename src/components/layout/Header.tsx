import React from 'react';
import type { User } from '../../types.ts';
import { UserCircleIcon } from '../../constants';

interface HeaderProps {
    onMenuClick: () => void;
    pageTitle: string;
    user: User;
}

const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({ onMenuClick, pageTitle, user }) => {

    return (
        <header className="sticky top-0 bg-white shadow-sm z-20">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <div className="flex items-center">
                    <button onClick={onMenuClick} className="text-gray-500 focus:outline-none lg:hidden mr-4">
                        <MenuIcon className="h-6 w-6" />
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-800">{pageTitle}</h1>
                </div>

                <div className="flex items-center space-x-4">
                    {/* User Info */}
                    <div className="flex items-center space-x-2">
                        <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=f3f4f6&color=1f2937`} alt="User Avatar" className="w-8 h-8 rounded-full" />
                        <span className="font-medium text-gray-700 hidden sm:block">{user.name}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;