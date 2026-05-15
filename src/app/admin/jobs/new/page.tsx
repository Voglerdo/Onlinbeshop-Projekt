
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
import styles from './page.styles.module.css';

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
    <div className={styles.adminJobsNewContainerPrimary}>
      <Link href="/admin" className={styles.adminJobsNewLayoutPrimary}>
        <ArrowLeft className={styles.arrowLeftIcon} /> Zurück zur Konsole
      </Link>

      <div className={styles.adminJobsNewContainerSecondary}>
        <h1 className={styles.adminjobsnewTitle}>
          <Briefcase className={styles.briefcaseIcon} />
          Neue Ausschreibung
        </h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.adminJobsNewContainerTertiary}>
            <div className={styles.adminJobsNewContainerSecondary}>
              <Label htmlFor="title">Titel</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={styles.input10} required />
            </div>
            <div className={styles.adminJobsNewContainerSecondary}>
              <Label htmlFor="department">Abteilung</Label>
              <Input id="department" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className={styles.input10} required />
            </div>
            <div className={styles.adminJobsNewContainerSecondary}>
              <Label htmlFor="location">Standort</Label>
              <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className={styles.input10} required />
            </div>
            <div className={styles.adminJobsNewContainerSecondary}>
              <Label htmlFor="type">Typ</Label>
              <Select defaultValue="Full-time" onValueChange={(v) => setFormData({ ...formData, type: v as any })}>
                <SelectTrigger className={styles.input10}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={styles.selectcontent11}>
                  <SelectItem value="Full-time">Vollzeit</SelectItem>
                  <SelectItem value="Part-time">Teilzeit</SelectItem>
                  <SelectItem value="Contract">Projekt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={styles.adminJobsNewContainerTertiary}>
            <Label>Anforderungen</Label>
            {formData.requirements.map((req, index) => (
              <div key={index} className={styles.adminJobsNewLayoutSecondary}>
                <Input value={req} onChange={(e) => handleRequirementChange(index, e.target.value)} className={styles.input13} />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeRequirement(index)}><X className={styles.arrowLeftIcon} /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addRequirement}><Plus className={styles.hinzufugenButton} /> Hinzufügen</Button>
          </div>
        </div>

        <div className={styles.adminJobsNewContainerSecondary}>
          <Label htmlFor="description">Beschreibung</Label>
          <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={styles.textarea15} required />
        </div>

        <Button type="submit" disabled={isSaving} className={styles.actionButton}>
          {isSaving ? <Loader2 className={styles.loader2Icon} /> : <Save className={styles.loader2Icon2} />}
          Position veröffentlichen
        </Button>
      </form>
    </div>
  );
}

