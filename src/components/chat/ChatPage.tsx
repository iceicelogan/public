import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { buildSystemPrompt, streamChat, fetchWeeklyDigest } from '../../utils/anthropic';
import { ChatMessage } from '../../types';
import Header from '../layout/Header';

const QUICK_PROMPTS = [
  'What should I do today?',
  'Am I making progress?',
  'My lower back is tight — what should I skip?',
  'How do I break a plateau?',
  'Tips for leg day recovery?',
];

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
          <span className="text-white text-xs font-bold">AI</span>
        </div>
      )}
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
          ${isUser
            ? 'bg-orange-500 text-white rounded-br-md'
            : 'bg-slate-800 text-slate-100 rounded-bl-md'
          }`}
      >
        {msg.content}
      </div>
    </div>
  );
}

function TypingBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-start mb-3">
      <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
        <span className="text-white text-xs font-bold">AI</span>
      </div>
      <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-bl-md bg-slate-800 text-slate-100 text-sm leading-relaxed whitespace-pre-wrap">
        {text || (
          <span className="flex gap-1 items-center h-4">
            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
          </span>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { profile, sessions, metrics, chatHistory, addChatMessage, clearChat } = useStore();

  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [digestLoading, setDigestLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, streamingText]);

  const systemPrompt = buildSystemPrompt(profile, sessions, metrics);

  const sendMessage = async (text: string) => {
    if (!text.trim() || streaming) return;
    if (!profile.aiApiKey) {
      setError('Add your Anthropic API key in Settings to use the AI buddy.');
      return;
    }

    const userMsg = text.trim();
    setInput('');
    setError(null);
    setStreaming(true);
    setStreamingText('');

    addChatMessage({ role: 'user', content: userMsg });

    let fullText = '';

    await streamChat(
      profile.aiApiKey,
      systemPrompt,
      chatHistory,
      userMsg,
      (chunk) => {
        fullText += chunk;
        setStreamingText(fullText);
      },
      (err) => {
        setError(err);
        setStreaming(false);
        setStreamingText('');
      }
    );

    if (fullText) {
      addChatMessage({ role: 'assistant', content: fullText });
    }

    setStreaming(false);
    setStreamingText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleDigest = async () => {
    if (!profile.aiApiKey) {
      setError('Add your Anthropic API key in Settings first.');
      return;
    }
    setDigestLoading(true);
    setError(null);

    try {
      const text = await fetchWeeklyDigest(profile.aiApiKey, profile, sessions, metrics);
      addChatMessage({ role: 'user', content: 'Give me my weekly digest.' });
      addChatMessage({ role: 'assistant', content: text });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Digest failed');
    } finally {
      setDigestLoading(false);
    }
  };

  const hasNoKey = !profile.aiApiKey;

  return (
    <div className="flex flex-col h-full">
      <Header
        title="AI Buddy"
        subtitle="gemini-1.5-flash · free tier"
        right={
          <div className="flex gap-2">
            <button
              onClick={handleDigest}
              disabled={digestLoading || streaming}
              className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded-lg active:bg-purple-500/30 disabled:opacity-50 touch-manipulation"
            >
              {digestLoading ? '...' : 'Weekly Digest'}
            </button>
            {chatHistory.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Clear chat history?')) clearChat();
                }}
                className="text-xs text-slate-500 px-2 py-1.5 rounded-lg active:text-slate-300 touch-manipulation"
              >
                Clear
              </button>
            )}
          </div>
        }
      />

      {/* No API key warning */}
      {hasNoKey && (
        <div className="mx-4 mt-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
          <p className="text-yellow-400 text-xs font-semibold">API key not set</p>
          <p className="text-yellow-300/70 text-xs mt-0.5">
            Go to Settings and enter your Anthropic API key to chat.
          </p>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ paddingBottom: '1rem' }}>
        {chatHistory.length === 0 && !streaming && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
              <span className="text-3xl">🤖</span>
            </div>
            <div>
              <p className="text-slate-100 font-semibold">Your workout buddy</p>
              <p className="text-slate-500 text-sm mt-1">
                Ask me anything about your training, recovery, or progress.
              </p>
            </div>

            {/* Quick prompts */}
            <div className="w-full flex flex-col gap-2 mt-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  disabled={hasNoKey || streaming}
                  className="text-left px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-slate-300 active:bg-slate-700 disabled:opacity-40 touch-manipulation"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatHistory.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {streaming && <TypingBubble text={streamingText} />}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-3">
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-slate-800 px-4 py-3 pb-safe bg-slate-950" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}>
        {/* Quick prompts when there's history */}
        {chatHistory.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={hasNoKey || streaming}
                className="whitespace-nowrap text-xs px-3 py-1.5 bg-slate-800 text-slate-400 rounded-full active:bg-slate-700 disabled:opacity-40 flex-shrink-0 touch-manipulation"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2 mt-1">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={handleKeyDown}
            placeholder={hasNoKey ? 'Add API key in Settings...' : 'Ask your buddy...'}
            disabled={hasNoKey || streaming}
            className="input-field flex-1 resize-none min-h-[44px] max-h-[120px] py-2.5 disabled:opacity-50"
            style={{ overflow: 'hidden' }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || streaming || hasNoKey}
            className="w-11 h-11 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0
              active:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
          >
            {streaming ? (
              <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
