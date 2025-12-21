import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Bars3Icon, 
    XMarkIcon,
    HomeIcon,
    ShoppingBagIcon,
    ClipboardDocumentListIcon,
    UsersIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    PhotoIcon,
    RectangleStackIcon,
    TagIcon,
    ExclamationTriangleIcon,
    CodeBracketIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function AdminLayout({ children }) {
    const { auth, orderCounts = {}, settings = {} } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: HomeIcon },
        { name: 'Products', href: '/admin/products', icon: ShoppingBagIcon },
        { name: 'Manage Categories', href: '/admin/categories', icon: TagIcon },
        { 
            name: 'Orders', 
            href: '/admin/orders', 
            icon: ClipboardDocumentListIcon,
            count: orderCounts.pending || 0
        },
        { 
            name: 'Incomplete Orders', 
            href: '/admin/incomplete-orders', 
            icon: ExclamationTriangleIcon,
            count: orderCounts.incomplete || 0
        },
        { name: 'Invoices', href: '/admin/invoices', icon: DocumentTextIcon },
        { name: 'Customers', href: '/admin/customers', icon: UsersIcon },
        { name: 'Sliders', href: '/admin/sliders', icon: PhotoIcon },
        { name: 'Banners', href: '/admin/banners', icon: RectangleStackIcon },
        { name: 'API & Docs', href: '/admin/api-docs', icon: CodeBracketIcon },
        { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
                <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white overflow-hidden">
                    <div className="flex h-16 items-center justify-between px-4 border-b">
                        {settings.logo ? (
                            <img 
                                src={`/storage/${settings.logo}`} 
                                alt="Admin" 
                                className="h-16 w-auto"
                            />
                        ) : (
                            <h1 className="text-xl font-bold text-gradient">{settings.store_name || 'Admin Panel'}</h1>
                        )}
                        <button onClick={() => setSidebarOpen(false)}>
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <nav className="flex-1 px-4 py-4 overflow-y-auto">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-2"
                            >
                                <div className="flex items-center">
                                    <item.icon className="h-5 w-5 mr-3" />
                                    {item.name}
                                </div>
                                {item.count > 0 && (
                                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                        {item.count}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col bg-white border-r h-full overflow-hidden">
                    <div className="flex h-16 items-center px-6 border-b">
                        {settings.logo ? (
                            <img 
                                src={`/storage/${settings.logo}`} 
                                alt="Admin" 
                                className="h-16 w-auto"
                            />
                        ) : (
                            <h1 className="text-xl font-bold text-gradient">{settings.store_name || 'Admin Panel'}</h1>
                        )}
                    </div>
                    <nav className="flex-1 px-4 py-4 overflow-y-auto">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-2 transition-colors"
                            >
                                <div className="flex items-center">
                                    <item.icon className="h-5 w-5 mr-3" />
                                    {item.name}
                                </div>
                                {item.count > 0 && (
                                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                        {item.count}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>
                    <div className="p-4 border-t">
                        <Link
                            href="/logout"
                            method="post"
                            className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                            Logout
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Mobile header */}
                <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 text-gray-600 hover:text-gray-900"
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                    <h1 className="text-lg font-bold text-gradient">{settings.store_name || 'Admin Panel'}</h1>
                    <div className="w-10"></div> {/* Spacer for centering */}
                </div>

                {/* Page content */}
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
