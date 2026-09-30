import React, { useState, useMemo } from 'react';
import { 
  Shield, Zap, Skull, Award, CheckCircle, 
  Circle, Plus, Search, Filter, X, Sparkles, Eye, FileText, Edit3 
} from 'lucide-react';
import { initialMcuData } from './data/mcuData';

export default function App() {
  const [movies, setMovies] = useState(initialMcuData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeModalMovie, setActiveModalMovie] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    releaseYear: 2026,
    phase: 'Phase 5',
    hero: '',
    heroClass: 'Human / Tech Genius',
    heroDescription: '',
    powerSource: '',
    antagonist: '',
    powerUpgrades: '',
    universeSignificance: '',
    poster: '',
    rating: 7.5
  });

  const phases = ['All', 'Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5', 'Phase 6'];

  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const matchesSearch = 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (movie.hero && movie.hero.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (movie.antagonist && movie.antagonist.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesPhase = selectedPhase === 'All' || movie.phase === selectedPhase;
      
      const matchesStatus = 
        selectedStatus === 'All' ? true :
        selectedStatus === 'Watched' ? movie.watched :
        selectedStatus === 'Unwatched' ? !movie.watched : true;

      return matchesSearch && matchesPhase && matchesStatus;
    });
  }, [movies, searchQuery, selectedPhase, selectedStatus]);

  const toggleWatchStatus = (id) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, watched: !m.watched } : m));
  };

  const openCreateForExisting = (movie) => {
    setEditingMovieId(movie.id);
    setFormData({
      title: movie.title,
      releaseYear: movie.releaseYear,
      phase: movie.phase,
      hero: movie.hero || '',
      heroClass: movie.heroClass || 'Enhanced / Super Soldier',
      heroDescription: movie.heroDescription || '',
      powerSource: movie.powerSource || '',
      antagonist: movie.antagonist || '',
      powerUpgrades: movie.powerUpgrades || '',
      universeSignificance: movie.universeSignificance || '',
      poster: movie.poster || 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=700&q=80',
      rating: movie.rating || 7.5
    });
    setIsFormOpen(true);
  };

  const openNewBlankForm = () => {
    setEditingMovieId(null);
    setFormData({
      title: '',
      releaseYear: 2026,
      phase: 'Phase 5',
      hero: '',
      heroClass: 'Human / Tech Genius',
      heroDescription: '',
      powerSource: '',
      antagonist: '',
      powerUpgrades: '',
      universeSignificance: '',
      poster: '',
      rating: 7.5
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.hero) return;

    if (editingMovieId !== null) {
      // Update existing placeholder to full dossier
      setMovies(prev => prev.map(m => {
        if (m.id === editingMovieId) {
          return {
            ...m,
            ...formData,
            hasDossier: true,
            themeColor: m.themeColor || 'from-red-950 via-slate-900 to-zinc-900'
          };
        }
        return m;
      }));
    } else {
      // Add completely new custom title
      const newMovie = {
        ...formData,
        id: Date.now(),
        watchlistIndex: movies.length + 1,
        hasDossier: true,
        poster: formData.poster || "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=700&q=80",
        themeColor: "from-red-950 via-slate-900 to-zinc-900",
        watched: false,
        favorite: false
      };
      setMovies([newMovie, ...movies]);
    }

    setIsFormOpen(false);
    setEditingMovieId(null);
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-[#212433] bg-[#0E1017]/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="bg-[#E62429] text-white px-2.5 py-1 text-sm font-black tracking-widest uppercase rounded shadow-md shadow-red-950/40">
              MARVEL
            </span>
            <span className="font-extrabold tracking-wider text-lg hidden sm:inline text-white">
              CHRONOLOGICAL DOSSIER & WATCHLIST
            </span>
          </div>

          <button
            onClick={openNewBlankForm}
            className="bg-[#E62429] hover:bg-[#ff2b31] transition text-white px-3.5 py-1.5 rounded-md font-semibold text-sm flex items-center gap-2 shadow-lg shadow-red-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Create Custom Entry</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        {/* Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-[#212433] bg-gradient-to-r from-[#17080a] via-[#10131e] to-[#0d0e14] p-6 sm:p-8">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E62429] uppercase tracking-widest bg-red-950/40 border border-red-800/50 px-2.5 py-1 rounded">
              <Sparkles className="w-3.5 h-3.5" /> S.H.I.E.L.D. Complete Chronological Database
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
              MCU Master Timeline Tracker
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Watched entries feature comprehensive intelligence dossiers. Unwatched films and series are queued chronologically—click <strong>Create Dossier Card</strong> on any item to log its intelligence.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-[#12141D] p-4 rounded-xl border border-[#232738]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search movie title, hero, or villain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#191C28] text-white pl-9 pr-4 py-2 rounded-lg border border-[#2E3349] focus:outline-none focus:border-[#E62429] text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#191C28] px-3 py-1.5 rounded-lg border border-[#2E3349] text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedPhase}
                onChange={(e) => setSelectedPhase(e.target.value)}
                className="bg-transparent text-slate-200 outline-none cursor-pointer"
              >
                {phases.map(p => <option key={p} value={p} className="bg-[#191C28]">{p}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-[#191C28] px-3 py-1.5 rounded-lg border border-[#2E3349] text-xs">
              <span className="text-slate-400">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-slate-200 outline-none cursor-pointer"
              >
                <option value="All" className="bg-[#191C28]">All Titles</option>
                <option value="Watched" className="bg-[#191C28]">Watched</option>
                <option value="Unwatched" className="bg-[#191C28]">Unwatched</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMovies.map((movie) => {
            // CARD VARIANT 1: FULL DOSSIER CARD (FOR WATCHED TITLES OR FILLED DOSSIERS)
            if (movie.hasDossier) {
              return (
                <div
                  key={movie.id}
                  className="bg-[#12141D] rounded-xl border border-[#232738] hover:border-[#E62429]/50 transition-all duration-300 flex flex-col overflow-hidden group shadow-lg"
                >
                  <div className={`h-44 relative overflow-hidden bg-gradient-to-br ${movie.themeColor || 'from-slate-900 to-slate-950'}`}>
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12141D] via-[#12141D]/50 to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      <span className="bg-[#E62429] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow">
                        {movie.phase}
                      </span>
                      <span className="bg-black/70 backdrop-blur-md text-slate-200 text-[11px] font-semibold px-2 py-0.5 rounded border border-white/10">
                        #{movie.watchlistIndex}
                      </span>
                      <span className="bg-black/60 backdrop-blur-md text-slate-300 text-[11px] px-2 py-0.5 rounded border border-white/10">
                        {movie.releaseYear}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleWatchStatus(movie.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition bg-emerald-500/25 text-emerald-400 border border-emerald-500/60 shadow-lg"
                      title="Watched"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>

                    <div className="absolute bottom-2 left-3 right-3">
                      <h3 className="text-lg font-black text-white leading-tight drop-shadow">
                        {movie.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-bold text-red-400 flex items-center gap-1.5">
                          <Shield className="w-4 h-4 text-[#E62429]" />
                          <span>{movie.hero}</span>
                        </div>
                        <span className="text-[11px] inline-block mt-0.5 bg-[#1B1F2E] text-slate-300 px-2 py-0.5 rounded border border-slate-700/50">
                          {movie.heroClass}
                        </span>
                      </div>

                      <div className="bg-[#171A26] p-2.5 rounded-lg border border-[#262B3F] text-xs space-y-1">
                        <div className="flex items-center gap-1 text-amber-400 font-semibold text-[11px] uppercase tracking-wide">
                          <Zap className="w-3.5 h-3.5" /> Power Source & Tech
                        </div>
                        <p className="text-slate-300 leading-relaxed text-[11px] line-clamp-2">
                          {movie.powerSource}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <Skull className="w-4 h-4 text-purple-400 shrink-0" />
                        <span><strong className="text-slate-200">Antagonist:</strong> {movie.antagonist}</span>
                      </div>

                      <div className="text-xs text-slate-400 border-l-2 border-[#E62429] pl-2 py-0.5 italic line-clamp-2">
                        "{movie.universeSignificance}"
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#232738] flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        Rating: <strong className="text-amber-400">{movie.rating}</strong> / 10
                      </span>
                      <button
                        onClick={() => setActiveModalMovie(movie)}
                        className="text-xs font-semibold text-[#E62429] hover:text-red-400 flex items-center gap-1 transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> Full Dossier
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // CARD VARIANT 2: UNWATCHED PLACEHOLDER CARD (NAME ONLY)
            return (
              <div
                key={movie.id}
                className="bg-[#10121A]/70 rounded-xl border border-[#1E2230] hover:border-slate-600 transition-all p-5 flex flex-col justify-between relative group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
                        #{movie.watchlistIndex}
                      </span>
                      <span className="text-[11px] text-slate-400 bg-[#161924] px-2 py-0.5 rounded">
                        {movie.phase}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {movie.releaseYear}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleWatchStatus(movie.id)}
                      className="p-1 rounded text-slate-600 hover:text-slate-400 transition"
                      title="Mark as watched"
                    >
                      <Circle className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-200 group-hover:text-white transition">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Dossier Pending Deployment
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1C1F2B]">
                  <button
                    onClick={() => openCreateForExisting(movie)}
                    className="w-full bg-[#191D2B] hover:bg-[#E62429] hover:text-white text-slate-300 transition py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#272D42] hover:border-[#E62429]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>+ Create Dossier Card</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Full Dossier Modal */}
      {activeModalMovie && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#12141D] border border-[#2B3045] w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative my-8">
            <button
              onClick={() => setActiveModalMovie(null)}
              className="absolute top-4 right-4 z-10 bg-black/60 text-slate-400 hover:text-white p-2 rounded-full border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={`h-44 relative bg-gradient-to-br ${activeModalMovie.themeColor || 'from-slate-900 to-slate-950'}`}>
              <img
                src={activeModalMovie.poster}
                alt={activeModalMovie.title}
                className="w-full h-full object-cover mix-blend-overlay opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12141D] to-transparent" />
              <div className="absolute bottom-4 left-6">
                <span className="bg-[#E62429] text-white text-xs font-bold px-2 py-0.5 rounded">
                  #{activeModalMovie.watchlistIndex} • {activeModalMovie.phase} • {activeModalMovie.releaseYear}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {activeModalMovie.title}
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-5 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#191D2B] p-4 rounded-xl border border-[#272D42]">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Super Hero</span>
                  <p className="text-base font-bold text-white">{activeModalMovie.hero}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hero Class</span>
                  <p className="text-base font-bold text-red-400">{activeModalMovie.heroClass}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Hero Description</h4>
                <p className="text-slate-300 leading-relaxed">{activeModalMovie.heroDescription}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> Power Source & Tech Architecture
                </h4>
                <p className="text-slate-300 leading-relaxed bg-[#171A26] p-3 rounded-lg border border-[#262B3F]">
                  {activeModalMovie.powerSource}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Skull className="w-4 h-4" /> Arch-Antagonist
                </h4>
                <p className="text-slate-300">{activeModalMovie.antagonist}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> Power Upgrades in Sequels
                </h4>
                <p className="text-slate-300 leading-relaxed bg-[#171A26] p-3 rounded-lg border border-[#262B3F]">
                  {activeModalMovie.powerUpgrades || 'No documented upgrades.'}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Absolute Significance to the MCU
                </h4>
                <p className="text-slate-300 leading-relaxed bg-red-950/20 p-3 rounded-lg border border-red-900/30">
                  {activeModalMovie.universeSignificance}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Dossier Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#12141D] border border-[#2B3045] w-full max-w-xl rounded-2xl p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-[#E62429]" /> 
              {editingMovieId ? `Create Dossier: ${formData.title}` : 'Add New Custom Entry'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Movie / Series Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-[#191C28] text-white px-3 py-2 rounded border border-[#2E3349] focus:outline-none focus:border-[#E62429]"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Release Year</label>
                  <input
                    type="number"
                    value={formData.releaseYear}
                    onChange={(e) => setFormData({...formData, releaseYear: Number(e.target.value)})}
                    className="w-full bg-[#191C28] text-white px-3 py-2 rounded border border-[#2E3349] focus:outline-none focus:border-[#E62429]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">MCU Phase</label>
                  <select
                    value={formData.phase}
                    onChange={(e) => setFormData({...formData, phase: e.target.value})}
                    className="w-full bg-[#191C28] text-white px-3 py-2 rounded border border-[#2E3349] focus:outline-none focus:border-[#E62429]"
                  >
                    {phases.filter(p => p !== 'All').map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Superhero Class / Species</label>
                  <input
                    type="text"
                    required
                    value={formData.heroClass}
                    onChange={(e) => setFormData({...formData, heroClass: e.target.value})}
                    placeholder="e.g. Asgardian / God, Mutant, Human / Tech"
                    className="w-full bg-[#191C28] text-white px-3 py-2 rounded border border-[#2E3349] focus:outline-none focus:border-[#E62429]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Lead Superhero</label>
                  <input
                    type="text"
                    required
                    value={formData.hero}
                    onChange={(e) => setFormData({...formData, hero: e.target.value})}
                    placeholder="e.g. Thor Odinson"
                    className="w-full bg-[#191C28] text-white px-3 py-2 rounded border border-[#2E3349] focus:outline-none focus:border-[#E62429]"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Main Antagonist</label>
                  <input
                    type="text"
                    required
                    value={formData.antagonist}
                    onChange={(e) => setFormData({...formData, antagonist: e.target.value})}
                    placeholder="e.g. Hela (Goddess of Death)"
                    className="w-full bg-[#191C28] text-white px-3 py-2 rounded border border-[#2E3349] focus:outline-none focus:border-[#E62429]"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Hero Description</label>
                <textarea
                  rows={2}
                  value={formData.heroDescription}
                  onChange={(e) => setFormData({...formData, heroDescription: e.target.value})}
                  placeholder="Summary of the hero's arc in this specific movie..."
                  className="w-full bg-[#191C28] text-white px-3 py-2 rounded border border-[#2E3349] focus:outline-none focus:border-[#E62429]"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Power Source, Weapons & Tech</label>
                <input
                  type="text"
                  value={formData.powerSource}
                  onChange={(e) => setFormData({...formData, powerSource: e.target.value})}
                  placeholder="e.g. Mjolnir, Divine Lightning Channeling"
                  className="w-full bg-[#191C28] text-white px-3 py-2 rounded border border-[#2E3349] focus:outline-none focus:border-[#E62429]"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Power Upgrades in Sequels</label>
                <input
                  type="text"
                  value={formData.powerUpgrades}
                  onChange={(e) => setFormData({...formData, powerUpgrades: e.target.value})}
                  placeholder="e.g. Awaken lightning without hammer → Forges Stormbreaker"
                  className="w-full bg-[#191C28] text-white px-3 py-2 rounded border border-[#2E3349] focus:outline-none focus:border-[#E62429]"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Absolute MCU Universe Significance</label>
                <textarea
                  rows={2}
                  value={formData.universeSignificance}
                  onChange={(e) => setFormData({...formData, universeSignificance: e.target.value})}
                  placeholder="How does this title shape the overall MCU timeline?"
                  className="w-full bg-[#191C28] text-white px-3 py-2 rounded border border-[#2E3349] focus:outline-none focus:border-[#E62429]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#E62429] text-white font-bold hover:bg-red-700 transition"
                >
                  Save Dossier Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
