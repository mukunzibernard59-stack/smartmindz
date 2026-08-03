import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fullName: string | null | undefined;
  avatarUrl: string | null | undefined;
  email?: string | null;
  onSaveName: (name: string) => Promise<{ error?: unknown } | void>;
  onUploadPhoto: (file: File) => Promise<{ error?: unknown } | void>;
}

const getInitials = (name: string | null | undefined) => {
  if (!name) return 'U';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({
  open, onOpenChange, fullName, avatarUrl, email, onSaveName, onUploadPhoto,
}) => {
  const [name, setName] = useState(fullName || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName(fullName || '');
      setPreview(null);
    }
  }, [open, fullName]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }

    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const res = await onUploadPhoto(file);
      if (res && 'error' in res && res.error) toast.error('Failed to upload photo');
      else toast.success('Profile photo updated');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSave = async () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) { toast.error('Please enter at least 2 characters'); return; }
    if (trimmed.length > 60) { toast.error('Name is too long'); return; }
    setSaving(true);
    try {
      const res = await onSaveName(trimmed);
      if (res && 'error' in res && res.error) toast.error('Could not save your name');
      else { toast.success('Profile updated'); onOpenChange(false); }
    } catch {
      toast.error('Could not save your name');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-strong bg-card">
        <DialogHeader>
          <DialogTitle>Edit your profile</DialogTitle>
          <DialogDescription>Choose your display name and profile photo.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3 py-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Change profile photo"
          >
            <Avatar className="h-24 w-24 border-2 border-primary/40">
              <AvatarImage src={preview || avatarUrl || undefined} alt={name || 'Profile photo'} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {getInitials(name || fullName)}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            </span>
          </button>
          <p className="text-xs text-muted-foreground">Tap the photo to change it (max 5MB)</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-name">Display name</Label>
          <Input
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={60}
          />
          {email && <p className="text-xs text-muted-foreground">{email}</p>}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="gradient-primary text-primary-foreground">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save
          </Button>
        </DialogFooter>

        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
