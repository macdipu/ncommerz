import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { CodeBracketIcon, KeyIcon, ClipboardIcon } from '@heroicons/react/24/outline';

export default function Index({ apiEndpoints, baseUrl, apiKey }) {
    const [copiedEndpoint, setCopiedEndpoint] = useState(null);
    const { post, processing } = useForm();

    const generateApiKey = () => {
        post('/admin/api-key/generate');
    };

    const copyToClipboard = (text, endpoint) => {
        navigator.clipboard.writeText(text);
        setCopiedEndpoint(endpoint);
        setTimeout(() => setCopiedEndpoint(null), 2000);
    };

    const getCurlExample = (method, path, hasBody = false) => {
        const bodyExample = hasBody ? `\n  -d '{\n    "name": "Example Name",\n    "price": 100\n  }'` : '';
        return `curl -X ${method} "${baseUrl}/api${path}" \\
  -H "Authorization: Bearer ${apiKey || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json"${bodyExample}`;
    };

    return (
        <AdminLayout>
            <Head title="API & Documentation" />
            
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <CodeBracketIcon className="h-8 w-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">API & Documentation</h1>
                </div>

                {/* API Key Management */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <KeyIcon className="h-5 w-5" />
                            API Key Management
                        </h2>
                        <button
                            onClick={generateApiKey}
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                        >
                            {apiKey ? 'Regenerate' : 'Generate'} API Key
                        </button>
                    </div>
                    
                    {apiKey ? (
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <code className="flex-1 text-sm font-mono">{apiKey}</code>
                            <button
                                onClick={() => copyToClipboard(apiKey, 'api-key')}
                                className="p-2 text-gray-600 hover:text-gray-900"
                            >
                                <ClipboardIcon className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <p className="text-gray-600">Generate an API key to access the API endpoints.</p>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Base URL</h2>
                        <code className="bg-gray-100 px-3 py-2 rounded text-sm">{baseUrl}/api</code>
                    </div>

                    <div className="space-y-8">
                        {Object.entries(apiEndpoints).map(([section, endpoints]) => (
                            <div key={section} className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                                    {section} API
                                </h3>
                                <div className="space-y-4">
                                    {Object.entries(endpoints).map(([endpoint, description]) => {
                                        const [method, path] = endpoint.split(' ');
                                        const methodColors = {
                                            'GET': 'bg-green-100 text-green-800',
                                            'POST': 'bg-blue-100 text-blue-800',
                                            'PUT': 'bg-yellow-100 text-yellow-800',
                                            'DELETE': 'bg-red-100 text-red-800'
                                        };
                                        
                                        const hasBody = ['POST', 'PUT'].includes(method);
                                        const curlExample = getCurlExample(method, path, hasBody);
                                        const endpointKey = `${method}-${path}`;
                                        
                                        return (
                                            <div key={endpoint} className="border rounded-lg p-4">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded ${methodColors[method]}`}>
                                                        {method}
                                                    </span>
                                                    <code className="font-mono text-sm text-gray-700 flex-1">
                                                        {path}
                                                    </code>
                                                    <span className="text-sm text-gray-600">{description}</span>
                                                </div>
                                                
                                                <div className="bg-gray-900 text-white p-3 rounded text-sm overflow-x-auto relative">
                                                    <pre className="whitespace-pre-wrap text-white">{curlExample}</pre>
                                                    <button
                                                        onClick={() => copyToClipboard(curlExample, endpointKey)}
                                                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white"
                                                        title="Copy to clipboard"
                                                    >
                                                        <ClipboardIcon className="h-4 w-4" />
                                                    </button>
                                                    {copiedEndpoint === endpointKey && (
                                                        <div className="absolute top-2 right-10 text-green-400 text-xs">
                                                            Copied!
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Response Format</h3>
                        <p className="text-blue-800 mb-3">All API responses are in JSON format:</p>
                        <pre className="bg-blue-100 p-3 rounded text-sm overflow-x-auto">
{`// Success Response
{
  "id": 1,
  "name": "Product Name",
  "price": 100,
  "created_at": "2025-01-01T00:00:00Z"
}

// Error Response
{
  "message": "Validation failed",
  "errors": {
    "name": ["The name field is required."]
  }
}`}
                        </pre>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
