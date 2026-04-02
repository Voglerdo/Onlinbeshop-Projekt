
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
import { ArrowLeft, Plus, X, Save, Briefcase, MapPin, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function NewJobPage() {
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();
  
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!db) return;

    const jobsRef = collection(db, 'jobs');
    const timestamp = new Date().toISOString();
    
    const newJob = {
      title: formData.title,
      department: formData.department,
      location: formData.location,
      type: formData.type,
      description: formData.description,
      requirements: formData.requirements.filter(r => r.trim() !== ''),
      createdAt: timestamp
    };

    addDocumentNonBlocking(jobsRef, newJob);

    toast({
      title: "Position Posted",
      description: "The engagement is now live in the Blubber Baron careers registry.",
    });
    
    router.push('/admin');
  };

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8 max-w-4xl space-y-8">
      <Link href="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Console
      </Link>

      <div className="space-y-2">
        <h1 className="text-4xl font-headline font-bold flex items-center gap-3">
          <Briefcase className="h-8 w-8 text-secondary" />
          Open New Engagement
        </h1>
        <p className="text-muted-foreground">Scout for the next generation of Blubber Baron visionaries.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl border-none space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Position Title</Label>
              <Input 
                id="title" 
                placeholder="e.g., Master Aesthetic Designer" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-card h-12 text-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="department" 
                  placeholder="e.g., Sensory Research" 
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="bg-card h-12 pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="location" 
                  placeholder="e.g., Dubai / Remote" 
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-card h-12 pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Engagement Type</Label>
              <Select defaultValue="Full-time" onValueChange={(v) => setFormData({ ...formData, type: v as any })}>
                <SelectTrigger className="bg-card h-12">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Baron Requirements</Label>
                <Button type="button" variant="ghost" size="sm" onClick={addRequirement} className="text-secondary hover:text-secondary h-8">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      placeholder={`Requirement #${index + 1}`} 
                      value={req}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      className="bg-card h-10"
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeRequirement(index)} className="h-10 w-10 text-muted-foreground hover:text-destructive shrink-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <Label htmlFor="description" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Role Narrative</Label>
          <Textarea 
            id="description" 
            placeholder="Describe the responsibilities and vision for this role..." 
            className="min-h-[200px] bg-card border-border resize-none leading-relaxed text-base"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="pt-8 flex gap-4">
          <Button 
            type="submit" 
            className="flex-1 bg-primary hover:bg-primary/90 h-14 text-lg font-bold rounded-xl crimson-glow"
          >
            <Save className="mr-2 h-6 w-6" />
            Publish Position
          </Button>
          <Button 
            type="button" 
            variant="outline"
            className="h-14 px-8 border-border hover:bg-muted"
            onClick={() => router.push('/admin')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
