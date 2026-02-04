import React, { useState } from 'react';
import { programmingLanguages } from '@/data/languages';
import { ArrowRight, ArrowLeftRight, Copy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CrossLanguageTranslator: React.FC = () => {
  const [sourceCode, setSourceCode] = useState('');
  const [translatedCode, setTranslatedCode] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('python');
  const [targetLanguage, setTargetLanguage] = useState('javascript');
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!sourceCode.trim()) {
      toast({
        title: "No code to translate",
        description: "Please enter some code first",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);
    setTranslatedCode('Translating...');

    try {
      const sourceLang = programmingLanguages.find(l => l.id === sourceLanguage)?.name || sourceLanguage;
      const targetLang = programmingLanguages.find(l => l.id === targetLanguage)?.name || targetLanguage;

      const response = await supabase.functions.invoke('chat', {
        body: {
          messages: [
            {
              role: 'system',
              content: `You are a code translator. Translate the given ${sourceLang} code to ${targetLang}. 
              Only output the translated code, no explanations.
              Preserve the logic and functionality exactly.
              Add brief comments explaining key differences if the syntax is very different.`
            },
            { role: 'user', content: sourceCode }
          ]
        }
      });

      if (response.data) {
        // Handle streaming or direct response
        const text = typeof response.data === 'string' ? response.data : '';
        setTranslatedCode(text || 'Translation complete. Check the output.');
      } else {
        setTranslatedCode('Translation failed. Please try again.');
      }
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedCode('Error during translation. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    const tempCode = sourceCode;
    setSourceCode(translatedCode);
    setTranslatedCode(tempCode);
  };

  const copyTranslated = () => {
    navigator.clipboard.writeText(translatedCode);
    toast({ title: "Copied!", description: "Translated code copied to clipboard" });
  };

  const popularLanguages = programmingLanguages.filter(l => 
    ['python', 'javascript', 'typescript', 'java', 'cpp', 'csharp', 'go', 'rust', 'ruby', 'kotlin', 'swift', 'php'].includes(l.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <ArrowLeftRight className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Code Translator</h2>
        </div>
        <p className="text-muted-foreground">
          Translate code between programming languages using AI
        </p>
      </div>

      {/* Language Selectors */}
      <div className="flex items-center justify-center gap-4">
        <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="From" />
          </SelectTrigger>
          <SelectContent>
            {popularLanguages.map(lang => (
              <SelectItem key={lang.id} value={lang.id}>
                {lang.icon} {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon" onClick={swapLanguages}>
          <ArrowLeftRight className="h-4 w-4" />
        </Button>

        <Select value={targetLanguage} onValueChange={setTargetLanguage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="To" />
          </SelectTrigger>
          <SelectContent>
            {popularLanguages.map(lang => (
              <SelectItem key={lang.id} value={lang.id}>
                {lang.icon} {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Code Areas */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <span>{programmingLanguages.find(l => l.id === sourceLanguage)?.icon}</span>
              {programmingLanguages.find(l => l.id === sourceLanguage)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              placeholder="Paste your code here..."
              className="min-h-[300px] font-mono text-sm"
              spellCheck={false}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{programmingLanguages.find(l => l.id === targetLanguage)?.icon}</span>
                {programmingLanguages.find(l => l.id === targetLanguage)?.name}
              </div>
              {translatedCode && (
                <Button variant="ghost" size="sm" onClick={copyTranslated}>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={translatedCode}
              readOnly
              placeholder="Translated code will appear here..."
              className="min-h-[300px] font-mono text-sm bg-muted"
              spellCheck={false}
            />
          </CardContent>
        </Card>
      </div>

      {/* Translate Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleTranslate}
          disabled={isTranslating || !sourceCode.trim()}
          className="gap-2"
        >
          <Sparkles className="h-5 w-5" />
          {isTranslating ? 'Translating...' : 'Translate Code'}
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Tips */}
      <Card className="bg-secondary/50">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> The translator works best with complete, well-formed code snippets.
            Complex language-specific features may require manual adjustments.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrossLanguageTranslator;
