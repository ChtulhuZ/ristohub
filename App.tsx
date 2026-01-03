import React, { useState, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ScrollText, Wallet, Menu, X, ChefHat, Globe } from 'lucide-react';
import { DISHES, ROADMAP, UI } from './constants';
import { Dish, Language, LocalizedContent } from './types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// --- Language Context ---

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (content: LocalizedContent) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');

  const t = (content: LocalizedContent) => {
    return content[lang];
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();

  const isActive = (path: string) => location.pathname === path ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white';

  const toggleLang = () => {
    setLang(lang === 'en' ? 'it' : 'en');
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-amber-500" />
            <span className="text-xl font-bold tracking-wider text-white">GastroShare<span className="text-amber-500">DAO</span></span>
          </Link>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className={isActive('/')}>{t(UI.nav_concept)}</Link>
              <Link to="/marketplace" className={isActive('/marketplace')}>{t(UI.nav_menu)}</Link>
              <Link to="/dashboard" className={isActive('/dashboard')}>{t(UI.nav_portfolio)}</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
             <button 
              onClick={toggleLang} 
              className="flex items-center gap-2 text-slate-300 hover:text-white px-3 py-1 rounded-md hover:bg-slate-800 transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span className="font-mono text-sm uppercase">{lang}</span>
            </button>

            <button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-4 rounded-full flex items-center gap-2 transition-all">
              <Wallet className="h-4 w-4" />
              {t(UI.nav_connect)}
            </button>
          </div>

          <div className="flex md:hidden items-center gap-4">
             <button 
              onClick={toggleLang} 
              className="flex items-center gap-2 text-slate-300 hover:text-white px-2 py-1 rounded-md hover:bg-slate-800 transition-colors"
            >
               <span className="font-mono text-xs uppercase font-bold">{lang === 'en' ? '🇬🇧 EN' : '🇮🇹 IT'}</span>
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white p-2 -mr-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden bg-slate-800 pb-4 px-4 border-t border-slate-700">
          <Link to="/" onClick={() => setIsOpen(false)} className="block py-3 text-gray-300 hover:text-white border-b border-slate-700">{t(UI.nav_concept)}</Link>
          <Link to="/marketplace" onClick={() => setIsOpen(false)} className="block py-3 text-gray-300 hover:text-white border-b border-slate-700">{t(UI.nav_menu)}</Link>
          <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block py-3 text-gray-300 hover:text-white">{t(UI.nav_portfolio)}</Link>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  const { t } = useLanguage();
  return (
    <div className="relative overflow-hidden bg-slate-900 py-24 sm:py-32">
      <div className="absolute inset-0 bg-[url('https://picsum.photos/id/431/1920/1080')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center z-10">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
          {t(UI.hero_title_1)} <span className="text-amber-500">{t(UI.hero_title_2)}</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
          {t(UI.hero_subtitle)}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link to="/marketplace" className="rounded-md bg-amber-500 px-6 py-3 text-lg font-semibold text-slate-900 shadow-sm hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 transition-all">
            {t(UI.hero_cta_explore)}
          </Link>
          <a href="#concept" className="text-sm font-semibold leading-6 text-white hover:text-amber-400 transition-colors">
            {t(UI.hero_cta_learn)} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
};

const ConceptSection = () => {
  const { t } = useLanguage();
  return (
    <div id="concept" className="bg-slate-900 py-24 sm:py-32 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-amber-500">{t(UI.concept_eyebrow)}</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t(UI.concept_title)}
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            {t(UI.concept_desc)}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-amber-500/50 transition-all">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                <ShoppingBag className="h-10 w-10 text-amber-500 mb-4" />
                {t(UI.concept_asset_title)}
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
                <p className="flex-auto">{t(UI.concept_asset_desc)}</p>
              </dd>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-amber-500/50 transition-all">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                <ScrollText className="h-10 w-10 text-amber-500 mb-4" />
                {t(UI.concept_oracle_title)}
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
                <p className="flex-auto">{t(UI.concept_oracle_desc)}</p>
              </dd>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-amber-500/50 transition-all">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                <LayoutDashboard className="h-10 w-10 text-amber-500 mb-4" />
                {t(UI.concept_yield_title)}
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
                <p className="flex-auto">{t(UI.concept_yield_desc)}</p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

const RoadmapSection = () => {
  const { t } = useLanguage();
  return (
    <div className="bg-slate-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-12 text-center">
            {t(UI.roadmap_title)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {ROADMAP.map((item) => (
                  <div key={item.phase} className="relative pl-8 border-l-2 border-slate-800 hover:border-amber-500 transition-colors">
                      <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-amber-500"></span>
                      <h3 className="text-lg font-bold text-white mb-2">{t(UI.roadmap_phase)} {item.phase}: {t(item.title)}</h3>
                      <p className="text-sm text-amber-500 mb-4 font-mono uppercase">{t(item.description)}</p>
                      <ul className="text-gray-400 text-sm list-disc list-inside space-y-2">
                          {item.items.map((sub, idx) => <li key={idx}>{t(sub)}</li>)}
                      </ul>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

// --- Pages ---

const HomePage = () => (
  <>
    <Hero />
    <ConceptSection />
    <RoadmapSection />
  </>
);

const MarketplacePage = () => {
    const { t } = useLanguage();
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white">{t(UI.mkt_title)}</h2>
                    <p className="text-slate-400 mt-2">{t(UI.mkt_subtitle)}</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-1 px-3 text-sm text-slate-300">
                    {t(UI.mkt_active_auctions)}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {DISHES.map((dish) => (
                    <div key={dish.id} className="group bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-amber-500/50 transition-all hover:shadow-2xl hover:shadow-amber-900/20">
                        <div className="h-64 overflow-hidden relative">
                            <img src={dish.imageUrl} alt={t(dish.name)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 uppercase">
                                NFT #{dish.id}
                            </div>
                            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${dish.color}`}></div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">{t(dish.name)}</h3>
                                    <p className="text-sm text-slate-400">{t(dish.subtitle)}</p>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded bg-slate-700 ${dish.type === 'Blue Chip' ? 'text-blue-300' : dish.type === 'Luxury' ? 'text-purple-300' : 'text-green-300'}`}>
                                    {t(dish.typeLabel)}
                                </span>
                            </div>
                            
                            <p className="text-slate-400 text-sm mb-6 line-clamp-2">{t(dish.description)}</p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-slate-900/50 p-3 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase">{t(UI.mkt_est_price)}</p>
                                    <p className="text-lg font-mono font-bold text-white">€{dish.auctionEstimateMin.toLocaleString()}</p>
                                </div>
                                <div className="bg-slate-900/50 p-3 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase">{t(UI.mkt_est_yield)}</p>
                                    <p className="text-lg font-mono font-bold text-green-400">+€{Math.round(dish.price * dish.volume * dish.royaltyRate).toLocaleString()}</p>
                                </div>
                            </div>

                            <Link to={`/dish/${dish.id}`} className="block w-full text-center bg-slate-700 hover:bg-amber-500 hover:text-slate-900 text-white font-bold py-3 rounded-lg transition-colors">
                                {t(UI.mkt_btn_view)}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DishDetailPage = () => {
    const { t } = useLanguage();
    const location = useLocation();
    const id = location.pathname.split('/').pop();
    const dish = DISHES.find(d => d.id === id) || DISHES[0];

    const monthlyRevenue = dish.price * dish.volume;
    const monthlyRoyalty = monthlyRevenue * dish.royaltyRate;
    const annualRoyalty = monthlyRoyalty * 12;
    const estimatedROI = (annualRoyalty / ((dish.auctionEstimateMin + dish.auctionEstimateMax)/2)) * 100;

    const chartData = [
        { name: 'Jan', revenue: monthlyRoyalty * 0.9 },
        { name: 'Feb', revenue: monthlyRoyalty * 0.85 },
        { name: 'Mar', revenue: monthlyRoyalty * 1.0 },
        { name: 'Apr', revenue: monthlyRoyalty * 1.1 },
        { name: 'May', revenue: monthlyRoyalty * 1.2 },
        { name: 'Jun', revenue: monthlyRoyalty * 1.3 },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link to="/marketplace" className="inline-flex items-center text-slate-400 hover:text-amber-400 mb-6">
                ← {t(UI.detail_back)}
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Visuals */}
                <div>
                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-700 mb-8">
                        <img src={dish.imageUrl} alt={t(dish.name)} className="w-full h-96 object-cover" />
                    </div>
                    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-lg font-bold text-white mb-4">{t(UI.detail_oracle_feed)}</h3>
                        <div className="space-y-3">
                            {[1,2,3].map((_, i) => (
                                <div key={i} className="flex justify-between items-center text-sm border-b border-slate-700 pb-2 last:border-0">
                                    <span className="text-slate-400">{t(UI.detail_order)} #{29304 + i} • {new Date().toLocaleTimeString()}</span>
                                    <span className="text-green-400 font-mono">+€{dish.price.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Financials */}
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{t(dish.name)}</h1>
                    <p className="text-xl text-slate-400 mb-6">{t(dish.subtitle)}</p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                            <p className="text-slate-400 text-sm">{t(UI.detail_vol_monthly)}</p>
                            <p className="text-2xl font-bold text-white">{dish.volume.toLocaleString()} <span className="text-sm font-normal text-slate-500">{t(UI.detail_units)}</span></p>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                            <p className="text-slate-400 text-sm">{t(UI.detail_yield_annual)}</p>
                            <p className="text-2xl font-bold text-green-400">€{annualRoyalty.toLocaleString()}</p>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                            <p className="text-slate-400 text-sm">{t(UI.detail_apy)}</p>
                            <p className="text-2xl font-bold text-amber-500">{estimatedROI.toFixed(1)}%</p>
                        </div>
                         <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                            <p className="text-slate-400 text-sm">{t(UI.detail_royalty)}</p>
                            <p className="text-2xl font-bold text-white">{(dish.royaltyRate * 100)}%</p>
                        </div>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8">
                        <h3 className="text-lg font-bold text-white mb-6">{t(UI.detail_chart_title)}</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="name" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#fff' }}
                                        formatter={(value: number) => [`€${value.toFixed(0)}`, 'Royalty']}
                                    />
                                    <Bar dataKey="revenue" fill="#fbbf24" radius={[4, 4, 0, 0]}>
                                      {chartData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#f59e0b' : '#fbbf24'} />
                                      ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 text-xl font-bold py-4 rounded-xl shadow-lg shadow-amber-900/20 transition-all">
                        {t(UI.detail_btn_bid)}
                    </button>
                    <p className="text-center text-slate-500 text-sm mt-4">{t(UI.detail_min_bid)}: €{dish.auctionEstimateMin.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

const DashboardPage = () => {
    const { t } = useLanguage();
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-white mb-8">{t(UI.dash_title)}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-amber-500/20 rounded-lg text-amber-500">
                            <Wallet size={24} />
                        </div>
                        <h3 className="text-slate-400 font-medium">{t(UI.dash_bal)}</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">€12,450.00</p>
                    <p className="text-sm text-green-400 mt-1">+€340.00 ({t(UI.dash_last_30)})</p>
                </div>
                
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-green-500/20 rounded-lg text-green-500">
                            <ShoppingBag size={24} />
                        </div>
                        <h3 className="text-slate-400 font-medium">{t(UI.dash_active)}</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">2 {t(UI.dash_dishes)}</p>
                    <p className="text-sm text-slate-500 mt-1">1 Volume, 1 Luxury</p>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg text-blue-500">
                            <LayoutDashboard size={24} />
                        </div>
                        <h3 className="text-slate-400 font-medium">{t(UI.dash_unclaimed)}</h3>
                    </div>
                    <div className="flex justify-between items-end">
                        <p className="text-3xl font-bold text-white">€156.40</p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-full transition-colors">
                            {t(UI.dash_btn_claim)}
                        </button>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-6">{t(UI.dash_my_assets)}</h2>
            <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                <table className="w-full text-left">
                    <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4">{t(UI.dash_th_dish)}</th>
                            <th className="px-6 py-4">{t(UI.dash_th_type)}</th>
                            <th className="px-6 py-4">{t(UI.dash_th_vol)}</th>
                            <th className="px-6 py-4">{t(UI.dash_th_yield)}</th>
                            <th className="px-6 py-4 text-right">{t(UI.dash_th_actions)}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {/* Mock User Data */}
                        <tr className="hover:bg-slate-700/50 transition-colors">
                            <td className="px-6 py-4 flex items-center gap-3">
                                <img src={DISHES[0].imageUrl} className="w-10 h-10 rounded-md object-cover" alt="Spaghetti" />
                                <span className="font-bold text-white">{t(DISHES[0].name)}</span>
                            </td>
                            <td className="px-6 py-4 text-slate-300">{t(DISHES[0].typeLabel)}</td>
                            <td className="px-6 py-4 text-slate-300">22 {t(UI.detail_units)}</td>
                            <td className="px-6 py-4 text-green-400 font-mono">+€26.40</td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-amber-500 hover:text-amber-400 text-sm font-medium">{t(UI.dash_btn_manage)}</button>
                            </td>
                        </tr>
                         <tr className="hover:bg-slate-700/50 transition-colors">
                            <td className="px-6 py-4 flex items-center gap-3">
                                <img src={DISHES[2].imageUrl} className="w-10 h-10 rounded-md object-cover" alt="Roastbeef" />
                                <span className="font-bold text-white">{t(DISHES[2].name)}</span>
                            </td>
                            <td className="px-6 py-4 text-slate-300">{t(DISHES[2].typeLabel)}</td>
                            <td className="px-6 py-4 text-slate-300">4 {t(UI.detail_units)}</td>
                            <td className="px-6 py-4 text-green-400 font-mono">+€8.80</td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-amber-500 hover:text-amber-400 text-sm font-medium">{t(UI.dash_btn_manage)}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const Footer = () => {
    const { t } = useLanguage();
    return (
        <footer className="bg-slate-950 border-t border-slate-800 py-12 mt-12">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <ChefHat className="h-6 w-6 text-slate-600" />
                    <span className="text-slate-500 font-bold">GastroShare DAO</span>
                </div>
                <div className="text-slate-600 text-sm">
                    &copy; {new Date().getFullYear()} {t(UI.footer_rights)}
                </div>
                <div className="flex gap-4">
                    <a href="#" className="text-slate-500 hover:text-amber-500 transition-colors">Twitter</a>
                    <a href="#" className="text-slate-500 hover:text-amber-500 transition-colors">Discord</a>
                    <a href="#" className="text-slate-500 hover:text-amber-500 transition-colors">Etherscan</a>
                </div>
            </div>
        </footer>
    );
};

export default function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <div className="min-h-screen bg-slate-900 flex flex-col">
          <Navbar />
          <main className="flex-grow">
              <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/marketplace" element={<MarketplacePage />} />
                  <Route path="/dish/:id" element={<DishDetailPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
              </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </LanguageProvider>
  );
}