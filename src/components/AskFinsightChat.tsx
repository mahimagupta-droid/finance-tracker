"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

export default function AskFinsightChat() {
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({ api: "/api/ai/chat" }),
    });

    const isLoading = status === "streaming" || status === "submitted";

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        sendMessage({ text: input });
        setInput("");
    };

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
            {/* Chat panel */}
            {isOpen && (
                <div className="mb-3 flex h-[520px] w-[360px] flex-col overflow-hidden rounded-2xl border border-cyan-900/40 bg-slate-900 shadow-2xl shadow-black/40">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-cyan-900/40 bg-slate-950/60 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                            <h2 className="text-sm font-semibold text-cyan-50">Ask FinSight</h2>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                            aria-label="Close chat"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
                        {messages.length === 0 && (
                            <p className="mt-6 text-center text-sm text-slate-500">
                                Ask me about your budget, spending, or savings.
                            </p>
                        )}
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${message.role === "user"
                                        ? "rounded-br-sm bg-cyan-500 text-slate-950"
                                        : "rounded-bl-sm bg-slate-800 text-slate-100"
                                        }`}
                                >
                                    {message.parts.map((part, i) =>
                                        part.type === "text" ? <span key={i}>{part.text}</span> : null
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex max-w-[80%] flex-col gap-2 rounded-2xl rounded-bl-sm bg-slate-800 px-4 py-3">
                                    <div className="h-2.5 w-40 animate-pulse rounded-full bg-slate-600" />
                                    <div className="h-2.5 w-28 animate-pulse rounded-full bg-slate-600 [animation-delay:150ms]" />
                                    <div className="h-2.5 w-32 animate-pulse rounded-full bg-slate-600 [animation-delay:300ms]" />
                                </div>
                            </div>
                        )}                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-cyan-900/40 bg-slate-950/60 p-3">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask FinSight anything..."
                            className="flex-1 rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
                            aria-label="Send message"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle button */}
            <button
                onClick={() => setIsOpen((v) => !v)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:scale-105 hover:bg-cyan-400"
                aria-label={isOpen ? "Close FinSight chat" : "Open FinSight chat"}
            >
                {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
            </button>
        </div>
    );
}