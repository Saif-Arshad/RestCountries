"use client";

import React, { useState, useEffect } from "react";
import { Copy, Key, Plus, Trash2, AlertCircle } from "lucide-react";
import axios from "axios";
import { useUser } from "@/lib/useUser";

interface ApiKey {
    id?: number;
    name: string;
    key: string; 
    createdAt?: string;
    email?: string; 
    userId?: any; 
}

const ApiKeyManagement: React.FC = () => {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [keyToDelete, setKeyToDelete] = useState<ApiKey | null>(null);
    const [newKeyName, setNewKeyName] = useState<string>("");
    const [newKey, setNewKey] = useState<ApiKey | null>(null);
    const [toast, setToast] = useState<{ show: boolean; title: string; message: string }>({
        show: false,
        title: "",
        message: "",
    });

    const { user } = useUser();

    useEffect(() => {
        if (!user) return;
        if (user.userType === "admin") {
            axios
                .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/api-keys`)
                .then((response) => {
                    const keys: ApiKey[] = (response.data.api_keys || []).map((k: any, index: number) => ({
                        id: index, 
                        name: k.name,
                        key: k.api_key,
                        email: k.email,
                        userId: k.user_id,
                    }));
                    setApiKeys(keys);
                })
                .catch((error) => {
                    console.error("Error fetching admin API keys:", error);
                    showToast("Error", "Failed to load API keys for admin.");
                });
        } else {
            axios
                .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api-keys/${user.id}`)
                .then((response) => {
                    const keys: ApiKey[] = (response.data.api_keys || []).map((k: any, index: number) => ({
                        id: index,
                        name: k.name,
                        key: k.api_key,
                    }));
                    setApiKeys(keys);
                })
                .catch((error) => {
                    console.error("Error fetching user API keys:", error);
                    showToast("Error", "Failed to load your API keys.");
                });
        }
    }, [user]);

    const handleCreateKey = () => {
        if (!newKeyName.trim() || !user) return;
        axios
            .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api-keys/${user.id}`, { name: newKeyName })
            .then((response) => {
                const createdKey: ApiKey = {
                    name: response.data.name,
                    key: response.data.api_key,
                    createdAt: new Date().toISOString().split("T")[0],
                    userId: user.id,
                };
                setApiKeys((prev) => [...prev, createdKey]);
                setNewKey(createdKey);
                setNewKeyName("");
                setShowCreateDialog(false);
                showToast("API Key Created", "Your new API key has been generated successfully.");
            })
            .catch((error) => {
                console.error("Error creating API key:", error);
                showToast("Error", "Failed to create API key.");
            });
    };

    // Delete (or revoke) an API key via the API
    const handleDeleteKey = (apiKey: ApiKey) => {
        if (!user) return;
        const targetUserId = apiKey.userId ? apiKey.userId : user.id;
        axios
            .delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api-keys/${apiKey.key}`, { data: { userId: targetUserId } })
            .then(() => {
                setApiKeys((prev) => prev.filter((key) => key.key !== apiKey.key));
                setShowDeleteDialog(false);
                showToast("API Key Deleted", "The API key has been successfully deleted.");
            })
            .catch((error) => {
                console.error("Error deleting API key:", error);
                showToast("Error", "Failed to delete API key.");
            });
    };

    const showToast = (title: string, message: string) => {
        setToast({ show: true, title, message });
        setTimeout(() => setToast({ show: false, title: "", message: "" }), 3000);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast("Copied", "API key copied to clipboard");
    };

    const confirmDelete = (key: ApiKey) => {
        setKeyToDelete(key);
        setShowDeleteDialog(true);
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Key className="h-5 w-5 text-indigo-500" />
                        <h2 className="text-xl font-semibold text-gray-800">API Keys</h2>
                    </div>

                    <button
                        onClick={() => setShowCreateDialog(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create API Key
                    </button>
                </div>

             

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Key</th>
                                {user?.userType === "admin" && <th className="px-6 py-3">Owner Email</th>}
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {apiKeys.map((apiKey, index) => (
                                <tr key={apiKey.key || index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{apiKey.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                        <div className="flex items-center space-x-2">
                                            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                                                {`${apiKey.key.substring(0, 10)}...${apiKey.key.substring(apiKey.key.length - 5)}`}
                                            </code>
                                            <button onClick={() => copyToClipboard(apiKey.key)} className="text-gray-400 hover:text-gray-600">
                                                <Copy className="h-4 w-4" />
                                                <span className="sr-only">Copy</span>
                                            </button>
                                        </div>
                                    </td>
                                    {user?.userType === "admin" && (
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{apiKey.email || "N/A"}</td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button
                                            onClick={() => confirmDelete(apiKey)}
                                            className="inline-flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 p-2"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {apiKeys.length === 0 && (
                    <div className="py-12 text-center">
                        <Key className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No API keys</h3>
                        <p className="mt-1 text-gray-500">Create an API key to start integrating with our services.</p>
                    </div>
                )}
            </div>

            {showCreateDialog && (
                <div className="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            aria-hidden="true"
                            onClick={() => setShowCreateDialog(false)}
                        ></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <Key className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Create API Key
                                        </h3>
                                        <div className="mt-4">
                                            <label htmlFor="key-name" className="block text-sm font-medium text-gray-700">
                                                Key Name
                                            </label>
                                            <input
                                                type="text"
                                                name="key-name"
                                                id="key-name"
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                                                placeholder="e.g. Production API Key"
                                                value={newKeyName}
                                                onChange={(e) => setNewKeyName(e.target.value)}
                                            />
                                            <p className="mt-2 text-sm text-gray-500">
                                                Give your API key a descriptive name for later reference.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={handleCreateKey}
                                >
                                    Create
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setShowCreateDialog(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteDialog && keyToDelete && (
                <div className="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            aria-hidden="true"
                            onClick={() => setShowDeleteDialog(false)}
                        ></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Delete API Key
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to delete the API key &quot;{keyToDelete.name}&quot;? This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => keyToDelete && handleDeleteKey(keyToDelete)}
                                >
                                    Delete
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setShowDeleteDialog(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {newKey && (
                <div className="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            API Key Created
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500 mb-4">
                                                Your new API key has been created. Please save this key now as you won&quot;t be able to see it again.
                                            </p>
                                            <div className="bg-gray-50 p-4 rounded-md">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">API KEY</label>
                                                <div className="flex items-center space-x-2">
                                                    <code className="bg-gray-100 p-2 rounded text-sm font-mono w-full overflow-x-auto">{newKey.key}</code>
                                                    <button onClick={() => copyToClipboard(newKey.key)} className="text-gray-400 hover:text-gray-600 p-2">
                                                        <Copy className="h-4 w-4" />
                                                        <span className="sr-only">Copy</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setNewKey(null)}
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {toast.show && (
                <div
                    className="fixed bottom-5 right-5 bg-white border border-gray-100 rounded-lg shadow-lg p-4 flex items-start space-x-4 max-w-xs transform transition-all duration-500 opacity-100 translate-y-0"
                    role="alert"
                >
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900">{toast.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">{toast.message}</p>
                    </div>
                    <button
                        type="button"
                        className="ml-auto -mx-1.5 -my-1.5 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8"
                        onClick={() => setToast({ show: false, title: "", message: "" })}
                    >
                        <span className="sr-only">Close</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            )}
        </>
    );
};

export default ApiKeyManagement;
