
import React, { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface ProfileData {
  full_name: string;
  email: string;
  contact_number: string;
  county: string;
  bio: string;
  farm_size: number;
  farm_type: string;
  experience_years: number;
  specialization: string[];
  avatar_url?: string;
}

const ProfileEditor: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState<ProfileData>({
    full_name: '',
    email: user?.email || '',
    contact_number: '',
    county: '',
    bio: '',
    farm_size: 0,
    farm_type: '',
    experience_years: 0,
    specialization: [],
    avatar_url: ''
  });

  const [newSpecialization, setNewSpecialization] = useState('');

  React.useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          email: data.email || user?.email || '',
          contact_number: data.contact_number || '',
          county: data.county || '',
          bio: data.bio || '',
          farm_size: data.farm_size || 0,
          farm_type: data.farm_type || '',
          experience_years: data.experience_years || 0,
          specialization: data.specialization || [],
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return null;

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 2MB",
        variant: "destructive"
      });
      return null;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = await uploadAvatar(file);
      if (url) {
        setProfile(prev => ({ ...prev, avatar_url: url }));
      }
    }
  };

  const addSpecialization = () => {
    if (newSpecialization.trim() && !profile.specialization.includes(newSpecialization.trim())) {
      setProfile(prev => ({
        ...prev,
        specialization: [...prev.specialization, newSpecialization.trim()]
      }));
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (spec: string) => {
    setProfile(prev => ({
      ...prev,
      specialization: prev.specialization.filter(s => s !== spec)
    }));
  };

  const saveProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!"
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback>
              {profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Camera className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Change Photo'}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Max 2MB. JPG, PNG supported.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={profile.full_name}
              onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="Your full name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={profile.email}
              disabled
              className="bg-muted"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contact_number">Contact Number</Label>
            <Input
              id="contact_number"
              value={profile.contact_number}
              onChange={(e) => setProfile(prev => ({ ...prev, contact_number: e.target.value }))}
              placeholder="+254 7XX XXX XXX"
            />
          </div>
          <div>
            <Label htmlFor="county">County</Label>
            <Select 
              value={profile.county} 
              onValueChange={(value) => setProfile(prev => ({ ...prev, county: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your county" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nairobi">Nairobi</SelectItem>
                <SelectItem value="kiambu">Kiambu</SelectItem>
                <SelectItem value="machakos">Machakos</SelectItem>
                <SelectItem value="kajiado">Kajiado</SelectItem>
                <SelectItem value="murang'a">Murang'a</SelectItem>
                <SelectItem value="nyeri">Nyeri</SelectItem>
                <SelectItem value="kirinyaga">Kirinyaga</SelectItem>
                <SelectItem value="nyandarua">Nyandarua</SelectItem>
                <SelectItem value="laikipia">Laikipia</SelectItem>
                <SelectItem value="nakuru">Nakuru</SelectItem>
                <SelectItem value="uasin-gishu">Uasin Gishu</SelectItem>
                <SelectItem value="trans-nzoia">Trans Nzoia</SelectItem>
                <SelectItem value="bungoma">Bungoma</SelectItem>
                <SelectItem value="kakamega">Kakamega</SelectItem>
                <SelectItem value="vihiga">Vihiga</SelectItem>
                <SelectItem value="siaya">Siaya</SelectItem>
                <SelectItem value="kisumu">Kisumu</SelectItem>
                <SelectItem value="homa-bay">Homa Bay</SelectItem>
                <SelectItem value="migori">Migori</SelectItem>
                <SelectItem value="kisii">Kisii</SelectItem>
                <SelectItem value="nyamira">Nyamira</SelectItem>
                <SelectItem value="meru">Meru</SelectItem>
                <SelectItem value="tharaka-nithi">Tharaka Nithi</SelectItem>
                <SelectItem value="embu">Embu</SelectItem>
                <SelectItem value="kitui">Kitui</SelectItem>
                <SelectItem value="machakos">Machakos</SelectItem>
                <SelectItem value="makueni">Makueni</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bio */}
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={profile.bio}
            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell us about yourself and your farming journey..."
            rows={3}
          />
        </div>

        {/* Farm Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="farm_size">Farm Size (Acres)</Label>
            <Input
              id="farm_size"
              type="number"
              value={profile.farm_size}
              onChange={(e) => setProfile(prev => ({ ...prev, farm_size: parseFloat(e.target.value) || 0 }))}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="farm_type">Farm Type</Label>
            <Select 
              value={profile.farm_type} 
              onValueChange={(value) => setProfile(prev => ({ ...prev, farm_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select farm type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mixed">Mixed Farming</SelectItem>
                <SelectItem value="crop">Crop Production</SelectItem>
                <SelectItem value="livestock">Livestock</SelectItem>
                <SelectItem value="poultry">Poultry</SelectItem>
                <SelectItem value="dairy">Dairy</SelectItem>
                <SelectItem value="horticulture">Horticulture</SelectItem>
                <SelectItem value="greenhouse">Greenhouse</SelectItem>
                <SelectItem value="fish">Fish Farming</SelectItem>
                <SelectItem value="organic">Organic Farming</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="experience_years">Years of Experience</Label>
            <Input
              id="experience_years"
              type="number"
              value={profile.experience_years}
              onChange={(e) => setProfile(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
              placeholder="0"
            />
          </div>
        </div>

        {/* Specializations */}
        <div>
          <Label>Specializations</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {profile.specialization.map((spec) => (
              <Badge key={spec} variant="secondary" className="flex items-center gap-1">
                {spec}
                <button
                  onClick={() => removeSpecialization(spec)}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newSpecialization}
              onChange={(e) => setNewSpecialization(e.target.value)}
              placeholder="Add specialization (e.g., Maize, Tomatoes, Dairy)"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
            />
            <Button type="button" variant="outline" onClick={addSpecialization}>
              Add
            </Button>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900">Privacy Notice</p>
            <p className="text-blue-800">
              Your profile information helps connect you with relevant opportunities and fellow farmers. 
              You can control what information is visible to others in your privacy settings.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={saveProfile} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileEditor;
