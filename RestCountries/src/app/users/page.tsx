"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, Eye, Trash2, Users } from "lucide-react";
import axios from "axios";
import { useUser } from "@/lib/useUser";

const UsersPage = () => {
    const [users, setUsers] = useState<any>([]);
    const { user } = useUser();

    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any>(null);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", title: "" });

    useEffect(() => {
        axios
            .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users`)
            .then((response) => {
                console.log(response.data)
                setUsers(response.data.users);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                showToast("Error", "Failed to load users.");
            });
    }, []);

    const showToast = (title:string, message:string) => {
        setToast({ show: true, title, message });
        setTimeout(() => setToast({ show: false, title: "", message: "" }), 3000);
    };

    const handleDeleteUser = (id:any) => {
        axios
            .delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users/${id}`)
            .then((res) => {
                setUsers((prevUsers:any) => prevUsers.filter((user:any) => user?.id !== id));
                setShowDeleteDialog(false);
                showToast("User Deleted", "The user has been successfully deleted.");
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
                showToast("Deletion Error", "There was an error deleting the user.");
            });
    };

    const viewUserDetails = (user:any) => {
        setSelectedUser(user);
        setShowUserDetails(true);
    };

    const confirmDelete = (user:any) => {
        setUserToDelete(user);
        setShowDeleteDialog(true);
    };

    return (
        <div className="container min-h-screen py-10 px-4 mx-auto max-w-6xl">
            {user?.userType !== "admin" ? (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-800">
                        <AlertCircle className="h-5 w-5" />
                        <p className="font-medium">Admin Access Only</p>
                    </div>
                    <p className="mt-1 text-sm text-amber-700">
                        This page is for administrators only. Admins can view and delete user accounts.
                    </p>
                </div>
            ) : (
                <>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">User Management</h1>
                        <p className="text-gray-600 mt-2">View and manage user accounts</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-indigo-500" />
                                <h2 className="text-xl font-semibold text-gray-800">User List</h2>
                            </div>
                            <p className="text-sm text-gray-500">{users.length} total users</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <th className="px-6 py-3">ID</th>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Role</th>
                                        <th className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user:any) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.role}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className="inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        onClick={() => viewUserDetails(user)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        <span className="sr-only">View details</span>
                                                    </button>
                                                    <button
                                                        className="inline-flex items-center justify-center h-8 w-8 rounded-md text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        onClick={() => confirmDelete(user)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {users.length === 0 && (
                            <div className="py-12 text-center">
                                <Users className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
                                <p className="mt-1 text-gray-500">No users are currently registered in the system.</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {showUserDetails && selectedUser && (
                <div
                    className="fixed inset-0 overflow-hidden z-50"
                    aria-labelledby="slide-over-title"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="absolute inset-0 overflow-hidden">
                        <div
                            className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            aria-hidden="true"
                            onClick={() => setShowUserDetails(false)}
                        ></div>

                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <div className="pointer-events-auto relative w-screen max-w-md">
                                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                                    <div className="px-4 sm:px-6 py-6 bg-gray-50 border-b border-gray-200">
                                        <div className="flex items-start justify-between">
                                            <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">
                                                User Details
                                            </h2>
                                            <button
                                                type="button"
                                                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                onClick={() => setShowUserDetails(false)}
                                            >
                                                <span className="sr-only">Close panel</span>
                                                <svg
                                                    className="h-6 w-6"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">
                                            View detailed information about this user.
                                        </p>
                                    </div>
                                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                                                <p className="mt-1 text-sm text-gray-900">{selectedUser.id}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                                                <p className="mt-1 text-sm text-gray-900">{selectedUser.name}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                                <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Role</h3>
                                                <p className="mt-1 text-sm text-gray-900">{selectedUser.role}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Password</h3>
                                                <p className="mt-1 text-sm text-gray-900">{selectedUser.password}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Passwords are stored in encrypted format.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteDialog && userToDelete && (
                <div
                    className="fixed inset-0 overflow-y-auto z-50"
                    aria-labelledby="modal-title"
                    role="dialog"
                    aria-modal="true"
                >
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
                                        <svg
                                            className="h-6 w-6 text-red-600"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Delete User
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to delete this user? This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => handleDeleteUser(userToDelete.id)}
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

            {toast.show && (
                <div
                    className="fixed bottom-5 right-5 bg-white border border-gray-100 rounded-lg shadow-lg p-4 flex items-start space-x-4 max-w-xs transform transition-all duration-500 opacity-100 translate-y-0"
                    role="alert"
                >
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg">
                        <svg
                            className="w-5 h-5 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
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
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
