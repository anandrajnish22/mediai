import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaUser, FaPaperPlane } from 'react-icons/fa';
import { FiMic, FiSend } from 'react-icons/fi';

const initialMessages = [
  { role: 'bot', text: 'Hello! 👋 I\'m MediAI Assistant. I can help you with:\n\n• Symptom guidance\n• Diet & exercise tips\n• Health FAQs\n• Mental wellness support\n\nHow can I help you today?', time: new Date() }
];

const quickReplies = ['What should I eat for diabetes?', 'I have a headache', 'Tips for better sleep', 'How to reduce stress?'];

const botResponses = {
  headache: 'For headaches, I recommend:\n\n1. 💧 Stay well hydrated\n2. 😴 Get adequate rest (7-8 hours)\n3. 🧘 Try relaxation techniques\n4. 💊 Over-the-counter pain relievers\n\n⚠️ If headaches persist for more than 48 hours or are severe, please consult a neurologist.',
  diabetes: 'Great question! For diabetes management:\n\n🥗 **Diet Tips:**\n• Eat more whole grains, vegetables, lean proteins\n• Avoid refined sugars and processed foods\n• Small, frequent meals\n• Include fiber-rich foods\n\n🏃 **Lifestyle:**\n• 30 min daily exercise\n• Monitor blood sugar regularly\n• Stay hydrated\n\nWould you like me to suggest a detailed meal plan?',
  sleep: 'Here are proven tips for better sleep:\n\n1. 🕐 Maintain consistent sleep schedule\n2. 📱 No screens 1 hour before bed\n3. 🌡️ Keep room cool (65-68°F)\n4. ☕ No caffeine after 2 PM\n5. 🧘 Practice relaxation before bed\n6. 🏋️ Regular exercise (not before bed)\n7. 🌙 Create dark, quiet environment\n\nIf sleep issues persist, consider consulting a sleep specialist.',
  stress: 'Here are effective stress management techniques:\n\n1. 🧘 **Meditation** - Start with 5 min daily\n2. 🏃 **Exercise** - Natural stress reliever\n3. 🫁 **Deep breathing** - 4-7-8 technique\n4. 📝 **Journaling** - Write your thoughts\n5. 👥 **Social support** - Talk to loved ones\n6. 🎵 **Music** - Listen to calming music\n7. 🌿 **Nature** - Spend time outdoors\n\nRemember, it\'s okay to seek professional help for chronic stress!',
  default: 'Thank you for your question! Based on general health guidelines, I recommend:\n\n1. Maintain a balanced diet\n2. Stay physically active\n3. Get regular health checkups\n4. Stay hydrated\n5. Get adequate sleep\n\nWould you like more specific guidance? You can also try our AI Symptom Checker for a detailed analysis. 🏥'
};

const Chatbot = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const getResponse = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('headache') || lower.includes('head')) return botResponses.headache;
    if (lower.includes('diabetes') || lower.includes('sugar') || lower.includes('eat') || lower.includes('diet')) return botResponses.diabetes;
    if (lower.includes('sleep') || lower.includes('insomnia')) return botResponses.sleep;
    if (lower.includes('stress') || lower.includes('anxiety') || lower.includes('mental')) return botResponses.stress;
    return botResponses.default;
  };

  const handleSend = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setMessages(prev => [...prev, { role: 'user', text: msg, time: new Date() }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: getResponse(msg), time: new Date() }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="page-container flex flex-col h-[calc(100vh-4rem)]">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-4"><FaRobot className="text-primary-500" /> AI Health Assistant</h1>

      {/* Chat Messages */}
      <div className="flex-1 glass-card p-4 overflow-y-auto mb-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
              <div className={`flex items-start gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'gradient-primary' : 'bg-surface-200 dark:bg-surface-700'}`}>
                  {msg.role === 'user' ? <FaUser className="text-white text-xs" /> : <FaRobot className="text-primary-500 text-xs" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm whitespace-pre-line ${msg.role === 'user' ? 'gradient-primary text-white rounded-tr-md' : 'bg-surface-100 dark:bg-surface-700 rounded-tl-md'}`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center"><FaRobot className="text-primary-500 text-xs" /></div>
              <div className="bg-surface-100 dark:bg-surface-700 p-3 rounded-2xl rounded-tl-md">
                <div className="flex gap-1"><span className="w-2 h-2 bg-surface-400 rounded-full animate-bounce" /><span className="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} /><span className="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} /></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Replies */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        {quickReplies.map((q, i) => (
          <button key={i} onClick={() => handleSend(q)} className="px-3 py-1.5 rounded-full border border-primary-300 dark:border-primary-700 text-xs text-primary-600 dark:text-primary-400 whitespace-nowrap hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">{q}</button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="input-field flex-1" placeholder="Type your health question..." />
        <button onClick={() => handleSend()} className="btn-primary !px-4"><FiSend /></button>
      </div>
    </div>
  );
};

export default Chatbot;
