import { Dish, RoadmapPhase, GlobalTranslations, Auction } from './types';

export const DISHES: Dish[] = [
  {
    id: '001',
    name: { en: 'The Golden Spaghetti', it: 'The Golden Spaghetti' },
    subtitle: { en: 'Spaghetti al Pomodoro', it: 'Spaghetti al Pomodoro' },
    description: {
        en: 'A high-volume staple asset. Low unit price ensures consistent daily turnover.',
        it: 'Asset ad alto volume. Il prezzo unitario basso garantisce un fatturato giornaliero costante.'
    },
    price: 12,
    volume: 600,
    royaltyRate: 0.1,
    auctionEstimateMin: 15000,
    auctionEstimateMax: 20000,
    imageUrl: 'https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=800&q=80', 
    type: 'Volume',
    typeLabel: { en: 'Volume', it: 'Volume' },
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: '002',
    name: { en: 'The Sovereign Margherita', it: 'The Sovereign Margherita' },
    subtitle: { en: 'Pizza Margherita', it: 'Pizza Margherita' },
    description: {
        en: 'The "Blue Chip" of the menu. Highest safety rating with massive volume.',
        it: 'La "Blue Chip" del menù. Massima sicurezza con volumi enormi.'
    },
    price: 9,
    volume: 1000,
    royaltyRate: 0.1,
    auctionEstimateMin: 25000,
    auctionEstimateMax: 25000,
    imageUrl: 'https://picsum.photos/id/163/800/600', 
    type: 'Blue Chip',
    typeLabel: { en: 'Blue Chip', it: 'Blue Chip' },
    color: 'from-red-500 to-red-700'
  },
  {
    id: '003',
    name: { en: 'The Royal Roastbeef', it: 'The Royal Roastbeef' },
    subtitle: { en: 'Roastbeef', it: 'Roastbeef' },
    description: {
        en: 'A speculative luxury asset. Lower volume but high unit margin. Potential for high growth.',
        it: 'Asset di lusso speculativo. Bassi volumi ma alto margine unitario. Potenziale di crescita elevato.'
    },
    price: 22,
    volume: 150,
    royaltyRate: 0.1,
    auctionEstimateMin: 6000,
    auctionEstimateMax: 8000,
    imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80', 
    type: 'Luxury',
    typeLabel: { en: 'Luxury', it: 'Lusso' },
    color: 'from-amber-700 to-amber-900'
  }
];

// Set end times relative to now for demo purposes
const now = new Date();
const timeInTwoDays = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();
const timeInFourHours = new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString();

export const AUCTIONS: Auction[] = [
  {
    id: 'a1',
    dishId: '001',
    currentBid: 15500,
    bidCount: 14,
    endTime: timeInTwoDays
  },
  {
    id: 'a2',
    dishId: '003',
    currentBid: 7200,
    bidCount: 8,
    endTime: timeInFourHours
  }
];

export const ROADMAP: RoadmapPhase[] = [
  {
    phase: 1,
    title: { en: 'The Menu Mint', it: 'Il Mint del Menù' },
    description: { en: 'Initial Capital Raise & Venue Launch', it: 'Raccolta Capitale & Lancio Locale' },
    items: [
        { en: 'Platform Launch', it: 'Lancio Piattaforma' },
        { en: 'Auction of first 20 Iconic Dishes', it: 'Asta dei primi 20 Piatti Iconici' },
        { en: 'Venue Renovation', it: 'Ristrutturazione Locale' },
        { en: 'Star Chef Recruitment', it: 'Assunzione Chef Stellato' }
    ]
  },
  {
    phase: 2,
    title: { en: 'Gastronomic Gamification', it: 'Gamification Gastronomica' },
    description: { en: 'Driving Volume via Incentives', it: 'Incentivi per aumentare il volume' },
    items: [
        { en: 'Holder-driven discounts', it: 'Sconti per gli Holder' },
        { en: 'Crypto Payment Integration', it: 'Integrazione Pagamenti Crypto' },
        { en: 'Monthly Meal Airdrops for Holders', it: 'Airdrop mensile buoni pasto' }
    ]
  },
  {
    phase: 3,
    title: { en: 'Secondary Market', it: 'Mercato Secondario' },
    description: { en: 'Liquidity & Trading', it: 'Liquidità e Trading' },
    items: [
        { en: 'Marketplace Launch (OpenSea/MagicEden)', it: 'Lancio Marketplace' },
        { en: 'Asset Appreciation', it: 'Apprezzamento Asset' },
        { en: 'Real-time Valuation Tracking', it: 'Tracking Valore in tempo reale' }
    ]
  },
  {
    phase: 4,
    title: { en: 'DAO Governance', it: 'Governance DAO' },
    description: { en: 'Decentralized Restaurant Management', it: 'Gestione Decentralizzata' },
    items: [
        { en: 'Voting on Suppliers', it: 'Voto sui Fornitori' },
        { en: 'New Seasonal Menu Proposals', it: 'Proposte Nuovi Menù Stagionali' },
        { en: 'Interior Design Decisions', it: 'Decisioni Design Interni' }
    ]
  }
];

export const TOPPINGS = [
    { id: 'tomato', name: { en: 'San Marzano Tomato', it: 'Pomodoro San Marzano' }, price: 1.5 },
    { id: 'mozzarella', name: { en: 'Buffalo Mozzarella', it: 'Mozzarella di Bufala' }, price: 2.0 },
    { id: 'basil', name: { en: 'Fresh Basil', it: 'Basilico Fresco' }, price: 0.5 },
    { id: 'truffle', name: { en: 'Black Truffle', it: 'Tartufo Nero' }, price: 5.0 },
    { id: 'gold', name: { en: 'Edible Gold Leaves', it: 'Foglia d\'Oro Commestibile' }, price: 10.0 },
    { id: 'prosciutto', name: { en: 'Parma Ham', it: 'Prosciutto di Parma' }, price: 3.0 },
    { id: 'nduja', name: { en: 'Spicy Nduja', it: 'Nduja Calabra' }, price: 2.5 }
];

export const UI: GlobalTranslations = {
    // Nav
    nav_concept: { en: 'Concept', it: 'Concetto' },
    nav_menu: { en: 'Master Menu', it: 'Master Menu' },
    nav_auctions: { en: 'Auctions', it: 'Aste' },
    nav_pizza_lab: { en: 'Pizza Lab', it: 'Pizza Lab' },
    nav_portfolio: { en: 'My Portfolio', it: 'Mio Portafoglio' },
    nav_connect: { en: 'Connect Wallet', it: 'Connetti Wallet' },
    
    // Hero
    hero_title_1: { en: 'Eat. Invest.', it: 'Mangia. Investi.' },
    hero_title_2: { en: 'Earn.', it: 'Guadagna.' },
    hero_subtitle: {
        en: 'The first restaurant where the Menu is an Investment Portfolio. Own the rights to the dishes and earn passive income from every order served.',
        it: 'Il primo ristorante dove il Menù è un Portafoglio di Investimento. Possiedi i diritti sui piatti e guadagna una rendita passiva da ogni ordine servito.'
    },
    hero_cta_explore: { en: 'Explore the Menu', it: 'Esplora il Menù' },
    hero_cta_learn: { en: 'Learn more', it: 'Scopri di più' },

    // Concept
    concept_eyebrow: { en: 'The Concept', it: 'Il Concetto' },
    concept_title: { en: 'Decentralized Gastronomy', it: 'Gastronomia Decentralizzata' },
    concept_desc: {
        en: 'We tokenize the menu. Each dish is an NFT. The investor buys the dish, the restaurant cooks it, and the profits are shared automatically via Smart Contracts.',
        it: 'Tokenizziamo il menù. Ogni piatto è un NFT. L\'investitore compra il piatto, il ristorante lo cucina e i profitti vengono divisi automaticamente tramite Smart Contract.'
    },
    concept_asset_title: { en: 'The Asset', it: 'L\'Asset' },
    concept_asset_desc: {
        en: 'Buy a 1/1 NFT representing a specific dish on the menu (e.g., The Golden Spaghetti).',
        it: 'Compra un NFT 1/1 che rappresenta un piatto specifico (es. Gli Spaghetti d\'Oro).'
    },
    concept_oracle_title: { en: 'The Oracle', it: 'L\'Oracolo' },
    concept_oracle_desc: {
        en: 'Every time a customer orders your dish, the POS system sends data to the Blockchain Oracle.',
        it: 'Ogni volta che un cliente ordina il tuo piatto, il POS invia i dati all\'Oracolo Blockchain.'
    },
    concept_yield_title: { en: 'The Yield', it: 'La Rendita' },
    concept_yield_desc: {
        en: 'Smart Contracts automatically distribute 10% of gross revenue to your wallet every month.',
        it: 'Gli Smart Contract distribuiscono automaticamente il 10% del fatturato lordo al tuo wallet ogni mese.'
    },

    // Roadmap
    roadmap_title: { en: 'The Roadmap', it: 'La Roadmap' },
    roadmap_phase: { en: 'Phase', it: 'Fase' },

    // Marketplace
    mkt_title: { en: 'The Master Menu', it: 'Il Master Menu' },
    mkt_subtitle: { en: 'Acquire rights to the restaurants best-sellers.', it: 'Acquisisci i diritti sui best-seller del ristorante.' },
    mkt_active_auctions: { en: '3 Active Auctions', it: '3 Aste Attive' },
    mkt_est_price: { en: 'Est. Auction Price', it: 'Prezzo Asta Stimato' },
    mkt_est_yield: { en: 'Est. Monthly Yield', it: 'Rendita Mensile Stimata' },
    mkt_btn_view: { en: 'View Analytics & Bid', it: 'Vedi Analisi & Offri' },
    
    // Auctions
    auction_title: { en: 'Exclusive Auctions', it: 'Aste Esclusive' },
    auction_subtitle: { 
        en: 'Bid on limited edition menu items. Highest bidder wins the NFT rights.', 
        it: 'Fai offerte su voci di menù in edizione limitata. Il miglior offerente vince i diritti NFT.' 
    },
    auction_card_current: { en: 'Current Bid', it: 'Offerta Attuale' },
    auction_card_ends: { en: 'Ends In', it: 'Termina Tra' },
    auction_card_bids: { en: 'Bids', it: 'Offerte' },
    auction_btn_bid: { en: 'Place Bid', it: 'Fai Offerta' },
    auction_live: { en: 'Live', it: 'Live' },

    // Pizza Lab
    pizza_lab_title: { en: 'Pizza Lab: Creator Economy', it: 'Pizza Lab: Creator Economy' },
    pizza_lab_subtitle: { 
        en: 'Build your unique pizza. Mint the recipe as an NFT and earn 100% of the revenue from every unit sold!', 
        it: 'Crea la tua pizza unica. Conia la ricetta come NFT e guadagna il 100% degli incassi da ogni unità venduta!' 
    },
    pizza_lab_name_label: { en: 'Pizza Name', it: 'Nome della Pizza' },
    pizza_lab_toppings: { en: 'Select Toppings', it: 'Seleziona Ingredienti' },
    pizza_lab_summary: { en: 'Recipe Summary', it: 'Riepilogo Ricetta' },
    pizza_lab_total_price: { en: 'Consumer Unit Price', it: 'Prezzo Unitario Consumatore' },
    pizza_lab_mint_btn: { en: 'Mint Recipe & Start Earning', it: 'Conia Ricetta & Inizia a Guadagnare' },
    pizza_lab_incassi: { en: 'You earn 100% of these sales!', it: 'Guadagni il 100% di queste vendite!' },
    pizza_lab_success: { en: 'Pizza Created! It\'s now serving at GastroShare DAO.', it: 'Pizza Creata! È ora servita presso GastroShare DAO.' },

    // Bid Modal
    bid_modal_title: { en: 'Place your Bid', it: 'Fai la tua Offerta' },
    bid_modal_current: { en: 'Current Highest Bid', it: 'Offerta più alta attuale' },
    bid_modal_your_bid: { en: 'Your Bid (€)', it: 'La tua Offerta (€)' },
    bid_modal_min_step: { en: 'Minimum markup: €50', it: 'Rialzo minimo: €50' },
    bid_modal_btn_confirm: { en: 'Confirm Bid', it: 'Conferma Offerta' },
    bid_modal_btn_cancel: { en: 'Cancel', it: 'Annulla' },
    bid_modal_success: { en: 'Bid Placed Successfully!', it: 'Offerta Inviata con Successo!' },

    // Dish Detail
    detail_back: { en: 'Back to Master Menu', it: 'Torna al Master Menu' },
    detail_oracle_feed: { en: 'Oracle Live Feed (Simulated)', it: 'Feed Oracolo Live (Simulato)' },
    detail_order: { en: 'Order', it: 'Ordine' },
    detail_vol_monthly: { en: 'Monthly Volume', it: 'Volume Mensile' },
    detail_units: { en: 'units', it: 'unità' },
    detail_yield_annual: { en: 'Est. Annual Yield', it: 'Rendita Annua Stimata' },
    detail_apy: { en: 'Implied APY', it: 'APY Implicito' },
    detail_royalty: { en: 'Royalty Rate', it: 'Tasso Royalty' },
    detail_chart_title: { en: 'Revenue Projection (Royalty Share)', it: 'Proiezione Ricavi (Quota Royalty)' },
    detail_btn_bid: { en: 'Place Bid Now', it: 'Fai un\'Offerta Ora' },
    detail_min_bid: { en: 'Minimum Bid', it: 'Offerta Minima' },

    // Dashboard
    dash_title: { en: 'Investor Dashboard', it: 'Dashboard Investitore' },
    dash_bal: { en: 'Total Balance', it: 'Saldo Totale' },
    dash_last_30: { en: 'Last 30d', it: 'Ultimi 30gg' },
    dash_active: { en: 'Active Assets', it: 'Asset Attivi' },
    dash_dishes: { en: 'Dishes', it: 'Piatti' },
    dash_unclaimed: { en: 'Unclaimed Yield', it: 'Rendita Non Riscossa' },
    dash_btn_claim: { en: 'Claim', it: 'Riscuoti' },
    dash_my_assets: { en: 'My Assets', it: 'I Miei Asset' },
    dash_my_pizzas: { en: 'My Created Pizzas (100% Revenue)', it: 'Mie Pizze Create (100% Incassi)' },
    dash_th_dish: { en: 'Dish', it: 'Piatto' },
    dash_th_type: { en: 'Type', it: 'Tipo' },
    dash_th_vol: { en: 'Daily Vol', it: 'Vol Giornaliero' },
    dash_th_yield: { en: 'My Yield (30d)', it: 'Mio Rendimento (30gg)' },
    dash_th_actions: { en: 'Actions', it: 'Azioni' },
    dash_btn_manage: { en: 'Manage', it: 'Gestisci' },
    dash_empty_assets: { en: 'No assets owned. Visit Auctions or Marketplace to invest.', it: 'Nessun asset posseduto. Visita le Aste o il Marketplace per investire.' },
    dash_empty_pizzas: { en: 'No custom pizzas created yet. Visit Pizza Lab!', it: 'Nessuna pizza creata. Visita il Pizza Lab!' },
    
    // Footer
    footer_rights: { en: 'Decentralized Gastronomy. Smart Contract Verified.', it: 'Gastronomia Decentralizzata. Smart Contract Verificato.' }
};