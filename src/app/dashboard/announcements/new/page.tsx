'use client';

import { summarizeDecision } from "@/ai/flows/summarize-decision";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Bot, Clipboard, Loader2 } from "lucide-react";
import { useState } from "react";

export default function NewAnnouncementPage() {
  const [meetingNotes, setMeetingNotes] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateSummary = async () => {
    if (!meetingNotes.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some meeting notes to summarize.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSummary('');

    try {
      const result = await summarizeDecision({ meetingNotes });
      setSummary(result.announcementSummary);
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    toast({
        title: "Copied!",
        description: "Summary copied to clipboard.",
    })
  }

  return (
    <div className="grid gap-6">
       <div>
        <h1 className="text-2xl font-semibold">AI Announcement Generator</h1>
        <p className="text-muted-foreground">
          Generate concise announcements from lengthy meeting notes.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Meeting Notes</CardTitle>
            <CardDescription>
              Paste the full text of your meeting notes below.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="meeting-notes">Notes</Label>
                <Textarea
                    id="meeting-notes"
                    placeholder="Start typing or paste your notes here..."
                    className="min-h-[300px] lg:min-h-[400px]"
                    value={meetingNotes}
                    onChange={(e) => setMeetingNotes(e.target.value)}
                    disabled={isLoading}
                />
            </div>
            <Button onClick={handleGenerateSummary} disabled={isLoading}>
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Bot className="mr-2 h-4 w-4" />
                )}
                Generate Summary
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Generated Announcement</CardTitle>
            <CardDescription>
              Review the AI-generated summary. You can copy it and post it as a new announcement.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2 relative">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                    id="summary"
                    placeholder="Your generated announcement will appear here..."
                    className="min-h-[300px] lg:min-h-[400px] bg-muted/50"
                    value={summary}
                    readOnly
                />
                 {summary && (
                    <Button variant="ghost" size="icon" className="absolute top-0 right-0 m-2 h-8 w-8" onClick={copyToClipboard}>
                        <Clipboard className="h-4 w-4" />
                    </Button>
                )}
            </div>
             <Button disabled={!summary}>Post Announcement</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
