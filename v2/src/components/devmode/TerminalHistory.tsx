import React from 'react';
import { TerminalHistory as TerminalHistoryType } from '@/types/devMode';
import { Clock, Code, Trash2, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';

interface TerminalHistoryProps {
  history: TerminalHistoryType[];
  onClear: () => void;
}

const TerminalHistory: React.FC<TerminalHistoryProps> = ({ history, onClear }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const exportHistory = () => {
    const data = history.map(h => ({
      ...h,
      timestamp: new Date(h.timestamp).toISOString(),
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terminal-history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">No History Yet</h3>
          <p className="text-muted-foreground text-sm">
            Your code execution history will appear here.
            <br />
            History is saved locally for offline review.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-primary" />
          Terminal History
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportHistory}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={onClear}>
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">
          ⚠️ History is saved locally. You can review offline but cannot re-run or ask AI.
        </p>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2 pr-4">
            {[...history].reverse().map((item) => (
              <Collapsible
                key={item.id}
                open={expandedItems.includes(item.id)}
                onOpenChange={() => toggleItem(item.id)}
              >
                <div className="border border-border rounded-lg overflow-hidden">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-3 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Code className="h-4 w-4 text-muted-foreground" />
                        <div className="text-left">
                          <Badge variant="outline" className="text-xs">
                            {item.language}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(item.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.aiFeedback && item.aiFeedback.length > 0 && (
                          <Badge className="bg-primary/10 text-primary text-xs">
                            AI Feedback
                          </Badge>
                        )}
                        {expandedItems.includes(item.id) ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="border-t border-border">
                      {/* Code */}
                      <div className="p-3 bg-muted/30">
                        <p className="text-xs font-medium mb-2 text-muted-foreground">Code</p>
                        <pre className="font-mono text-xs bg-background p-3 rounded-md overflow-x-auto max-h-[150px]">
                          {item.code}
                        </pre>
                      </div>

                      {/* Output */}
                      <div className="p-3 border-t border-border">
                        <p className="text-xs font-medium mb-2 text-muted-foreground">Output</p>
                        <pre className="font-mono text-xs bg-muted p-3 rounded-md overflow-x-auto max-h-[100px]">
                          {item.output}
                        </pre>
                      </div>

                      {/* AI Feedback */}
                      {item.aiFeedback && item.aiFeedback.length > 0 && (
                        <div className="p-3 border-t border-border bg-primary/5">
                          <p className="text-xs font-medium mb-2 text-muted-foreground">AI Feedback</p>
                          <div className="space-y-2">
                            {item.aiFeedback.map((fb, idx) => (
                              <div
                                key={idx}
                                className={`p-2 rounded text-xs ${
                                  fb.type === 'error' ? 'bg-destructive/10 border-l-2 border-destructive' :
                                  fb.type === 'warning' ? 'bg-warning/10 border-l-2 border-warning' :
                                  fb.type === 'suggestion' ? 'bg-primary/10 border-l-2 border-primary' :
                                  'bg-success/10 border-l-2 border-success'
                                }`}
                              >
                                {fb.message}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TerminalHistory;
