import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Camera, ArrowLeft, Check, MapPin, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const EditarPerfil = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [profession, setProfession] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleGetLocation = async () => {
    setLoadingLocation(true);
    if (!("geolocation" in navigator)) { showToast('Geolocalização não suportada'); setLoadingLocation(false); return; }
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 30000, maximumAge: 60000 });
      });
      const { latitude, longitude } = position.coords;
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`, { signal: AbortSignal.timeout(10000) });
      const data = await response.json();
      const parts = [data.locality, data.city, data.principalSubdivision, data.postcode].filter(Boolean);
      if (parts.length > 0) { setLocation(parts.join(', ')); showToast('Localização detectada!'); }
    } catch { showToast('Não foi possível detectar localização'); }
    setLoadingLocation(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/users/me', { name, phone, location });
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, name, phone, location }));
      showToast('Perfil atualizado!');
      setTimeout(() => navigate('/perfil'), 1000);
    } catch {
      showToast('Perfil salvo localmente');
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, name, phone, location }));
      setTimeout(() => navigate('/perfil'), 1000);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F3] pb-20">
      <Header />
      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg text-sm"><Check className="w-4 h-4 inline mr-2" />{toast}</div>}

      <div className="max-w-2xl mx-auto px-4 py-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 mb-4 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" /> Voltar
        </button>

        <Card className="p-6">
          <h1 className="text-xl font-bold mb-6">Editar perfil</h1>

          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-2xl">{name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm"><Camera className="w-4 h-4 mr-2" /> Alterar foto</Button>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG. Máx 5MB</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Nome completo</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="h-11" data-testid="edit-name" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Profissão</label>
              <Input value={profession} onChange={(e) => setProfession(e.target.value)} placeholder="Ex: Eletricista, Professor..." className="h-11" data-testid="edit-profession" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Telefone</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-9999" className="h-11" data-testid="edit-phone" />
            </div>
            <div className="relative">
              <label className="text-sm font-medium block mb-1">Endereço</label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Seu endereço" className="h-11 pr-10" data-testid="edit-location" />
              <button type="button" onClick={handleGetLocation} disabled={loadingLocation} className="absolute right-3 bottom-2.5 text-green-600 hover:text-green-700">
                {loadingLocation ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
              </button>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Apresentação</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Conte sobre você e seus serviços..." className="w-full h-24 border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-200" data-testid="edit-description" />
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full h-11 font-semibold" data-testid="save-profile-btn">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar alterações'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EditarPerfil;
