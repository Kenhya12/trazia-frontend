import React from 'react';
import type { RawMaterial, RawMaterialLot, Supplier, Recipe, FinalProduct, ProductionLot, RetentionFactor, Company, User, ProductLabel } from './types.ts';

export const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
);
export const ChartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" /></svg>
);
export const BeakerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.512 1.424l-1.422 1.422a2.25 2.25 0 00-.635 1.591v2.812c0 .597.237 1.17.659 1.591l2.428 2.428c.422.422 1.002.659 1.591.659h3.634c.597 0 1.17-.237 1.591-.659l2.428-2.428a2.251 2.251 0 00.659-1.591v-2.812c0-.597-.237-1.17-.659-1.591L15.5 11.666a2.25 2.25 0 01-.512-1.424V3.104a2.25 2.25 0 00-2.25-2.25H12a2.25 2.25 0 00-2.25 2.25z" /></svg>
);
export const RecipeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
);
export const PackageIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.383-.028.765-.028 1.148 0 .542.043 1.048.214 1.48.512 1.29.678 1.977 2.053 1.977 3.483V7.5M8.25 7.5h7.5M8.25 7.5V3.75c0-1.5 1.5-2.25 3-2.25s3 .75 3 2.25V7.5m-9 3l-1.923-1.923a.75.75 0 010-1.061l4.5-4.5a.75.75 0 011.06 0l4.5 4.5a.75.75 0 010 1.06L15.75 10.5m-9 3h7.5M6 12l.75 6.75h10.5L18 12M6 12h12" />
    </svg>
);
export const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.228a4.5 4.5 0 00-4.306 6.035A8.966 8.966 0 003.75 18a9.094 9.094 0 008.25-3.75m9 0a9 9 0 00-9-9m0 9v5.25m0-5.25H5.25M9 9.75a3.375 3.375 0 01-3.375-3.375A3.375 3.375 0 019 3.375a3.375 3.375 0 013.375 3.375A3.375 3.375 0 019 9.75z" /></svg>
);
export const CogIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5" /></svg>
);
export const ImageIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);
export const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
export const BellAlertIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M12 6.75v.007v-.007z" />
    </svg>
);
export const CalculatorIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
export const UserCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
export const TagIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
);
export const DocumentReportIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
export const QuestionMarkCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
);
export const ListBulletIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);
export const PlusCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
export const ClipboardListIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
export const CubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9.75L3 12m0 0l9 5.25m9-5.25l-9 5.25M3 12l9-5.25" />
    </svg>
);
export const PencilIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);
export const ArrowsRightLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h18m-7.5-12L21 9m0 0L16.5 12M21 9H3" />
    </svg>
);
export const BuildingOfficeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 11.25h6m-6 4.5h6M6.75 21v-2.25a2.25 2.25 0 012.25-2.25h6a2.25 2.25 0 012.25 2.25V21M6.75 3v2.25a2.25 2.25 0 002.25 2.25h6A2.25 2.25 0 0017.25 5.25V3" />
    </svg>
);
export const LockClosedIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);
export const PaintBrushIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m0 0a2.25 2.25 0 012.4-2.245 4.5 4.5 0 008.4-2.245 3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245m0 0a4.5 4.5 0 00-2.4-2.245 3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245" />
    </svg>
);
export const BookOpenIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);



export const SIDEBAR_CONFIG = [
    {
        id: 'dashboard',
        name: 'Dashboard',
        icon: <HomeIcon className="w-5 h-5" />,
        children: [],
    },
    {
        id: 'raw-materials-main',
        name: 'Abastecimiento & Stock',
        icon: <BeakerIcon className="w-5 h-5" />,
        children: [
            { id: 'raw-materials-list', name: 'Materia Prima', parentId: 'raw-materials-main' },
            { id: 'raw-materials-create', name: '+ Nuevo Insumo', parentId: 'raw-materials-main' },
            { id: 'raw-material-batches', name: 'Gestión de lotes', parentId: 'raw-materials-main' },
        ],
    },
    {
        id: 'recipes-main',
        name: 'Recetas',
        icon: <RecipeIcon className="w-5 h-5" />,
        children: [
            { id: 'recipes-list', name: 'Listado de Recetas', parentId: 'recipes-main' },
            { id: 'recipes-create', name: 'Crear Nueva Receta', parentId: 'recipes-main' },
        ]
    },
    {
        id: 'products-main',
        name: 'Productos Finales',
        icon: <PackageIcon className="w-5 h-5" />,
        children: [
            { id: 'products-list', name: 'Listado de Productos', parentId: 'products-main' },
            { id: 'products-create', name: 'Crear Nuevo Producto', parentId: 'products-main' },
            { id: 'production-lots', name: 'Lotes de Fabricación', parentId: 'products-main' },
        ]
    },
    {
        id: 'labels-main',
        name: 'Etiquetas',
        icon: <TagIcon className="w-5 h-5" />,
        children: [
            { id: 'labels-list', name: 'Listado de Etiquetas', parentId: 'labels-main' },
            { id: 'labels-create', name: 'Crear Nueva Etiqueta', parentId: 'labels-main' },
        ],
    },
    {
        id: 'reports-main',
        name: 'Reportes',
        icon: <DocumentReportIcon className="w-5 h-5" />,
        children: [
            { id: 'reports-inventory', name: 'Inventario', parentId: 'reports-main' },
            { id: 'reports-production', name: 'Producción', parentId: 'reports-main' },
        ]
    },
    {
        id: 'config-main',
        name: 'Configuración',
        icon: <CogIcon className="w-5 h-5" />,
        children: [
            { id: 'config-company', name: 'Datos de la Empresa', parentId: 'config-main' },
            { id: 'config-users', name: 'Usuarios y Permisos', parentId: 'config-main' },
            { id: 'config-prefs', name: 'Preferencias', parentId: 'config-main' },
        ]
    },
    {
        id: 'help',
        name: 'Ayuda',
        icon: <QuestionMarkCircleIcon className="w-5 h-5" />,
        children: [],
    },
];

const today = new Date();
const getDateString = (daysOffset: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
};

export const MOCK_SUPPLIERS: Supplier[] = [
    { id: 'S001', name: 'Harinas del Segura S.L.' },
    { id: 'S002', name: 'Lácteos La Pastora' },
    { id: 'S003', name: 'Frutas y Verduras El Huerto' },
    { id: 'S004', name: 'Chocolates Valor S.A.' },
    { id: 'S005', name: 'Azucarera Española' },
];

/* export const MOCK_RAW_MATERIALS: RawMaterial[] = [
    { id: 'HT000', name: 'Harina de Trigo (Todo uso)', supplierId: 'S001', internalCode: 'HT000', unit: 'kg', category: 'Harinas', minStock: 50, currentStock: 120 },
    { id: 'HTF', name: 'Harina de Fuerza', supplierId: 'S001', internalCode: 'HTF', unit: 'kg', category: 'Harinas', minStock: 100, currentStock: 85 },
    { id: 'AZB', name: 'Azúcar Blanco', supplierId: 'S005', internalCode: 'AZB', unit: 'kg', category: 'Endulzantes', minStock: 40, currentStock: 50 },
    { id: 'AZM', name: 'Azúcar Moreno', supplierId: 'S005', internalCode: 'AZM', unit: 'kg', category: 'Endulzantes', minStock: 25, currentStock: 15 },
    { id: 'MAN', name: 'Mantequilla sin sal', supplierId: 'S002', internalCode: 'MAN', unit: 'kg', category: 'Lácteos', minStock: 20, currentStock: 22 },
    { id: 'HUE', name: 'Huevos Camperos (ud)', supplierId: 'S002', internalCode: 'HUE', unit: 'unit', category: 'Huevos', minStock: 100, currentStock: 150 },
    { id: 'LCH', name: 'Leche Entera', supplierId: 'S002', internalCode: 'LCH', unit: 'L', category: 'Lácteos', minStock: 30, currentStock: 45 },
    { id: 'CCH', name: 'Chips de Chocolate Negro 70%', supplierId: 'S004', internalCode: 'CCH', unit: 'kg', category: 'Chocolates', minStock: 10, currentStock: 5 },
    { id: 'LEV', name: 'Levadura Fresca', supplierId: 'S001', internalCode: 'LEV', unit: 'g', category: 'Levaduras', minStock: 500, currentStock: 800 },
    { id: 'SAL', name: 'Sal Marina Fina', supplierId: 'S005', internalCode: 'SAL', unit: 'g', category: 'Especias', minStock: 2000, currentStock: 3500 },
    { id: 'MZN', name: 'Manzanas Golden', supplierId: 'S003', internalCode: 'MZN', unit: 'kg', category: 'Frutas', minStock: 15, currentStock: 12 },
    { id: 'AGU', name: 'Agua Filtrada', supplierId: 'S001', internalCode: 'AGU', unit: 'L', category: 'Líquidos', minStock: 100, currentStock: 250 },
]; */

export const MOCK_RAW_MATERIALS = [
    { id: 1, name: "Harina de Trigo", unit: "kg" },
    { id: 2, name: "Aceite de Girasol", unit: "L" },
    { id: 3, name: "Alcohol Etílico", unit: "ml" },
    { id: 4, name: "Agua Desmineralizada", unit: "L" },
    { id: 5, name: "Fragancia Floral", unit: "ml" }
];

export const MOCK_BATCHES: RawMaterialLot[] = [
    { id: 'B001', lotNumber: 'LOTE-H001-20231028', rawMaterialId: 'HT000', supplierId: 'S001', quantity: 50, purchaseDate: getDateString(-30), receptionDate: getDateString(-28), expiryDate: getDateString(15) },
    { id: 'B002', lotNumber: 'LOTE-A002-20231025', rawMaterialId: 'AZM', supplierId: 'S005', quantity: 20, purchaseDate: getDateString(-33), receptionDate: getDateString(-31), expiryDate: getDateString(45) },
    { id: 'B003', lotNumber: 'LOTE-C003-20230915', rawMaterialId: 'CCH', supplierId: 'S004', quantity: 10, purchaseDate: getDateString(-50), receptionDate: getDateString(-48), expiryDate: getDateString(-5) },
];


export const MOCK_FINAL_PRODUCTS: FinalProduct[] = [
    { id: 'FP001', name: 'Galletas de Chocolate Premium', internalCode: 'GAL-CHP-PREM', category: 'Bollería' },
    { id: 'FP002', name: 'Pan Rústico de Campo', internalCode: 'PAN-RUST-CAM', category: 'Panadería' },
    { id: 'FP003', name: 'Croissant de Mantequilla', internalCode: 'CRO-MAN', category: 'Bollería' },
    { id: 'FP004', name: 'Baguette Clásica', internalCode: 'BAG-CLA', category: 'Panadería' },
    { id: 'FP005', name: 'Tarta de Manzana', internalCode: 'TAR-MZN', category: 'Pastelería' },
];

export const MOCK_RECIPES: Recipe[] = [
    { id: 'R001', name: 'Galletas Choco-Chip', description: 'Galletas clásicas con chips de chocolate', retentionFactor: 0.9, finalProductId: 'FP001', process: '1. Mezclar secos. 2. Añadir húmedos. 3. Formar galletas. 4. Hornear a 180°C por 12 minutos.', observations: 'Usar chocolate de alta calidad para mejor sabor.', ingredients: [{ rawMaterialId: 'HT000', quantityGrams: 200 }, { rawMaterialId: 'AZM', quantityGrams: 100 }, { rawMaterialId: 'CCH', quantityGrams: 150 }, { rawMaterialId: 'MAN', quantityGrams: 100 }, { rawMaterialId: 'HUE', quantityGrams: 1 }], lastUpdated: getDateString(-2) },
    { id: 'R002', name: 'Pan de Masa Madre', description: 'Pan rústico de fermentación lenta', retentionFactor: 0.85, finalProductId: 'FP002', process: '1. Autolisis. 2. Amasado y pliegues. 3. Fermentación. 4. Horneado.', observations: 'Controlar la temperatura es clave.', ingredients: [{ rawMaterialId: 'HTF', quantityGrams: 500 }, { rawMaterialId: 'AGU', quantityGrams: 350 }, { rawMaterialId: 'SAL', quantityGrams: 10 }], lastUpdated: getDateString(-3) },
    { id: 'R003', name: 'Masa de Croissant', description: 'Masa hojaldrada para croissants', retentionFactor: 0.88, finalProductId: 'FP003', process: '1. Amasado inicial. 2. Laminado con mantequilla (3 pliegues). 3. Reposo en frío. 4. Formado. 5. Fermentación final. 6. Horneado.', observations: 'Mantener la masa y la mantequilla frías es crucial.', ingredients: [{ rawMaterialId: 'HTF', quantityGrams: 1000 }, { rawMaterialId: 'MAN', quantityGrams: 500 }, { rawMaterialId: 'LCH', quantityGrams: 250 }, { rawMaterialId: 'AZB', quantityGrams: 80 }, { rawMaterialId: 'LEV', quantityGrams: 40 }], lastUpdated: getDateString(-5) },
    { id: 'R004', name: 'Masa de Baguette', description: 'Masa para baguette francesa tradicional', retentionFactor: 0.8, finalProductId: 'FP004', process: '1. Mezcla y autolisis. 2. Amasado corto. 3. Fermentación con pliegues. 4. Preformado y formado. 5. Fermentación final. 6. Horneado con vapor.', observations: 'El vapor al inicio del horneado es esencial para la corteza.', ingredients: [{ rawMaterialId: 'HTF', quantityGrams: 1000 }, { rawMaterialId: 'AGU', quantityGrams: 700 }, { rawMaterialId: 'SAL', quantityGrams: 20 }, { rawMaterialId: 'LEV', quantityGrams: 10 }], lastUpdated: getDateString(-1) },
    { id: 'R005', name: 'Relleno y Montaje de Tarta de Manzana', description: 'Receta para tarta de manzana clásica', retentionFactor: 0.92, finalProductId: 'FP005', process: '1. Pelar y cortar manzanas. 2. Cocinar con azúcar y canela. 3. Forrar molde con masa quebrada. 4. Rellenar y cubrir. 5. Hornear hasta dorar.', observations: 'Usar manzanas que mantengan su forma al hornear.', ingredients: [{ rawMaterialId: 'MZN', quantityGrams: 1500 }, { rawMaterialId: 'AZM', quantityGrams: 150 }, { rawMaterialId: 'MAN', quantityGrams: 50 }], lastUpdated: getDateString(-10) },
];

const generateProductionLots = (): ProductionLot[] => {
    const lots: ProductionLot[] = [];
    let lotCounter = 1;
    for (let i = 28; i >= 0; i--) { // Last 4 weeks
        const elaborationDate = getDateString(-i);
        const productIndex = i % MOCK_FINAL_PRODUCTS.length;
        const product = MOCK_FINAL_PRODUCTS[productIndex];
        const recipe = MOCK_RECIPES.find(r => r.finalProductId === product.id);
        if (recipe) {
            const numLots = Math.floor(Math.random() * 3) + 1; // 1 to 3 lots per day
            for (let j = 0; j < numLots; j++) {
                const expiryDays = product.category === 'Panadería' ? 5 + Math.floor(Math.random() * 3) : 20 + Math.floor(Math.random() * 10);
                const expiryDate = getDateString(-i + expiryDays);
                lots.push({
                    id: `PL${lotCounter++}`,
                    lotNumber: `P${elaborationDate.replace(/-/g, '')}-${j + 1}`,
                    finalProductId: product.id,
                    recipeId: recipe.id,
                    elaborationDate: elaborationDate,
                    expiryDate: expiryDate,
                });
            }
        }
    }
    return lots;
};

export const MOCK_PRODUCTION_LOTS: ProductionLot[] = generateProductionLots();


export const MOCK_RETENTION_FACTORS: RetentionFactor[] = [
    { id: 'RF001', name: 'Horneado General (Panadería)', factor: 0.90 },
    { id: 'RF002', name: 'Fritura Profunda', factor: 0.85 },
    { id: 'RF003', name: 'Cocción Lenta (Estofado)', factor: 0.75 },
    { id: 'RF004', name: 'Deshidratación', factor: 0.30 },
];

export const MOCK_COMPANY: Company = {
    name: 'Delicias Caseras S.L.',
    taxId: 'B12345678',
    address: 'Calle de la Repostería, 42, 28001 Madrid, España',
    country: 'España',
    email: 'contacto@deliciascaseras.com',
    phone: '+34 912 345 678',
    sector: 'Alimentación - Panadería y Repostería',
    logoUrl: null,
};

export const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Usuario Demo', email: 'admin@trazia.com', role: 'admin', avatarUrl: null, hasCompanySetup: true },
    { id: 'u2', name: 'Juan Pérez', email: 'juan.perez@operario.com', role: 'operator', avatarUrl: null, hasCompanySetup: true },
    { id: 'u3', name: 'Ana García', email: 'ana.garcia@operario.com', role: 'operator', avatarUrl: null, hasCompanySetup: true },
];

export const MOCK_LABELS: ProductLabel[] = [
    { id: 'LBL001', productName: 'Galletas de Chocolate Premium', ingredients: 'Harina de TRIGO, Azúcar, Chips de chocolate (pasta de cacao, azúcar, lecitina de SOJA), MANTEQUILLA (LECHE), HUEVO, Vainilla.', netQuantity: '200g', instructions: 'Conservar en lugar fresco y seco.', expiryDate: '2024-12-31', lotNumber: 'P20231028-1', companyName: 'Delicias Caseras S.L.', companyAddress: 'Calle de la Repostería, 42, 28001 Madrid, España', companyContact: 'contacto@deliciascaseras.com', warnings: 'Puede contener trazas de FRUTOS DE CÁSCARA.', allergens: ['trigo', 'soja', 'mantequilla', 'leche', 'huevo', 'frutos de cáscara'], originCountry: 'España', symbols: ['recycling'], barcode: '8412345678901', language: 'es', version: 2, status: 'approved' },
    { id: 'LBL002', productName: 'Pan Rústico de Campo', ingredients: 'Harina de TRIGO de fuerza, Agua, Sal marina.', netQuantity: '500g', instructions: 'Ideal para tostadas. Hornear 5 min a 200°C para corteza crujiente.', expiryDate: '2024-11-05', lotNumber: 'P20231027-2', companyName: 'Delicias Caseras S.L.', companyAddress: 'Calle de la Repostería, 42, 28001 Madrid, España', companyContact: 'contacto@deliciascaseras.com', warnings: '', allergens: ['trigo'], originCountry: 'España', symbols: ['recycling', 'vegan'], barcode: '8412345678902', language: 'es', version: 1, status: 'draft' },
    { id: 'LBL003', productName: 'Croissant de Mantequilla', ingredients: 'Harina de TRIGO, MANTEQUILLA (LECHE) (30%), Agua, Azúcar, Levadura, HUEVO, Sal.', netQuantity: '6 unidades (300g)', instructions: 'Calentar 2-3 minutos en horno a 180°C para una experiencia óptima.', expiryDate: '2024-11-03', lotNumber: 'P20231026-1', companyName: 'Delicias Caseras S.L.', companyAddress: 'Calle de la Repostería, 42, 28001 Madrid, España', companyContact: 'contacto@deliciascaseras.com', warnings: 'Puede contener trazas de SOJA y FRUTOS DE CÁSCARA.', allergens: ['trigo', 'leche', 'huevo', 'soja', 'frutos de cáscara'], originCountry: 'España', symbols: ['recycling'], barcode: '8412345678903', language: 'es', version: 1, status: 'published' },
];

// Data for Dashboard KPIs
export const MOCK_STOCK_KPI_DATA = MOCK_RAW_MATERIALS
    .filter(m => ['HTF', 'MAN', 'AZM', 'CCH', 'MZN'].includes(m.id))
    .map(m => ({
        id: m.id,
        name: m.name,
        current: m.currentStock,
        min: m.minStock,
    }));

export const MOCK_PRODUCTION_KPI_DATA = (() => {
    const weeks: { [key: string]: number } = { 'Semana 4': 0, 'Semana 3': 0, 'Semana 2': 0, 'Semana 1': 0 };
    const today = new Date();
    MOCK_PRODUCTION_LOTS.forEach(lot => {
        const lotDate = new Date(lot.elaborationDate);
        const diffDays = (today.getTime() - lotDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays >= 0 && diffDays < 7) weeks['Semana 1']++;
        else if (diffDays >= 7 && diffDays < 14) weeks['Semana 2']++;
        else if (diffDays >= 14 && diffDays < 21) weeks['Semana 3']++;
        else if (diffDays >= 21 && diffDays < 28) weeks['Semana 4']++;
    });
    return Object.entries(weeks).map(([name, value]) => ({ name, value })).reverse();
})();

