import React, { useState, createContext, useContext, useEffect, useMemo, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ScrollText, 
  Wallet, 
  Menu, 
  X, 
  ChefHat, 
  Globe, 
  Gavel, 
  CheckCircle, 
  Pizza, 
  Plus, 
  Ticket, 
  Gift, 
  Activity 
} from 'lucide-react';
import { DISHES, UI, AUCTIONS, TOPPINGS, MEMBERSHIPS } from './constants';
import { Dish, Language, LocalizedContent, Auction, CustomPizza, Membership } from './types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Contexts & State ---

const LanguageContext = createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
  t: (content: LocalizedContent) => string;
} | undefined>(undefined);

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('it');
  const t = useCallback((content: LocalizedContent) => content[lang] || content['en'], [lang]);
  
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

// --- Mock Data Management ---
const Store = {
  customPizzas: [] as CustomPizza[],
  userMemberships: [] as Membership[],
  referralCount: 7,
};

// --- Helper Components ---

const LiveOrderFeed = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Array<{ id: string; dish: Dish; timestamp: string }>>([]);

  useEffect(() => {
    // Initial random orders
    const initialOrders = Array.from({ length: 3 }).map((_, i) => ({
      id: Math.random().toString(36).substring(2, 11).toUpperCase(),
      dish: DISHES[Math.floor(Math.random() * DISHES.length)],
      timestamp: new Date(Date.now() - (i * 120000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
    setOrders(initialOrders);

    const interval = setInterval(() => {
      const newOrder = {
        id: Math.random().toString(36).substring(2, 11).toUpperCase(),
        dish: DISHES[Math.floor(Math.random() * DISHES.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setOrders(prev => [newOrder, ...prev].slice(0, 6));
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white text-slate-900 rounded-sm shadow-xl p-4 sm:p-6 font-mono border-t-4 border-amber-500 relative overflow-hidden transform rotate-1 sm:rotate-2">
      <div className="absolute top-0 right-0 p-2 opacity-10">
        <Activity size={48} />
      </div>
      
      <div className="flex justify-between items-start border-b-2 border-dashed border-slate-300 pb-4 mb-4">
        <div>
          <h3 className="font-bold text-lg uppercase leading-none">{t(UI.live_feed_title)}</h3>
          <p className="text-[10px] text-slate-500 mt-1 uppercase">{t(UI.live_feed_subtitle)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold">TERMINAL #GS-01</p>
          <p className="text-[10px]">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order, idx) => (
          <div key={order.id} className={`flex justify-between items-center animate-in fade-in slide-in-from-top-4 duration-500 ${idx === 0 ? 'text-amber-600 font-bold' : 'text-slate-600'}`}>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">[{order.timestamp}]</span>
                <span className="uppercase text-sm truncate max-w-[140px]">{t(order.dish.name)}</span>
              </div>
              <div className="flex items-center gap-1 text-[8px] text-slate-400 mt-0.5">
                <CheckCircle size={8} /> {t(UI.live_feed_verified)} #{order.id}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[8px]">SERVED</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-300 text-center">
        <div className="inline-block px-3 py-1 bg-amber-100 rounded text-amber-800 text-[10px] font-bold animate-pulse uppercase">
          Waiting for POS Pulse...
        </div>
      </div>
    </div>
  );
};

const Countdown = ({ targetDate }: { targetDate: string }) => {
  const calculateTimeLeft = useCallback(() => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: any = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  if (Object.keys(timeLeft).length === 0) return <span>Asta Terminata</span>;

  return (
    <div className="flex gap-2 font-mono text-lg font-bold text-amber-500">
      {timeLeft.days > 0 && <span>{timeLeft.days}d</span>}
      <span>{timeLeft.hours}h</span>
      <span>{timeLeft.minutes}m</span>
      <span>{timeLeft.seconds}s</span>
    </div>
  );
};

const BidModal = ({ auction, onClose }: { auction: Auction, onClose: () => void }) => {
  const { t } = useLanguage();
  const dish = DISHES.find(d => d.id === auction.dishId);
  const [amount, setAmount] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);
  const hasMembership = Store.userMemberships.length > 0;

  if (!dish) return null;

  const handleBid = () => {
    setTimeout(() => {
      setIsSuccess(true);
      setTimeout(() => onClose(), 2000);
    }, 500);
  };

  const minBid = auction.currentBid + 50;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={24} /></button>
        {!hasMembership ? (
          <div className="text-center py-8">
            <Ticket className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">{t(UI.bid_modal_no_ticket)}</h3>
            <p className="text-slate-400 mb-6">{t(UI.membership_subtitle)}</p>
            <Link to="/tickets" onClick={onClose} className="block w-full bg-amber-500 text-slate-900 font-bold py-3 rounded-xl">{t(UI.bid_modal_buy_ticket)}</Link>
          </div>
        ) : !isSuccess ? (
          <>
            <h3 className="text-2xl font-bold text-white mb-2">{t(UI.bid_modal_title)}</h3>
            <div className="flex items-center gap-3 mb-6 bg-slate-800 p-3 rounded-lg">
              <img src={dish.imageUrl} alt={t(dish.name)} className="w-12 h-12 rounded-md object-cover" />
              <div><p className="text-white font-medium">{t(dish.name)}</p><p className="text-slate-400 text-xs">NFT #{dish.id}</p></div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 mb-6">
              <p className="text-sm text-slate-400 mb-1">{t(UI.bid_modal_current)}</p>
              <p className="text-2xl font-mono font-bold text-amber-500">€{auction.currentBid.toLocaleString()}</p>
            </div>
            <div className="mb-6">
              <label htmlFor="bid-amount" className="block text-sm font-bold text-slate-300 mb-2">{t(UI.bid_modal_your_bid)}</label>
              <input id="bid-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`${minBid}`} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-4 text-white text-lg focus:outline-none focus:border-amber-500" />
            </div>
            <div className="flex gap-4">
              <button onClick={onClose} className="flex-1 py-3 text-slate-300 hover:bg-slate-800 rounded-xl">{t(UI.bid_modal_btn_cancel)}</button>
              <button onClick={handleBid} disabled={!amount || Number(amount) < minBid} className="flex-1 py-3 bg-amber-500 disabled:opacity-50 text-slate-900 font-bold rounded-xl">{t(UI.bid_modal_btn_confirm)}</button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">{t(UI.bid_modal_success)}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();
  const isActive = (path: string) => location.pathname === path ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white';

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
              <Link to="/auctions" className={isActive('/auctions')}>{t(UI.nav_auctions)}</Link>
              <Link to="/tickets" className={isActive('/tickets')}>{t(UI.nav_ticket_auction)}</Link>
              <Link to="/pizza-lab" className={isActive('/pizza-lab')}>{t(UI.nav_pizza_lab)}</Link>
              <Link to="/dashboard" className={isActive('/dashboard')}>{t(UI.nav_portfolio)}</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
             <button onClick={() => setLang(lang === 'en' ? 'it' : 'en')} className="flex items-center gap-2 text-slate-300 hover:text-white px-3 py-1 rounded-md hover:bg-slate-800 transition-colors">
              <Globe className="h-4 w-4" />
              <span className="font-mono text-sm uppercase">{lang}</span>
            </button>
            <button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-4 rounded-full flex items-center gap-2"><Wallet className="h-4 w-4" />{t(UI.nav_connect)}</button>
          </div>
          <div className="flex md:hidden items-center gap-4">
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu" className="text-gray-400 hover:text-white p-2">{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-slate-800 pb-4 px-4 border-t border-slate-700 animate-in slide-in-from-top duration-300">
          <Link to="/" onClick={() => setIsOpen(false)} className="block py-3 text-gray-300 border-b border-slate-700">{t(UI.nav_concept)}</Link>
          <Link to="/marketplace" onClick={() => setIsOpen(false)} className="block py-3 text-gray-300 border-b border-slate-700">{t(UI.nav_menu)}</Link>
          <Link to="/auctions" onClick={() => setIsOpen(false)} className="block py-3 text-gray-300 border-b border-slate-700">{t(UI.nav_auctions)}</Link>
          <Link to="/tickets" onClick={() => setIsOpen(false)} className="block py-3 text-gray-300 border-b border-slate-700">{t(UI.nav_ticket_auction)}</Link>
          <Link to="/pizza-lab" onClick={() => setIsOpen(false)} className="block py-3 text-gray-300 border-b border-slate-700">{t(UI.nav_pizza_lab)}</Link>
          <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block py-3 text-gray-300 border-b border-slate-700">{t(UI.nav_portfolio)}</Link>
          
          <div className="py-4 flex flex-col gap-4">
            <button 
              onClick={() => setLang(lang === 'en' ? 'it' : 'en')} 
              className="flex items-center justify-center gap-3 text-amber-500 bg-slate-900 py-3 rounded-xl border border-amber-500/20 active:scale-95 transition-all"
            >
              <Globe className="h-5 w-5" />
              <span className="font-bold uppercase tracking-widest">{lang === 'it' ? 'English (EN)' : 'Italiano (IT)'}</span>
            </button>
            <button className="bg-amber-500 text-slate-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all">
              <Wallet className="h-5 w-5" />
              {t(UI.nav_connect)}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const HomePage = () => {
  const { t } = useLanguage();
  return (
    <div>
      <div className="relative overflow-hidden bg-slate-900 py-24 sm:py-32">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/id/431/1920/1080')] bg-cover bg-center opacity-20" aria-hidden="true"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">{t(UI.hero_title_1)} <span className="text-amber-500">{t(UI.hero_title_2)}</span></h1>
              <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto lg:mx-0">{t(UI.hero_subtitle)}</p>
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                <Link to="/marketplace" className="rounded-md bg-amber-500 px-6 py-3 text-lg font-semibold text-slate-900 shadow-sm hover:bg-amber-400 transition-all">{t(UI.hero_cta_explore)}</Link>
                <Link to="/auctions" className="text-sm font-semibold leading-6 text-white hover:text-amber-400">{t(UI.nav_auctions)} →</Link>
              </div>
            </div>
            <div className="relative group max-w-md mx-auto lg:mr-0 w-full">
               <LiveOrderFeed />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-slate-900 py-24 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-base font-semibold text-amber-500 uppercase">{t(UI.concept_eyebrow)}</h2>
            <p className="mt-2 text-3xl font-bold text-white sm:text-4xl">{t(UI.concept_title)}</p>
            <p className="mt-6 text-lg text-gray-400">{t(UI.concept_desc)}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 text-center">
              <ShoppingBag className="h-10 w-10 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{t(UI.concept_asset_title)}</h3>
              <p className="text-gray-400 text-sm">{t(UI.concept_asset_desc)}</p>
            </div>
            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 text-center">
              <ScrollText className="h-10 w-10 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{t(UI.concept_oracle_title)}</h3>
              <p className="text-gray-400 text-sm">{t(UI.concept_oracle_desc)}</p>
            </div>
            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 text-center">
              <LayoutDashboard className="h-10 w-10 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{t(UI.concept_yield_title)}</h3>
              <p className="text-gray-400 text-sm">{t(UI.concept_yield_desc)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MarketplacePage = () => {
  const { t } = useLanguage();
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8"><h2 className="text-3xl font-bold text-white">{t(UI.mkt_title)}</h2><p className="text-slate-400 mt-2">{t(UI.mkt_subtitle)}</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {DISHES.map((dish) => (
          <div key={dish.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 group flex flex-col h-full">
            <div className="h-48 relative overflow-hidden"><img src={dish.imageUrl} alt={t(dish.name)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between mb-2">
                <h3 className="text-xl font-bold text-white">{t(dish.name)}</h3>
                <span className="text-xs bg-slate-900 px-2 py-1 rounded text-amber-500 font-mono">NFT #{dish.id}</span>
              </div>
              <p className="text-slate-400 text-sm mb-6 line-clamp-2">{t(dish.description)}</p>
              <div className="mt-auto space-y-4">
                <div className="flex justify-between items-center"><div className="text-xs text-slate-500 uppercase">{t(UI.mkt_est_price)}</div><div className="text-lg font-bold text-white">€{dish.auctionEstimateMin.toLocaleString()}</div></div>
                <Link to={`/dish/${dish.id}`} className="block w-full text-center bg-slate-700 hover:bg-amber-500 hover:text-slate-900 font-bold py-2 rounded transition-colors">{t(UI.mkt_btn_view)}</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AuctionsPage = () => {
  const { t } = useLanguage();
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {selectedAuction && <BidModal auction={selectedAuction} onClose={() => setSelectedAuction(null)} />}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">{t(UI.auction_title)}</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t(UI.auction_subtitle)}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {AUCTIONS.map((a) => {
          const dish = DISHES.find(d => d.id === a.dishId);
          if (!dish) return null;
          return (
            <div key={a.id} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 flex flex-col">
              <div className="h-64 relative"><img src={dish.imageUrl} alt={t(dish.name)} className="w-full h-full object-cover" /><div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase animate-pulse">LIVE</div></div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">{t(dish.name)}</h3>
                <div className="bg-slate-900/50 rounded-xl p-6 mb-6 flex justify-between">
                  <div><p className="text-xs text-slate-500 uppercase font-bold mb-1">{t(UI.auction_card_current)}</p><p className="text-2xl font-mono font-bold text-white">€{a.currentBid.toLocaleString()}</p></div>
                  <div><p className="text-xs text-slate-500 uppercase font-bold mb-1">{t(UI.auction_card_ends)}</p><Countdown targetDate={a.endTime} /></div>
                </div>
                <button onClick={() => setSelectedAuction(a)} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"><Gavel size={20} />{t(UI.auction_btn_bid)}</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DishDetailPage = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const dish = DISHES.find(d => d.id === id);
  const auction = AUCTIONS.find(a => a.dishId === id);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);

  if (!dish) return <div className="p-24 text-center">Piatto non trovato</div>;

  const monthlyRoyalty = dish.price * dish.volume * dish.royaltyRate;
  const chartData = [
    { name: 'Jan', revenue: monthlyRoyalty * 0.9 },
    { name: 'Feb', revenue: monthlyRoyalty * 0.85 },
    { name: 'Mar', revenue: monthlyRoyalty * 1.0 },
    { name: 'Apr', revenue: monthlyRoyalty * 1.1 },
    { name: 'May', revenue: monthlyRoyalty * 1.2 },
    { name: 'Jun', revenue: monthlyRoyalty * 1.3 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {selectedAuction && <BidModal auction={selectedAuction} onClose={() => setSelectedAuction(null)} />}
      <Link to="/marketplace" className="text-slate-400 hover:text-amber-400 mb-6 inline-block">← {t(UI.detail_back)}</Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <img src={dish.imageUrl} alt={t(dish.name)} className="w-full h-96 object-cover rounded-2xl shadow-2xl border border-slate-700" />
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">{t(UI.detail_oracle_feed)}</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex justify-between border-b border-slate-700 pb-2 text-sm text-slate-400">
                  <span>{t(UI.detail_order)} #{Math.floor(Math.random() * 90000)}</span>
                  <span className="text-green-400 font-mono">+€{dish.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <div><h1 className="text-4xl font-bold text-white mb-2">{t(dish.name)}</h1><p className="text-xl text-slate-400">{t(dish.subtitle)}</p></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center"><p className="text-slate-400 text-sm mb-1">{t(UI.detail_yield_annual)}</p><p className="text-2xl font-bold text-green-400">€{(monthlyRoyalty * 12).toLocaleString()}</p></div>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center"><p className="text-slate-400 text-sm mb-1">{t(UI.detail_royalty)}</p><p className="text-2xl font-bold text-white">{(dish.royaltyRate * 100)}%</p></div>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-64">
            <h3 className="text-lg font-bold text-white mb-4">{t(UI.detail_chart_title)}</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                <Bar dataKey="revenue" fill="#fbbf24" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {auction ? (
             <button onClick={() => setSelectedAuction(auction)} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-4 rounded-xl text-xl flex items-center justify-center gap-2"><Gavel />{t(UI.detail_btn_bid)}</button>
          ) : (
            <div className="bg-slate-800 p-4 rounded-xl text-center text-slate-500 font-bold uppercase border border-slate-700">Asta non attiva al momento</div>
          )}
        </div>
      </div>
    </div>
  );
};

const TicketsPage = () => {
  const { t } = useLanguage();
  const [refCount, setRefCount] = useState(Store.referralCount);
  const target = 10;
  const progress = Math.min((refCount / target) * 100, 100);

  const handleBuy = (membership: Membership) => {
    Store.userMemberships.push(membership);
    alert(`${t(membership.name)} acquistato!`);
  };

  const handleRedeem = () => {
    if (refCount >= target) {
      Store.referralCount -= target;
      setRefCount(Store.referralCount);
      Store.userMemberships.push(MEMBERSHIPS[0]);
      alert("Ticket OMAGGIO riscattato!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12"><h1 className="text-4xl font-bold text-white mb-4">{t(UI.membership_title)}</h1><p className="text-slate-400 text-lg">{t(UI.membership_subtitle)}</p></div>
      <div className="bg-indigo-900/20 rounded-3xl border border-indigo-500/30 p-8 mb-12 flex flex-col md:flex-row items-center gap-8">
        <Gift className="w-16 h-16 text-indigo-400 flex-shrink-0" />
        <div className="flex-grow">
          <h2 className="text-2xl font-bold text-white">{t(UI.ref_title)}</h2>
          <p className="text-slate-400 mb-6">{t(UI.ref_desc)}</p>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-grow">
              <div className="flex justify-between text-xs text-indigo-300 font-bold uppercase mb-2"><span>{t(UI.ref_progress_label)}</span><span>{refCount}/{target}</span></div>
              <div className="h-4 bg-slate-900 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${progress}%` }}></div></div>
            </div>
            <button onClick={handleRedeem} disabled={refCount < target} className="bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-900 font-bold px-6 py-2 rounded-xl">{t(UI.ref_redeem_btn)}</button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {MEMBERSHIPS.map((m) => (
          <div key={m.id} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 flex flex-col">
            <img src={m.imageUrl} alt={t(m.name)} className="h-48 w-full object-cover" />
            <div className="p-8 flex-grow flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-2">{t(m.name)}</h3>
              <p className="text-slate-400 mb-6">{t(m.benefit)}</p>
              <div className="mt-auto"><div className="text-3xl font-bold text-white mb-4">€{m.price}</div><button onClick={() => handleBuy(m)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"><Ticket size={20} /> {t(UI.membership_buy)}</button></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PizzaLabPage = () => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [isMinted, setIsMinted] = useState(false);
  const total = useMemo(() => 6.0 + selected.reduce((acc, id) => acc + (TOPPINGS.find(x => x.id === id)?.price || 0), 0), [selected]);

  const handleMint = () => {
    if (!name) return;
    Store.customPizzas.push({ id: Date.now().toString(), name, toppings: selected, basePrice: total, totalSold: Math.floor(Math.random() * 5), totalEarned: 0 });
    setIsMinted(true);
  };

  if (isMinted) return (
    <div className="max-w-xl mx-auto py-24 text-center px-4">
      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-white mb-4">{t(UI.pizza_lab_success)}</h2>
      <Link to="/dashboard" className="bg-amber-500 text-slate-900 font-bold px-8 py-3 rounded-full inline-block mt-4">Dashboard</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-4">{t(UI.pizza_lab_title)}</h1>
      <p className="text-slate-400 mb-12">{t(UI.pizza_lab_subtitle)}</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div><label htmlFor="pizza-name" className="block text-slate-300 font-bold mb-2">{t(UI.pizza_lab_name_label)}</label><input id="pizza-name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:border-amber-500 outline-none" placeholder="Nome Pizza..." /></div>
          <div className="grid grid-cols-2 gap-4">
            {TOPPINGS.map(top => (
              <button key={top.id} onClick={() => setSelected(s => s.includes(top.id) ? s.filter(x => x !== top.id) : [...s, top.id])} className={`p-4 border rounded-xl text-left transition-all ${selected.includes(top.id) ? 'border-amber-500 bg-amber-500/10 text-white' : 'border-slate-700 bg-slate-800 text-slate-400'}`}>
                <div className="font-bold">{t(top.name)}</div><div className="text-xs">€{top.price.toFixed(2)}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 h-fit sticky top-24">
          <h3 className="text-xl font-bold text-white mb-6">Preview NFT</h3>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between"><span>Base Margherita</span><span>€6.00</span></div>
            {selected.map(id => (<div key={id} className="flex justify-between text-slate-400 text-sm"><span>{t(TOPPINGS.find(x => x.id === id)!.name)}</span><span>€{TOPPINGS.find(x => x.id === id)!.price.toFixed(2)}</span></div>))}
            <div className="border-t border-slate-700 pt-4 flex justify-between font-bold text-xl text-white"><span>Total</span><span>€{total.toFixed(2)}</span></div>
          </div>
          <button onClick={handleMint} disabled={!name} className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2"><Plus size={20} /> {t(UI.pizza_lab_mint_btn)}</button>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { t } = useLanguage();
  const pizzas = Store.customPizzas;
  const tickets = Store.userMemberships;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-12">{t(UI.dash_title)}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 text-center"><Wallet className="text-amber-500 mx-auto mb-4" size={32} /><div className="text-slate-400 text-sm uppercase font-bold mb-2">{t(UI.dash_bal)}</div><div className="text-3xl font-bold text-white">€1.240,00</div></div>
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 text-center"><Ticket className="text-indigo-500 mx-auto mb-4" size={32} /><div className="text-slate-400 text-sm uppercase font-bold mb-2">{t(UI.dash_my_tickets)}</div><div className="text-3xl font-bold text-white">{tickets.length}</div></div>
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 text-center"><Pizza className="text-green-500 mx-auto mb-4" size={32} /><div className="text-slate-400 text-sm uppercase font-bold mb-2">{t(UI.dash_my_pizzas)}</div><div className="text-3xl font-bold text-white">{pizzas.length}</div></div>
      </div>
      <section>
        <h2 className="text-xl font-bold text-white mb-6">{t(UI.dash_my_pizzas)}</h2>
        <div className="bg-slate-800 rounded-xl overflow-x-auto border border-slate-700">
          <table className="w-full text-left">
            <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase"><tr><th className="px-6 py-4">Pizza</th><th className="px-6 py-4">Price</th><th className="px-6 py-4">Sold</th><th className="px-6 py-4">Revenue (100%)</th></tr></thead>
            <tbody className="divide-y divide-slate-700">
              {pizzas.length === 0 ? <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">{t(UI.dash_empty_pizzas)}</td></tr> :
                pizzas.map(p => (<tr key={p.id} className="text-white"><td className="px-6 py-4 font-bold">{p.name}</td><td className="px-6 py-4">€{p.basePrice.toFixed(2)}</td><td className="px-6 py-4">{p.totalSold}</td><td className="px-6 py-4 text-green-400 font-bold">€{(p.totalSold * p.basePrice).toFixed(2)}</td></tr>))
              }
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <div className="min-h-screen bg-slate-950 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/auctions" element={<AuctionsPage />} />
              <Route path="/tickets" element={<TicketsPage />} />
              <Route path="/pizza-lab" element={<PizzaLabPage />} />
              <Route path="/dish/:id" element={<DishDetailPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </main>
          <footer className="bg-slate-900 border-t border-slate-800 py-12 mt-auto text-center text-slate-600 text-sm">GastroShare DAO - Invest in Taste</footer>
        </div>
      </HashRouter>
    </LanguageProvider>
  );
}