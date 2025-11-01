import React, { useState } from 'react';
import { 
    MOCK_RAW_MATERIALS, 
    MOCK_RECIPES, 
    MOCK_FINAL_PRODUCTS, 
    MOCK_LABELS, 
    MOCK_PRODUCTION_LOTS,
    MOCK_STOCK_KPI_DATA,
    MOCK_PRODUCTION_KPI_DATA,
    BeakerIcon,
    RecipeIcon,
    PackageIcon,
    TagIcon
} from '../../constants';
import Button from '../ui/Button';
import Table from '../ui/Table';
import type { RawMaterial, ProductionLot } from '../../types';

const InfoCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4 transition-transform hover:scale-105 hover:shadow-lg">
        <div className="bg-[#83C5BE] bg-opacity-20 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const AlertIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

const BarChart = ({ data, title }: { data: { name: string; value: number }[], title: string }) => {
    const maxValue = Math.max(...data.map(d => d.value), 0);
    const chartHeight = 256;
    const barWidth = 30;
    const barMargin = 20;
    const chartWidth = data.length * (barWidth + barMargin);

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>
            <div className="overflow-x-auto">
                <svg width={chartWidth} height={chartHeight + 40} className="font-sans">
                    <g transform="translate(0, 10)">
                        {data.map((d, i) => {
                            const barHeight = maxValue === 0 ? 0 : (d.value / maxValue) * (chartHeight - 20);
                            return (
                                <g key={d.name} className="group">
                                    <rect
                                        x={i * (barWidth + barMargin)}
                                        y={chartHeight - barHeight}
                                        width={barWidth}
                                        height={barHeight}
                                        className="fill-[#006D77] group-hover:fill-[#00545c] transition-colors"
                                    />
                                    <text
                                        x={i * (barWidth + barMargin) + barWidth / 2}
                                        y={chartHeight - barHeight - 5}
                                        textAnchor="middle"
                                        className="text-xs fill-gray-800 font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        {d.value}
                                    </text>
                                    <text
                                        x={i * (barWidth + barMargin) + barWidth / 2}
                                        y={chartHeight + 15}
                                        textAnchor="middle"
                                        className="text-xs fill-gray-500"
                                    >
                                        {d.name}
                                    </text>
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>
        </div>
    );
};

const GroupedBarChart = ({ data, title }: { data: { id: string; name: string; current: number; min: number; }[], title: string }) => {
    const maxValue = Math.max(...data.flatMap(d => [d.current, d.min]), 0);
    const chartHeight = 256;
    const barWidth = 20;
    const groupMargin = 30;
    const chartWidth = data.length * (barWidth * 2 + groupMargin);

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>
            <div className="overflow-x-auto pb-4">
                 <svg width={chartWidth} height={chartHeight + 60} className="font-sans">
                    <g transform="translate(0, 10)">
                        {data.map((d, i) => {
                            const currentBarHeight = maxValue === 0 ? 0 : (d.current / maxValue) * (chartHeight - 20);
                            const minBarHeight = maxValue === 0 ? 0 : (d.min / maxValue) * (chartHeight - 20);
                            const isLowStock = d.current < d.min;
                            return (
                                <g key={d.id} transform={`translate(${i * (barWidth * 2 + groupMargin)}, 0)`}>
                                    <g className="group">
                                        <rect
                                            x={0}
                                            y={chartHeight - currentBarHeight}
                                            width={barWidth}
                                            height={currentBarHeight}
                                            className={`${isLowStock ? 'fill-red-500' : 'fill-[#83C5BE]'} group-hover:opacity-80 transition-opacity`}
                                        />
                                        <text x={barWidth / 2} y={chartHeight - currentBarHeight - 5} textAnchor="middle" className="text-xs fill-gray-800 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">{d.current}</text>
                                    </g>
                                    <g className="group">
                                        <rect
                                            x={barWidth}
                                            y={chartHeight - minBarHeight}
                                            width={barWidth}
                                            height={minBarHeight}
                                            className="fill-gray-300 group-hover:opacity-80 transition-opacity"
                                        />
                                         <text x={barWidth + barWidth / 2} y={chartHeight - minBarHeight - 5} textAnchor="middle" className="text-xs fill-gray-800 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">{d.min}</text>
                                    </g>
                                     <text x={barWidth} y={chartHeight + 15} textAnchor="middle" className="text-xs fill-gray-500" writingMode="vertical-rl" transform={`rotate(180, ${barWidth}, ${chartHeight + 35})`}>
                                        {d.name.length > 20 ? d.name.substring(0, 18) + '...' : d.name}
                                    </text>
                                </g>
                            );
                        })}
                    </g>
                </svg>
                <div className="flex items-center justify-center space-x-4 text-xs mt-2">
                    <div className="flex items-center"><span className="w-3 h-3 bg-[#83C5BE] mr-1.5"></span> Stock Actual</div>
                    <div className="flex items-center"><span className="w-3 h-3 bg-red-500 mr-1.5"></span> Stock Bajo</div>
                    <div className="flex items-center"><span className="w-3 h-3 bg-gray-300 mr-1.5"></span> Stock Mínimo</div>
                </div>
            </div>
        </div>
    );
};

interface DashboardHomeProps {
    onNavigate: (viewId: string) => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ onNavigate }) => {

    const summaryData = [
        { title: 'Total Materias Primas', value: MOCK_RAW_MATERIALS.length, icon: <BeakerIcon className="w-8 h-8 text-[#006D77]" /> },
        { title: 'Total Recetas', value: MOCK_RECIPES.length, icon: <RecipeIcon className="w-8 h-8 text-[#006D77]" /> },
        { title: 'Total Productos Finales', value: MOCK_FINAL_PRODUCTS.length, icon: <PackageIcon className="w-8 h-8 text-[#006D77]" /> },
        { title: 'Total Etiquetas', value: MOCK_LABELS.length, icon: <TagIcon className="w-8 h-8 text-[#006D77]" /> },
    ];

    const lowStockMaterials = MOCK_RAW_MATERIALS.filter(m => m.currentStock < m.minStock);
    
    const getLotCriticality = (expiryDate: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiry = new Date(expiryDate);
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { level: 'critical', text: `Vencido hace ${Math.abs(diffDays)} días`, color: 'text-red-600' };
        if (diffDays <= 7) return { level: 'critical', text: `Vence en ${diffDays} días`, color: 'text-red-600' };
        if (diffDays <= 30) return { level: 'warning', text: `Vence en ${diffDays} días`, color: 'text-orange-600' };
        return { level: 'ok', text: 'OK' };
    };

    const expiringLots = MOCK_PRODUCTION_LOTS
        .map(lot => ({ ...lot, criticality: getLotCriticality(lot.expiryDate) }))
        .filter(lot => lot.criticality.level !== 'ok')
        .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

    const totalAlerts = lowStockMaterials.length + expiringLots.length;

    const lowStockColumns = [
        { header: 'Nombre', accessor: 'name' as keyof RawMaterial },
        { header: 'Cantidad Actual', accessor: 'currentStock' as keyof RawMaterial, render: (item: RawMaterial) => `${item.currentStock} ${item.unit}` },
        { header: 'Stock Mínimo', accessor: 'minStock' as keyof RawMaterial, render: (item: RawMaterial) => `${item.minStock} ${item.unit}` },
        { header: 'Acción', accessor: 'id' as keyof RawMaterial, render: () => <Button size="sm" onClick={() => onNavigate('raw-materials-list')}>Reabastecer</Button> },
    ];

    const expiringLotsColumns = [
        { header: 'Producto', accessor: 'finalProductId' as keyof ProductionLot, render: (item: ProductionLot) => MOCK_FINAL_PRODUCTS.find(p => p.id === item.finalProductId)?.name || 'N/A' },
        { header: 'Lote', accessor: 'lotNumber' as keyof ProductionLot },
        { header: 'Fecha de Caducidad', accessor: 'expiryDate' as keyof ProductionLot },
        { header: 'Estado', accessor: 'id' as keyof ProductionLot, render: (item: any) => <span className={`font-semibold ${item.criticality.color}`}>{item.criticality.text}</span> },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button size="lg" onClick={() => onNavigate('recipes-create')}>Crear Nueva Receta</Button>
                <Button size="lg" onClick={() => onNavigate('products-create')}>Crear Nuevo Producto</Button>
                <Button size="lg" onClick={() => onNavigate('labels-create')}>Generar Etiqueta</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {summaryData.map(item => <InfoCard key={item.title} title={item.title} value={item.value} icon={item.icon} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GroupedBarChart data={MOCK_STOCK_KPI_DATA} title="Stock Actual vs. Mínimo (KPIs)" />
                <BarChart data={MOCK_PRODUCTION_KPI_DATA} title="Producción Mensual (Lotes por Semana)" />
            </div>

            <div>
                 <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    Alertas y Advertencias
                    {totalAlerts > 0 && (
                        <span className="ml-3 bg-red-500 text-white text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full">
                            {totalAlerts}
                        </span>
                    )}
                </h2>
                <div className="space-y-6">
                    {lowStockMaterials.length > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="font-semibold text-red-600 mb-3 flex items-center"><AlertIcon className="w-5 h-5 mr-2"/>Materias Primas Bajo Stock</h3>
                            <Table<RawMaterial> columns={lowStockColumns} data={lowStockMaterials} />
                        </div>
                    )}
                     {expiringLots.length > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="font-semibold text-orange-600 mb-3 flex items-center"><AlertIcon className="w-5 h-5 mr-2"/>Productos Próximos a Vencer</h3>
                            <Table<any> columns={expiringLotsColumns} data={expiringLots} />
                        </div>
                    )}
                    {totalAlerts === 0 && (
                        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                           <p>¡Todo en orden! No hay alertas pendientes.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;