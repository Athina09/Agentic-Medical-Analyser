import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ChatMessage } from '@/lib/types';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import { useRipple } from '@/hooks/useGsap';

import { chat as apiChat } from '@/lib/api';

const TRIAGE_RESPONSES: Record<string, string> = {
  'chest pain': '🚨 **Chest pain is a high-priority symptom.** You should seek immediate medical attention. Possible causes include cardiac issues, pulmonary conditions, or musculoskeletal problems. I recommend going to the **Emergency Department** or **Cardiology** right away.\\\n\\\n**Key questions:**\\\n- Is the pain sharp or dull?\\n- Does it radiate to your arm, jaw, or back?\\n- Are you experiencing shortness of breath?',
  'headache': '**Headaches** can range from mild to severe. For persistent or sudden severe headaches, consider visiting **Neurology**.\\\n\\\n**Red flags to watch for:**\\\n- Sudden, worst headache of your life\\\n- Headache with fever and stiff neck\\\n- Vision changes or confusion\\\n\\\nFor mild headaches, rest, hydration, and over-the-counter pain relief may help.',
  'fever': '**Fever** indicates your body is fighting an infection.\\\n\\\n- **Below 38.5°C**: Monitor and rest\\\n- **38.5-39.5°C**: Consider seeing **General Medicine**\\\n- **Above 39.5°C**: Seek urgent care\\\n\\\nStay hydrated and monitor for additional symptoms.',
  'breathing': '**Breathing difficulties** should be taken seriously.\\\n\\\n- Mild shortness of breath → **Pulmonology**\\\n- Severe difficulty → **Emergency Department**\\\n- With chest pain → **Cardiology** or **Emergency**\\\n\\\nMonitor oxygen saturation if you have a pulse oximeter. Below 95% warrants medical attention.',
  default: 'I\'m your AI triage assistant. I can help you understand symptoms, recommend departments, and provide general health guidance.\\\n\\\n**I can help with:**\\\n- 🔍 Symptom analysis\\\n- 🏥 Department recommendations\\\n- ⚠️ Risk level assessment\\\n- 💊 General health advice\\\n\\\nPlease describe your symptoms or ask a medical question.',
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('chest') || lower.includes('heart')) return TRIAGE_RESPONSES['chest pain'];
  if (lower.includes('head') || lower.includes('migraine')) return TRIAGE_RESPONSES['headache'];
  if (lower.includes('fever') || lower.includes('temperature')) return TRIAGE_RESPONSES['fever'];
  if (lower.includes('breath') || lower.includes('breathing') || lower.includes('oxygen')) return TRIAGE_RESPONSES['breathing'];
  
  if (lower.includes('symptom') || lower.includes('feel')) {
    return 'To better assist you, please describe your specific symptoms in detail. Include:\\\n\\\n1. **What you\'re feeling**\\\n2. **When it started**\\\n3. **Severity (1-10)**\\\n4. **Any triggers**\\\n\\\nYou can also use our **Patient Intake** form for a comprehensive AI-powered triage assessment.';
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return 'Hello! 👋 I\'m your AI medical triage assistant. How can I help you today?\\\n\\\nYou can describe your symptoms, ask about a medical condition, or I can guide you to the right department.';
  }

  return `Thank you for your question. Based on your input about "${input.slice(0, 50)}...", I'd recommend:\\\n\\\n1. **Use the Patient Intake form** for a detailed AI-powered assessment\\\n2. **Describe specific symptoms** so I can provide targeted guidance\\\n3. **Check nearby hospitals** for immediate care options\\\n\\\nWould you like to tell me more about what you're experiencing?`;
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.5)' }
    );
  }, []);

  // Hover effect on bubbles
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleEnter = () => gsap.to(el, { scale: 1.01, duration: 0.2, ease: 'power2.out' });
    const handleLeave = () => gsap.to(el, { scale: 1, duration: 0.2, ease: 'power2.out' });
    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mouseleave', handleLeave);
    return () => { el.removeEventListener('mouseenter', handleEnter); el.removeEventListener('mouseleave', handleLeave); };
  }, []);

  return (
    <div ref={ref} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
        msg.role === 'assistant' ? 'gradient-primary' : 'bg-secondary'
      }`}>
        {msg.role === 'assistant' ? (
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        ) : (
          <User className="h-4 w-4 text-secondary-foreground" />
        )}
      </div>
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
        msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
      }`}>
        {msg.role === 'assistant' ? (
          <div className="text-sm prose prose-sm max-w-none text-foreground [&_strong]:text-foreground [&_p]:text-foreground [&_li]:text-foreground">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm">{msg.content}</p>
        )}
      </div>
    </div>
  );
}

export function ChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: TRIAGE_RESPONSES.default, timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendBtnRef = useRipple<HTMLButtonElement>();
  const typingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Typing indicator animation
  useEffect(() => {
    if (!typingRef.current || !isTyping) return;
    const dots = typingRef.current.querySelectorAll('.typing-dot');
    gsap.fromTo(dots, 
      { y: 0 },
      { y: -6, stagger: 0.15, repeat: -1, yoyo: true, duration: 0.4, ease: 'power2.inOut' }
    );
  }, [isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(), role: 'user', content: input.trim(), timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const { response } = await apiChat(userMsg.content);
      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date() },
      ]);
    } catch {
      const fallback = getAIResponse(userMsg.content);
      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: fallback, timestamp: new Date() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">AI Triage Assistant</h2>
          <p className="text-sm text-muted-foreground">Describe your symptoms for instant guidance</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-risk-low-bg">
          <div className="h-2 w-2 rounded-full bg-risk-low animate-pulse" />
          <span className="text-xs font-medium text-risk-low">Online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card p-4 space-y-4">
        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {isTyping && (
          <div ref={typingRef} className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="bg-muted rounded-2xl px-4 py-3">
              <div className="flex gap-1.5">
                <div className="typing-dot h-2 w-2 rounded-full bg-muted-foreground/40" />
                <div className="typing-dot h-2 w-2 rounded-full bg-muted-foreground/40" />
                <div className="typing-dot h-2 w-2 rounded-full bg-muted-foreground/40" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 mt-4">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Describe your symptoms..."
          className="flex-1 rounded-xl"
        />
        <Button
          ref={sendBtnRef}
          onClick={sendMessage}
          disabled={!input.trim() || isTyping}
          className="gradient-primary text-primary-foreground border-0 rounded-xl px-4"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
