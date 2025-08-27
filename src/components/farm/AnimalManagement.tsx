// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Animal {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  birthDate: string | null;
  acquisitionDate: string | null;
  status: string | null;
  imageUrl: string | null;
  userId: string | null;
  createdAt: string;
}

const AnimalManagement: React.FC<{ userId: string }> = ({ userId }) => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<Animal>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAnimals();
  }, [userId]);

  async function fetchAnimals() {
    setLoading(true);
    const { data, error } = await supabase
      .from('animals')
      .select('*')
      .eq('userId', userId);
    if (!error && data) {
      const transformedData = data.map(item => ({
        id: item.id,
        name: item.name,
        species: item.species,
        breed: item.breed,
        birthDate: item.birth_date,
        acquisitionDate: item.acquisition_date,
        status: item.status,
        imageUrl: null,
        userId: item.user_id,
        createdAt: item.created_at || new Date().toISOString()
      }));
      setAnimals(transformedData);
    }
    setLoading(false);
  }

  async function handleSave() {
    setLoading(true);
    let finalImageUrl = imageUrl;
    if (imageFile) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(imageFile.type)) {
        alert('Only JPEG, PNG, or WebP images are allowed.');
        setLoading(false);
        return;
      }
      if (imageFile.size > 1024 * 1024) {
        alert('Image must be less than 1MB.');
        setLoading(false);
        return;
      }
      const { data } = await supabase.storage.from('animal-images').upload(`animals/${Date.now()}_${imageFile.name}`, imageFile);
      if (data?.path) {
        const { data: urlData } = supabase.storage.from('animal-images').getPublicUrl(data.path);
        finalImageUrl = urlData.publicUrl;
      }
    }
    if (editingId) {
      await supabase.from('animals').update({ ...form, imageUrl: finalImageUrl } as any).eq('id', editingId);
    } else {
      await supabase.from('animals').insert({ ...form, userId: userId, imageUrl: finalImageUrl } as any);
    }
    setForm({});
    setImageFile(null);
    setImageUrl('');
    setEditingId(null);
    fetchAnimals();
  }

  async function handleDelete(id: string) {
    setLoading(true);
    await supabase.from('animals').delete().eq('id', id);
    fetchAnimals();
  }

  function startEdit(animal: Animal) {
    setForm(animal);
    setImageUrl(animal.imageUrl || '');
    setEditingId(animal.id);
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Animal Management</h2>
      <form className="mb-4 grid grid-cols-2 gap-2" onSubmit={e => { e.preventDefault(); handleSave(); }}>
        <input className="border p-2 rounded" placeholder="Name" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        <input className="border p-2 rounded" placeholder="Species" value={form.species || ''} onChange={e => setForm(f => ({ ...f, species: e.target.value }))} required />
        <input className="border p-2 rounded" placeholder="Breed" value={form.breed || ''} onChange={e => setForm(f => ({ ...f, breed: e.target.value }))} />
        <input className="border p-2 rounded" type="date" placeholder="Birth Date" value={form.birthDate || ''} onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))} />
        <input className="border p-2 rounded" type="date" placeholder="Acquisition Date" value={form.acquisitionDate || ''} onChange={e => setForm(f => ({ ...f, acquisitionDate: e.target.value }))} />
        <select className="border p-2 rounded" value={form.status || 'active'} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
          <option value="active">Active</option>
          <option value="sold">Sold</option>
          <option value="deceased">Deceased</option>
        </select>
        <div className="col-span-2">
          <label htmlFor="animal-image" className="block text-sm font-medium text-gray-700">Animal Image (max 1MB, JPEG/PNG/WebP)</label>
          <input type="file" id="animal-image" accept="image/jpeg,image/png,image/webp" onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              setImageFile(file);
              setImageUrl('');
            }
          }} />
          {imageUrl && <img src={imageUrl} alt="Animal" className="mt-2 h-24 rounded" />}
        </div>
        <Button type="submit" className="col-span-2">{editingId ? 'Update' : 'Add'} Animal</Button>
      </form>
      {loading && <div>Loading...</div>}
      <div className="space-y-2">
        {animals.map(animal => (
          <Card key={animal.id} className="p-2 flex justify-between items-center">
            <CardContent>
              <div className="font-bold flex items-center gap-2">
                {animal.imageUrl && <img src={animal.imageUrl} alt="Animal" className="h-10 w-10 rounded-full object-cover" />}
                {animal.name} ({animal.species})
              </div>
              <div className="text-xs text-gray-500">Breed: {animal.breed || 'N/A'} | Status: {animal.status}</div>
              <div className="text-xs text-gray-500">Birth: {animal.birthDate || 'N/A'} | Acquired: {animal.acquisitionDate || 'N/A'}</div>
            </CardContent>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => startEdit(animal)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(animal.id)}>Delete</Button>
            </div>
          </Card>
        ))}
        {animals.length === 0 && !loading && <div className="text-gray-500">No animals found.</div>}
      </div>
    </div>
  );
};

export default AnimalManagement;
