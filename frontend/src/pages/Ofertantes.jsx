import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Star, MapPin, Search, MessageSquare, Phone } from 'lucide-react';

const providers = [
  { id: '1', name: 'Armandeep S.', avatar: 'https://i.pravatar.cc/150?img=12', rating: 4.8, reviews: 91, profession: 'Eletricista, faz-tudo', location: 'São Paulo (Vila Mariana)', distance: '1.8 km', verified: true },
  { id: '2', name: 'Emanuel D.', avatar: 'https://i.pravatar.cc/150?img=33', rating: 5.0, reviews: 161, profession: 'Engenheiro Civil', location: 'São Paulo (Consolação)', distance: '3.2 km', verified: true },
  { id: '3', name: 'Paulo M.', avatar: 'https://i.pravatar.cc/150?img=15', rating: 4.9, reviews: 45, profession: 'Montador de móveis', location: 'Osasco (Jardim Novo)', distance: '5 km', verified: true },
  { id: '4', name: 'Juliana S.', avatar: 'https://i.pravatar.cc/150?img=45', rating: 5.0, reviews: 28, profession: 'Designer de interiores', location: 'São Paulo (Pinheiros)', distance: '2.5 km', verified: false },
  { id: '5', name: 'Carlos R.', avatar: 'https://i.pravatar.cc/150?img=25', rating: 4.7, reviews: 63, profession: 'Encanador', location: 'Guarulhos', distance: '8 km', verified: true },
  { id: '6', name: 'Ana B.', avatar: 'https://i.pravatar.cc/150?img=44', rating: 4.6, reviews: 37, profession: 'Professora particular', location: 'São Paulo (Moema)', distance: '4 km', verified: false },
];

const categories = ['Todos', 'Eletricista', 'Encanador', 'Pintor', 'Mudança', 'Limpeza', 'Montagem', 'Jardinagem', 'TI', 'Aulas'];

const Ofertantes = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filtered = providers.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.profession.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'Todos' || p.profession.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-[#FFF5F3] pb-20">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-4">
        <h1 className="text-xl font-bold mb-4">Prestadores de serviço</h1>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar prestador ou serviço..." className="pl-10 h-10" data-testid="search-providers" />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 hide-scrollbar">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-green-500 text-white border-green-500' : 'border-gray-300 text-gray-600 hover:border-green-500'}`}
              data-testid={`cat-${cat}`}
            >{cat}</button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map(provider => (
            <Card key={provider.id} className="p-4 hover:shadow-md transition-shadow" data-testid={`provider-${provider.id}`}>
              <div className="flex items-start gap-4">
                <Avatar className="w-14 h-14 cursor-pointer" onClick={() => navigate(`/perfil?id=${provider.id}`)}>
                  <AvatarImage src={provider.avatar} />
                  <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm cursor-pointer hover:underline" onClick={() => navigate(`/perfil?id=${provider.id}`)}>{provider.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-bold">{provider.rating}</span>
                      <span className="text-xs text-gray-500">({provider.reviews})</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{provider.profession}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{provider.location} - {provider.distance}</span>
                  </div>
                  {provider.verified && <span className="inline-block text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full mt-1">Verificado</span>}
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white rounded-full text-xs h-8" onClick={() => navigate(`/mensagens?userId=${provider.id}&userName=${encodeURIComponent(provider.name)}`)}>
                      <MessageSquare className="w-3 h-3 mr-1" /> Contatar
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-full text-xs h-8">
                      <Phone className="w-3 h-3 mr-1" /> Ligar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && <p className="text-center text-gray-400 py-8">Nenhum prestador encontrado</p>}
        </div>
      </div>
    </div>
  );
};

export default Ofertantes;
