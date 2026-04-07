
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ArrowLeft, Plus, X, Save, Briefcase, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { externalApiService } from '@/services/api-client';

export default function NewJobPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: ['']
  });

  const handleRequirementChange = (index: number, value: string) => {
    const newReqs = [...formData.requirements];
    newReqs[index] = value;
    setFormData({ ...formData, requirements: newReqs });
  };

  const addRequirement = () => {
    setFormData({ ...formData, requirements: [...formData.requirements, ''] });
  };

  const removeRequirement = (index: number) => {
    const newReqs = formData.requirements.filter((_, i) => i !== index);
    setFormData({ ...formData, requirements: newReqs.length ? newReqs : [''] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const newJob = {
      ...formData,
      requirements: formData.requirements.filter(r => r.trim() !== ''),
      createdAt: new Date().toISOString()
    };

    try {
      await externalApiService.syncJob(newJob);
      toast({
        title: "Position veröffentlicht",
        description: "Das Angebot wurde erfolgreich an das Karriereregister gesendet.",
      });
      router.push('/admin');
    } catch (err) {
      toast({ title: "Fehler", description: "Konnte die Position nicht speichern.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8 max-w-4xl space-y-8">
      <Link href="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors gap-2">
        <ArrowLeft className="h-4 w-4" /> Zurück zur Konsole
      </Link>

      <div className="space-y-2">
        <h1 className="text-4xl font-headline font-bold flex items-center gap-3">
          <Briefcase className="h-8 w-8 text-secondary" />
          Neue Ausschreibung
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titel</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="bg-card h-12" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Abteilung</Label>
              <Input id="department" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="bg-card h-12" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Standort</Label>
              <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="bg-card h-12" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Typ</Label>
              <Select defaultValue="Full-time" onValueChange={(v) => setFormData({ ...formData, type: v as any })}>
                <SelectTrigger className="bg-card h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="Full-time">Vollzeit</SelectItem>
                  <SelectItem value="Part-time">Teilzeit</SelectItem>
                  <SelectItem value="Contract">Projekt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Anforderungen</Label>
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex gap-2">
                <Input value={req} onChange={(e) => handleRequirementChange(index, e.target.value)} className="bg-card h-10" />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeRequirement(index)}><X className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addRequirement}><Plus className="h-4 w-4 mr-2" /> Hinzufügen</Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Beschreibung</Label>
          <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="min-h-[200px] bg-card" required />
        </div>

        <Button type="submit" disabled={isSaving} className="w-full h-14 bg-primary text-lg font-bold">
          {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="mr-2 h-6 w-6" />}
          Position veröffentlichen
        </Button>
      </form>
    </div>
  );
}
