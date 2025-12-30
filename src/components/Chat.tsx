import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { User, Message } from '@/types/user';

interface ChatProps {
  currentUser: User;
  onClose: () => void;
}

const Chat = ({ currentUser, onClose }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chat_messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      text: newMessage,
      timestamp: new Date().toISOString(),
      isAdmin: false
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem('chat_messages', JSON.stringify(updatedMessages));
    setNewMessage('');
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50"
      >
        <Icon name="MessageCircle" size={24} />
        {messages.length > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
            {messages.filter(m => !m.isAdmin).length}
          </div>
        )}
      </button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-primary text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-2xl">
            👨‍💼
          </div>
          <div>
            <h3 className="font-semibold">Чат с администратором</h3>
            <p className="text-xs text-white/80">Онлайн</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
            className="text-white hover:bg-white/20"
          >
            <Icon name="Minus" size={18} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <Icon name="X" size={18} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Icon name="MessageSquare" size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Начните диалог с администратором</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.isAdmin ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xl ${
                msg.isAdmin ? 'bg-primary/10' : 'bg-accent/10'
              }`}>
                {msg.avatar.startsWith('data:') ? (
                  <img src={msg.avatar} alt={msg.username} className="w-full h-full rounded-full object-cover" />
                ) : (
                  msg.avatar
                )}
              </div>
              <div className={`flex-1 ${msg.isAdmin ? 'text-left' : 'text-right'}`}>
                <div className={`inline-block px-4 py-2 rounded-2xl max-w-[80%] ${
                  msg.isAdmin
                    ? 'bg-white border border-border'
                    : 'bg-primary text-white'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 px-2">
                  {new Date(msg.timestamp).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Напишите сообщение..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Icon name="Send" size={18} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Chat;
