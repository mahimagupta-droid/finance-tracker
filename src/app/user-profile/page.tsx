/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Background from "../../../public/user-profile-background.png";
import Image from "next/image";
import { UserTypes } from "@/lib/types/user";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { User2Icon } from "lucide-react"

const INCOME_RANGE_LABELS: Record<string, string> = {
    "<15k": "Below ₹15,000",
    "15k-50k": "₹15,000 – ₹50,000",
    "50k-1L": "₹50,000 – ₹1,00,000",
    ">1L": "Above ₹1,00,000",
};

const PRIMARY_GOAL_LABELS: Record<string, string> = {
    "Save More": "Save More",
    "Invest": "Invest",
    "Clear Debt": "Clear Debt",
    "Emergency Fund": "Build Emergency Fund",
};

export default function UserProfilePage() {
    const [user, setUser] = useState<Partial<UserTypes>>({
        email: "",
        name: "",
        age: 0,
        monthlyIncome: 0,
        savingsGoal: 0,
        persona: "",
        incomeRange: "",
        primaryGoal: "",
    });
    const [creatingUser, setCreatingUser] = useState(false);
    const [updatingUser, setUpdatingUser] = useState(false);
    const [deletingUser, setDeletingUser] = useState(false);
    const [readingUser, setReadingUser] = useState(false);
    const [editingUser, setEditingUser] = useState(false);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setCreatingUser(true);
            const response = await fetch("/api/user-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.user) {
                    // toast.success("User created successfully");
                    setUser({
                        email: "",
                        name: "",
                        age: 0,
                        monthlyIncome: 0,
                        savingsGoal: 0,
                        persona: "",
                        incomeRange: "",
                        primaryGoal: "",
                    })
                    getUserInfo();
                }
            } else {
                const data = await response.json();
                throw new Error(data.error || "Failed to create user");
            }
        } catch (error) {
            toast.error("Failed to create user");
        } finally {
            setCreatingUser(false);
        }
    }

    const getUserInfo = async () => {
        try {
            setReadingUser(true);
            const response = await fetch("/api/user-profile", {
                method: "GET"
            });
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.user) {
                    setUser(data.user);
                    // toast.success("User profile fetched successfully");
                    // console.log("Fetched user profile:", data.user);
                } else {
                    throw new Error(data.error || "Failed to fetch user profile");
                }
            } else {
                if (response.status === 404) {
                    // User has not created a profile yet
                    return;
                }
                const errData = await response.json();
                throw new Error(errData.error || "Failed to fetch user profile");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch user profile");
        } finally {
            setReadingUser(false);
        }
    }

    const deleteUser = async () => {
        try {
            setDeletingUser(true);
            const response = await fetch("/api/user-profile", {
                method: "DELETE"
            });
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.message) {
                    toast.success(data.message);
                    setUser({
                        email: "",
                        name: "",
                        age: 0,
                        monthlyIncome: 0,
                        savingsGoal: 0,
                        persona: "",
                        incomeRange: "",
                        primaryGoal: "",
                    });
                }
            } else {
                const data = await response.json();
                throw new Error(data.error || "Failed to delete user");
            }
        } catch (error: any) {
            toast.error(`${error.message}` || "Failed to delete user");
        } finally {
            setDeletingUser(false);
        }
    }

    const updateUser = async () => {
        try {
            setUpdatingUser(true);
            const response = await fetch("/api/user-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.message) {
                    toast.success(`${data.message}`)
                    setEditingUser(false);
                }
            } else {
                const data = await response.json();
                throw new Error(data.error || "Failed to update user");
            }
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setUpdatingUser(false);
        }
    }

    const handleCancelEdit = () => {
        setEditingUser(false);
        // Revert any unsaved changes made while the edit form was open
        getUserInfo();
    }

    useEffect(() => {
        getUserInfo();
    }, []);

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center px-8 md:px-16 gap-16 min-h-[70vh] mt-11 mb-11">
            {user?.clerkId ? (
                <div className="w-full max-w-md bg-card text-card-textColor border border-border rounded-xl shadow-2xl p-8 font-lato">
                    <div className="flex flex-row items-center justify-center gap-2 mb-6">
                        <User2Icon className="w-8 h-8 text-primary" />
                        <h1 className="text-xl font-semibold">User Profile</h1>
                    </div>
                    <dl className="flex flex-col divide-y divide-border/60">
                        <div className="flex items-baseline justify-between gap-4 py-2.5">
                            <dt className="text-sm text-muted-textColor shrink-0">Email</dt>
                            <dd className="text-textColor font-medium text-right truncate">{user.email}</dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-4 py-2.5">
                            <dt className="text-sm text-muted-textColor shrink-0">Name</dt>
                            <dd className="text-textColor font-medium text-right truncate">{user.name}</dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-4 py-2.5">
                            <dt className="text-sm text-muted-textColor shrink-0">Age</dt>
                            <dd className="text-textColor font-medium text-right">{user.age}</dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-4 py-2.5">
                            <dt className="text-sm text-muted-textColor shrink-0">Monthly Income</dt>
                            <dd className="text-textColor font-medium text-right">₹{Number(user.monthlyIncome ?? 0).toLocaleString("en-IN")}</dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-4 py-2.5">
                            <dt className="text-sm text-muted-textColor shrink-0">Savings Goal</dt>
                            <dd className="text-textColor font-medium text-right">₹{Number(user.savingsGoal ?? 0).toLocaleString("en-IN")}</dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-4 py-2.5">
                            <dt className="text-sm text-muted-textColor shrink-0">Persona</dt>
                            <dd className="text-textColor font-medium text-right capitalize">{user.persona || "Not set"}</dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-4 py-2.5">
                            <dt className="text-sm text-muted-textColor shrink-0">Income Range</dt>
                            <dd className="text-textColor font-medium text-right">{user.incomeRange ? INCOME_RANGE_LABELS[user.incomeRange] : "Not set"}</dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-4 py-2.5">
                            <dt className="text-sm text-muted-textColor shrink-0">Primary Goal</dt>
                            <dd className="text-textColor font-medium text-right">{user.primaryGoal ? (PRIMARY_GOAL_LABELS[user.primaryGoal] || user.primaryGoal) : "Not set"}</dd>
                        </div>
                    </dl>
                    <div className="gap-3 flex flex-row mt-6 items-center justify-center">
                        <button onClick={deleteUser} disabled={deletingUser} className="bg-accent text-accent-textColor py-1.5 rounded-lg cursor-pointer w-24 text-sm font-medium disabled:opacity-50">
                            {deletingUser ? "Deleting..." : "Delete"}
                        </button>
                        <button onClick={() => setEditingUser(true)} className="bg-primary text-primary-textColor py-1.5 rounded-lg cursor-pointer w-24 text-sm font-medium">
                            Edit
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center px-6">
                    <div className="w-full max-w-2xl bg-card text-card-textColor border border-border rounded-xl shadow-2xl p-8">
                        <h3 className="text-3xl font-semibold text-center mb-8 text-textColor">
                            User Profile
                        </h3>
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" method="submit" onSubmit={handleCreateUser}>
                            <div className="flex flex-col">
                                <label className="text-sm mb-1 text-muted-textColor">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || ""}
                                    onChange={(e) =>
                                        setUser(prev => ({ ...prev, email: e.target.value } as UserTypes))
                                    }
                                    className="w-full bg-input text-textColor border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none transition"
                                    placeholder="eg. saksham@example.com"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm mb-1 text-muted-textColor">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={user?.name || ""}
                                    onChange={(e) =>
                                        setUser(prev => ({ ...prev, name: e.target.value } as UserTypes))
                                    }
                                    className="w-full bg-input text-textColor border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none transition"
                                    placeholder="eg. Saksham Sharma"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm mb-1 text-muted-textColor">
                                    Age
                                </label>
                                <input
                                    type="number"
                                    value={user?.age || ""}
                                    onChange={(e) =>
                                        setUser(prev => ({ ...prev, age: Number(e.target.value) } as UserTypes))
                                    }
                                    className="w-full bg-input text-textColor border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none transition"
                                    placeholder="eg. 25"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm mb-1 text-muted-textColor">
                                    Monthly Income
                                </label>
                                <input
                                    type="number"
                                    value={user?.monthlyIncome || ""}
                                    onChange={(e) =>
                                        setUser(prev => ({ ...prev, monthlyIncome: Number(e.target.value) } as UserTypes))
                                    }
                                    className="w-full bg-input text-textColor border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none transition"
                                    placeholder="eg. 50000"
                                />
                            </div>
                            <div className="flex flex-col md:col-span-2">
                                <label className="text-sm mb-1 text-muted-textColor">
                                    Savings Goal
                                </label>
                                <input
                                    type="number"
                                    value={user?.savingsGoal || ""}
                                    onChange={(e) =>
                                        setUser(prev => ({ ...prev, savingsGoal: Number(e.target.value) } as UserTypes))
                                    }
                                    className="w-full bg-input text-textColor border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none transition"
                                    placeholder="eg. 100000"
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-center mt-4">
                                <button
                                    type="submit"
                                    disabled={creatingUser}
                                    className="bg-primary text-primary-textColor px-6 py-2 rounded-lg font-medium hover:bg-secondary transition duration-200 shadow-md disabled:opacity-50 cursor-pointer"
                                >
                                    {creatingUser ? "Creating User" : "Create User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {editingUser && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
                    <div className="flex w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-card text-card-textColor border border-border rounded-xl shadow-2xl p-8">
                        <div className="w-full h-full">
                            <h3 className="text-3xl font-semibold text-center mb-8 text-textColor">
                                Update Profile
                            </h3>
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" method="submit" onSubmit={(e) => { e.preventDefault(); updateUser(); }}>
                                <div className="flex flex-col">
                                    <label className="text-sm mb-1 text-muted-textColor">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={user?.email || ""}
                                        onChange={(e) =>
                                            setUser(prev => ({ ...prev, email: e.target.value } as UserTypes))
                                        }
                                        className="w-full bg-input text-textColor border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none transition"
                                        placeholder="eg. saksham@example.com"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm mb-1 text-muted-textColor">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={user?.name || ""}
                                        onChange={(e) =>
                                            setUser(prev => ({ ...prev, name: e.target.value } as UserTypes))
                                        }
                                        className="w-full bg-input text-textColor border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none transition"
                                        placeholder="eg. Saksham Sharma"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm mb-1 text-muted-textColor">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        value={user?.age || ""}
                                        onChange={(e) =>
                                            setUser(prev => ({ ...prev, age: Number(e.target.value) } as UserTypes))
                                        }
                                        className="w-full bg-input text-textColor border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none transition"
                                        placeholder="eg. 25"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm mb-1 text-muted-textColor">
                                        Monthly Income
                                    </label>
                                    <input
                                        type="number"
                                        value={user?.monthlyIncome || ""}
                                        onChange={(e) =>
                                            setUser(prev => ({ ...prev, monthlyIncome: Number(e.target.value) } as UserTypes))
                                        }
                                        className="w-full bg-input text-textColor border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none transition"
                                        placeholder="eg. 50000"
                                    />
                                </div>
                                <div className="flex flex-col md:col-span-2">
                                    <label className="text-sm mb-1 text-muted-textColor">
                                        Savings Goal
                                    </label>
                                    <input
                                        type="number"
                                        value={user?.savingsGoal || ""}
                                        onChange={(e) =>
                                            setUser(prev => ({ ...prev, savingsGoal: Number(e.target.value) } as UserTypes))
                                        }
                                        className="w-full bg-input text-textColor border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none transition"
                                        placeholder="eg. 100000"
                                    />
                                </div>

                                <div className="flex flex-col md:col-span-2">
                                    <label className="text-sm mb-2 text-muted-textColor">
                                        Persona
                                    </label>
                                    <div className="flex flex-col md:flex-row gap-2">
                                        {["student", "professional", "freelancer"].map((p) => (
                                            <button
                                                type="button"
                                                key={p}
                                                onClick={() => setUser(prev => ({ ...prev, persona: p } as UserTypes))}
                                                className={`flex-1 px-4 py-2 rounded-lg border capitalize text-left transition ${user?.persona === p
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "border-border text-textColor"
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm mb-1 text-muted-textColor">
                                        Income Range
                                    </label>
                                    <select
                                        value={user?.incomeRange || ""}
                                        onChange={(e) =>
                                            setUser(prev => ({ ...prev, incomeRange: e.target.value } as UserTypes))
                                        }
                                        className="w-full bg-input text-textColor border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none transition"
                                    >
                                        <option value="" disabled>Select income range</option>
                                        <option value="<15k">Below ₹15,000</option>
                                        <option value="15k-50k">₹15,000 – ₹50,000</option>
                                        <option value="50k-1L">₹50,000 – ₹1,00,000</option>
                                        <option value=">1L">Above ₹1,00,000</option>
                                    </select>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm mb-1 text-muted-textColor">
                                        Primary Financial Goal
                                    </label>
                                    <select
                                        value={user?.primaryGoal || ""}
                                        onChange={(e) =>
                                            setUser(prev => ({ ...prev, primaryGoal: e.target.value } as UserTypes))
                                        }
                                        className="w-full bg-input text-textColor border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none transition"
                                    >
                                        <option value="" disabled>Select a goal</option>
                                        <option value="Save More">Save More</option>
                                        <option value="Invest">Invest</option>
                                        <option value="Clear Debt">Clear Debt</option>
                                        <option value="Emergency Fund">Build Emergency Fund</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2 flex justify-center gap-4 mt-4">
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        disabled={updatingUser}
                                        className="border border-border text-textColor px-6 py-2 rounded-lg font-medium hover:bg-border/20 transition duration-200 disabled:opacity-50 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updatingUser}
                                        className="bg-primary text-primary-textColor px-6 py-2 rounded-lg font-medium hover:bg-secondary transition duration-200 shadow-md disabled:opacity-50 cursor-pointer"
                                    >
                                        {updatingUser ? "Updating User" : "Update User"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {!editingUser && (
                <div className="flex-1 flex justify-center md:justify-end items-center relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 lg:w-96 lg:h-96 bg-blue-500/20 blur-[100px] rounded-full -z-10 animate-pulse hidden md:block" />
                    <Image
                        src={Background}
                        alt="User Profile Background"
                        className="w-full max-w-112.5 lg:max-w-150 h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,109,170,0.5)] transition-transform duration-700"
                        priority
                    />
                </div>
            )}
        </div>
    );
}
