'use client';

import { summarizeDecision } from "@/ai/flows/summarize-decision";
import { createAnnouncement } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Bot, Clipboard, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton({ disabled }: { disabled: boolean }) {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" disabled={disabled || pending}>
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Posting...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Post Announcement
          </>
        )}
      </Button>
    );
}

export default function NewAnnouncementPage() {
  const [meetingNotes, setMeetingNotes] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');
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
    <form action={createAnnouncement} className="grid gap-6">
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
            <Button type="button" onClick={handleGenerateSummary} disabled={isLoading}>
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
            <CardTitle>New Announcement</CardTitle>
            <CardDescription>
              Review the AI-generated summary, give it a title, and post it.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="Enter announcement title" 
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  required
                />
            </div>
            <div className="grid gap-2 relative">
                <Label htmlFor="content">Summary</Label>
                <Textarea
                    id="content"
                    name="content"
                    placeholder="Your generated announcement will appear here..."
                    className="min-h-[250px] lg:min-h-[305px] bg-muted/50"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    required
                />
                 {summary && (
                    <Button variant="ghost" size="icon" type="button" className="absolute top-0 right-0 m-2 h-8 w-8" onClick={copyToClipboard}>
                        <Clipboard className="h-4 w-4" />
                    </Button>
                )}
            </div>
             <SubmitButton disabled={!summary || !announcementTitle} />
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
