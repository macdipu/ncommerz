import { Link } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { 
    ShoppingBagIcon,
    ClipboardDocumentListIcon,
    UsersIcon,
    CurrencyDollarIcon,
    ExclamationTriangleIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard({ 
    stats, 
    recentOrders, 
    recentProducts, 
    lowStockProducts,
    salesData = []
}) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        // Load Chart.js dynamically
        const loadChart = async () => {
            if (typeof window !== 'undefined') {
                const { Chart, registerables } = await import('chart.js');
                Chart.register(...registerables);

                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                // Generate last 30 days data
                const last30Days = [];
                const salesValues = [];
                
                // Use real sales data from backend
                salesData.forEach(dayData => {
                    const date = new Date(dayData.date);
                    last30Days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
                    salesValues.push(dayData.sales);
                });

                const ctx = chartRef.current.getContext('2d');
                chartInstance.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: last30Days,
                        datasets: [{
                            label: 'Sales (৳)',
                            data: salesValues,
                            borderColor: 'rgb(59, 130, 246)',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: 'rgb(59, 130, 246)',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) {
                                        return '৳' + value.toLocaleString();
                                    }
                                },
                                grid: {
                                    color: 'rgba(0, 0, 0, 0.1)'
                                }
                            },
                            x: {
                                grid: {
                                    display: false
                                }
                            }
                        },
                        elements: {
                            point: {
                                hoverBackgroundColor: 'rgb(59, 130, 246)'
                            }
                        }
                    }
                });
            }
        };

        loadChart();

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [salesData]);
    const statCards = [
        { 
            name: 'Total Products', 
            value: stats.totalProducts, 
            icon: ShoppingBagIcon, 
            color: 'bg-blue-500',
            href: '/admin/products'
        },
        { 
            name: 'Total Orders', 
            value: stats.totalOrders, 
            icon: ClipboardDocumentListIcon, 
            color: 'bg-green-500',
            href: '/admin/orders'
        },
        { 
            name: 'Total Customers', 
            value: stats.totalCustomers, 
            icon: UsersIcon, 
            color: 'bg-purple-500',
            href: '/admin/customers'
        },
        { 
            name: 'Total Revenue', 
            value: `৳${stats.totalRevenue}`, 
            icon: CurrencyDollarIcon, 
            color: 'bg-yellow-500',
            href: '/admin/orders'
        },
    ];

    const getStatusColor = (status) => {
        switch(status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Welcome to your admin dashboard</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat) => (
                        <Link key={stat.name} href={stat.href} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center">
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Sales Growth Chart */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Sales Growth (Last 30 Days)</h2>
                    <div className="h-80">
                        <canvas ref={chartRef} className="w-full h-full"></canvas>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <div className="bg-white rounded-xl shadow-md">
                        <div className="p-6 border-b">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                                <Link href="/admin/orders" className="text-blue-600 hover:text-blue-800 text-sm">View All</Link>
                            </div>
                        </div>
                        <div className="p-6">
                            {recentOrders.length > 0 ? (
                                <div className="space-y-4">
                                    {recentOrders.map((order) => (
                                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">#{order.order_number}</p>
                                                <p className="text-sm text-gray-600">{order.customer_name}</p>
                                                <p className="text-xs text-gray-500">{order.created_at}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">৳{order.total}</p>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <ClipboardDocumentListIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No orders yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Products */}
                    <div className="bg-white rounded-xl shadow-md">
                        <div className="p-6 border-b">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-900">Recent Products</h2>
                                <Link href="/admin/products" className="text-blue-600 hover:text-blue-800 text-sm">View All</Link>
                            </div>
                        </div>
                        <div className="p-6">
                            {recentProducts.length > 0 ? (
                                <div className="space-y-4">
                                    {recentProducts.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{product.name}</p>
                                                <p className="text-sm text-gray-600">{product.category}</p>
                                                <p className="text-xs text-gray-500">{product.created_at}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">৳{product.price}</p>
                                                <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <ShoppingBagIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No products yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Low Stock Alert */}
                {lowStockProducts.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md">
                        <div className="p-6 border-b">
                            <div className="flex items-center">
                                <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-2" />
                                <h2 className="text-xl font-semibold text-gray-900">Low Stock Alert</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {lowStockProducts.map((product) => (
                                    <div key={product.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="font-medium text-gray-900">{product.name}</p>
                                        <p className="text-sm text-red-600">Only {product.stock} left in stock</p>
                                        <p className="text-sm text-gray-600">৳{product.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
