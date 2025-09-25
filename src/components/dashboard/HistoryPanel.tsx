import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, MessageSquare, Search, Calendar, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ChatStorage, getCurrentContext } from '@/lib/storageUtils';

interface SavedChat {
  id: string;
  name: string;
  createdAt: string;
  messages: any[];
}

interface HistoryPanelProps {
  onLoadChat: (chat: SavedChat) => void;
  onSectionChange: (section: string) => void;
}

export const HistoryPanel = ({ onLoadChat, onSectionChange }: HistoryPanelProps) => {
  const { toast } = useToast();
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    loadSavedChats();
  }, []);

  const loadSavedChats = () => {
    const chats = ChatStorage.get();
    setSavedChats(chats);
  };

  const deleteChat = (chatId: string) => {
    ChatStorage.delete(chatId);
    setSavedChats(prev => prev.filter(chat => chat.id !== chatId));
    
    const context = getCurrentContext();
    toast({
      title: "Chat deleted",
      description: `Removed from your ${context === 'official' ? 'Playground' : 'Dashboard'} history.`
    });
  };

  const startRename = (chat: SavedChat) => {
    setEditingId(chat.id);
    setEditName(chat.name);
  };

  const saveRename = () => {
    if (!editName.trim()) return;
    
    const updatedChats = savedChats.map(chat => 
      chat.id === editingId 
        ? { ...chat, name: editName.trim() }
        : chat
    );
    
    ChatStorage.update(updatedChats);
    setSavedChats(updatedChats);
    setEditingId(null);
    setEditName('');
    
    toast({
      title: "Chat renamed",
      description: "The conversation name has been updated."
    });
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditName('');
  };

  const filteredChats = savedChats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.messages.some(msg => {
      const messageText = msg.text || msg.content || '';
      return messageText.toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const getChatPreview = (messages: any[]) => {
    const userMessages = messages.filter(msg => msg.isUser);
    if (userMessages.length === 0) return 'New conversation';
    
    // Handle both 'text' and 'content' properties with null safety
    const firstMessage = userMessages[0];
    const messageText = firstMessage?.text || firstMessage?.content || '';
    
    if (!messageText) return 'New conversation';
    return messageText.slice(0, 60) + (messageText.length > 60 ? '...' : '');
  };

  const getMessageCount = (messages: any[]) => {
    return messages.filter(msg => msg.id !== 'typing').length;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-primary">Chat History</h1>
        <p className="text-muted-foreground">
          Your saved conversations with INGRES-AI
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search your chats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-accent" />
              <div>
                <div className="text-2xl font-bold">{savedChats.length}</div>
                <p className="text-xs text-muted-foreground">Total Chats</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-accent" />
              <div>
                <div className="text-2xl font-bold">
                  {savedChats.filter(chat => {
                    const date = new Date(chat.createdAt);
                    const today = new Date();
                    return date.toDateString() === today.toDateString();
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Edit2 className="w-4 h-4 text-accent" />
              <div>
                <div className="text-2xl font-bold">
                  {savedChats.reduce((total, chat) => total + getMessageCount(chat.messages), 0)}
                </div>
                <p className="text-xs text-muted-foreground">Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat List */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Conversations</CardTitle>
          <CardDescription>
            Click to load a conversation back into chat
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredChats.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  {searchTerm ? 'No matching chats found' : 'No saved chats yet'}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? 'Try a different search term'
                    : 'Start a conversation and save it to see it here'
                  }
                </p>
              </div>
              {!searchTerm && (
                <Button onClick={() => onSectionChange('chat')}>
                  Start Chatting
                </Button>
              )}
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className="p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => {
                        onLoadChat(chat);
                        onSectionChange('chat');
                      }}>
                        <div className="flex items-center gap-2 mb-2">
                          {editingId === chat.id ? (
                            <div className="flex-1 flex gap-2">
                              <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') saveRename();
                                  if (e.key === 'Escape') cancelRename();
                                }}
                                className="h-8 text-sm"
                                autoFocus
                              />
                              <Button size="sm" onClick={saveRename}>Save</Button>
                              <Button size="sm" variant="outline" onClick={cancelRename}>Cancel</Button>
                            </div>
                          ) : (
                            <>
                              <h3 className="font-medium truncate">{chat.name}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {getMessageCount(chat.messages)} msgs
                              </Badge>
                            </>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {getChatPreview(chat.messages)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(chat.createdAt)}
                        </p>
                      </div>
                      
                      {editingId !== chat.id && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              startRename(chat);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteChat(chat.id);
                            }}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};