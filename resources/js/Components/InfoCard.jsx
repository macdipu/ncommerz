import { TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const iconMap = {
    TruckIcon,
    ShieldCheckIcon,
};

export default function InfoCard({ card }) {
    const renderIcon = () => {
        if (card.icon_type === 'heroicon' && iconMap[card.icon_data]) {
            const IconComponent = iconMap[card.icon_data];
            return <IconComponent className={`h-6 w-6 ${card.text_color} mb-2`} />;
        } else if (card.icon_type === 'svg') {
            return (
                <svg className={`h-6 w-6 ${card.text_color} mb-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path dangerouslySetInnerHTML={{ __html: card.icon_data }} />
                </svg>
            );
        }
        return null;
    };

    return (
        <div className={`flex flex-col items-center p-3 ${card.bg_color} rounded-lg border ${card.border_color} hover:scale-105 transition-transform duration-300 cursor-pointer`}>
            {renderIcon()}
            <div className={`${card.text_color} font-bold text-sm mb-1`}>{card.title}</div>
            <div className="text-xs text-gray-600">{card.subtitle}</div>
        </div>
    );
}
