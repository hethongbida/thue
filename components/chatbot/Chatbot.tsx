import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import { streamChatResponse } from '../../services/geminiService';

const initialBotMessage: ChatMessage = {
    id: 'initial-message',
    text: 'Xin chào! Tôi là Trợ lý Thuế AI. Tôi có thể giúp gì cho bạn về các quy định thuế 2026?',
    sender: 'bot'
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialBotMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);
  
  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const botMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: botMessageId, text: '', sender: 'bot', isStreaming: true }]);

    try {
        // FIX: Explicitly type the `history` array to match the expected type of `streamChatResponse`.
        const history: { role: 'user' | 'model'; parts: { text: string }[] }[] = messages.slice(1).map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }],
        }));

        const result = await streamChatResponse(history, input);
        
        let fullResponse = '';
        for await (const chunk of result) {
            fullResponse += chunk.text;
            setMessages(prev => prev.map(m =>
                m.id === botMessageId ? { ...m, text: fullResponse } : m
            ));
        }

        setMessages(prev => prev.map(m =>
            m.id === botMessageId ? { ...m, isStreaming: false } : m
        ));

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Xin lỗi, đã có lỗi xảy ra.';
        setMessages(prev => prev.map(m =>
            m.id === botMessageId ? { ...m, text: errorMessage, isStreaming: false } : m
        ));
    } finally {
        setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-teal-600 text-white rounded-full p-4 shadow-lg hover:bg-teal-700 transition transform hover:scale-110 z-50"
        aria-label="Mở trợ lý ảo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.53-.375m-10.492 0a9.75 9.75 0 0 1 13.023-7.875M3.375 12a9.75 9.75 0 0 1 9.006-9.625" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-50">
        <div className="flex justify-between items-center p-4 bg-slate-900 text-slate-100 rounded-t-2xl">
            <h3 className="font-bold text-lg">Trợ lý Thuế AI</h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-200 text-2xl">&times;</button>
        </div>
        <div className="flex-grow p-4 overflow-y-auto bg-slate-800">
            {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                    <div className={`py-2 px-4 rounded-2xl max-w-[80%] ${msg.sender === 'user' ? 'bg-teal-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                        {msg.text}
                        {msg.isStreaming && <span className="inline-block w-2 h-2 bg-slate-400 rounded-full animate-pulse ml-2"></span>}
                    </div>
                </div>
            ))}
             <div ref={chatEndRef} />
        </div>
        <div className="p-4 border-t border-slate-700">
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Đặt câu hỏi về thuế 2026..."
                    className="flex-grow p-2 border border-slate-600 bg-slate-700 text-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                    disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading} className="bg-teal-600 text-white rounded-full p-2 w-10 h-10 flex-shrink-0 flex items-center justify-center disabled:bg-slate-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
  );
};


export default Chatbot;
