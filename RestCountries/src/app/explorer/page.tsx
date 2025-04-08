"use client";

import React, { useState } from "react";
import { Search, Globe, Code, Info } from "lucide-react";

interface CountryInfo {
    country_name: string;
    capital: string;
    languages: string[];
    currencies: { code: string; name: string; symbol: string }[];
    flag_url: string;
}

const CountryExplorer: React.FC = () => {
    const [apiKey, setApiKey] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [country, setCountry] = useState<CountryInfo | null>(null);
    const [activeTab, setActiveTab] = useState<"display" | "api">("api");

    const [toast, setToast] = useState<{ show: boolean; title: string; description: string }>({
        show: false,
        title: "",
        description: "",
    });

    const showToast = (title: string, description: string) => {
        setToast({ show: true, title, description });
        setTimeout(() => {
            setToast({ show: false, title: "", description: "" });
        }, 3000);
    };

    const searchCountry = async () => {
        if (!searchQuery.trim()) {
            showToast("Error", "Please enter a country name");
            return;
        }
        if (!apiKey.trim()) {
            showToast("Error", "Please enter your API key");
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/countries?name=${encodeURIComponent(searchQuery)}`,
                {
                    headers: {
                        "X-API-KEY": apiKey,
                    },
                }
            );
            const data = await response.json();
            if (response.ok && Array.isArray(data) && data.length > 0) {
                setCountry(data[0]);
            } else {
                showToast("Country Not Found", "Unable to find a country with that name. Please try another search.");
                setCountry(null);
            }
        } catch (error) {
            console.error("Error fetching country data:", error);
            showToast("Error", "An error occurred while fetching country data");
            setCountry(null);
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrencies = (
        currencies: CountryInfo["currencies"] | undefined
    ) => {
        if (!currencies || currencies.length === 0) return "N/A";
        return currencies.map((curr) => `${curr.name} (${curr.symbol}) [${curr.code}]`).join(", ");
    };

    const formatLanguages = (languages: CountryInfo["languages"] | undefined) => {
        if (!languages || languages.length === 0) return "N/A";
        return languages.join(", ");
    };

    const getApiExample = () => {
        if (!country) return "";
        return JSON.stringify(country, null, 2);
    };

    return (
        <div className="max-w-2xl mx-auto my-8 px-4">
            {toast.show && (
                <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow">
                    <p className="font-bold">{toast.title}</p>
                    <p>{toast.description}</p>
                </div>
            )}

            <div className="bg-white rounded-lg shadow border">
                <div className="border-b p-4">
                    <h2 className="text-2xl font-bold">Country Explorer</h2>
                    <p className="text-gray-600">
                        Search for a country to see how the API would respond
                    </p>
                </div>

                <div className="p-4 space-y-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="api-key" className="text-sm font-medium text-gray-700">
                            API Key
                        </label>
                        <input
                            id="api-key"
                            type="text"
                            placeholder="Enter your API key"
                            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter country name (e.g., Canada)"
                            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && searchCountry()}
                        />
                        <button
                            onClick={searchCountry}
                            disabled={isLoading}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
                        >
                            {isLoading ? "Searching..." : "Search"}
                            {!isLoading && <Search className="ml-2 h-4 w-4" />}
                        </button>
                    </div>

                    {country && (
                        <>
                            <div className="border-b">
                                <div className="flex">
                                    <button
                                        onClick={() => setActiveTab("display")}
                                        className={`py-2 px-4 focus:outline-none ${activeTab === "display"
                                                ? "border-b-2 border-blue-600 text-blue-600"
                                                : "text-gray-600"
                                            }`}
                                    >
                                        <Info className="inline mr-2 h-4 w-4" />
                                        Country Info
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("api")}
                                        className={`py-2 px-4 focus:outline-none ${activeTab === "api"
                                                ? "border-b-2 border-blue-600 text-blue-600"
                                                : "text-gray-600"
                                            }`}
                                    >
                                        <Code className="inline mr-2 h-4 w-4" />
                                        API Response
                                    </button>
                                </div>
                            </div>

                            {/* Tab Content */}
                            {activeTab === "display" && (
                                <div className="pt-4">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="md:w-1/3 flex justify-center">
                                            <img
                                                src={country.flag_url}
                                                alt={`Flag of ${country.country_name}`}
                                                className="border shadow-sm rounded max-w-full"
                                            />
                                        </div>
                                        <div className="md:w-2/3">
                                            <h2 className="text-2xl font-bold mb-1">{country.country_name}</h2>
                                            <p className="text-gray-500 mb-4">
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Capital</h3>
                                                    <p>{country.capital || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Languages</h3>
                                                    <p>{formatLanguages(country.languages)}</p>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Currencies</h3>
                                                    <p>{formatCurrencies(country.currencies)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === "api" && (
                                <div className="pt-4">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">API Response Format</h3>
                                    <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                                        {getApiExample()}
                                    </pre>
                                </div>
                            )}
                        </>
                    )}

                    {!country && !isLoading && (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                            <Globe className="h-16 w-16 text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Country Selected</h3>
                            <p className="text-gray-500">
                                Search for a country above to see information about it
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CountryExplorer;
