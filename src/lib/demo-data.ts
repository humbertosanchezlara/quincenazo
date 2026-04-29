type DemoCategory = {
  id: string;
  name: string;
  transactionType: "income" | "expense";
  color: string;
  icon: string;
  subcategories: { id: string; name: string }[];
};

export const demoCategories: DemoCategory[] = [
  {
    id: "cat-ingresos",
    name: "Ingresos",
    transactionType: "income",
    color: "#2f7d4f",
    icon: "Wallet",
    subcategories: [
      { id: "sub-nomina", name: "Nómina" },
      { id: "sub-freelance", name: "Freelance" },
    ],
  },
  {
    id: "cat-casa",
    name: "Casa",
    transactionType: "expense",
    color: "#d6a756",
    icon: "House",
    subcategories: [
      { id: "sub-renta", name: "Renta" },
      { id: "sub-servicios", name: "Servicios" },
    ],
  },
  {
    id: "cat-comida",
    name: "Comida",
    transactionType: "expense",
    color: "#ef8a5b",
    icon: "Utensils",
    subcategories: [
      { id: "sub-super", name: "Supermercado" },
      { id: "sub-cafes", name: "Cafés y antojos" },
    ],
  },
  {
    id: "cat-movilidad",
    name: "Movilidad",
    transactionType: "expense",
    color: "#5993b6",
    icon: "Car",
    subcategories: [
      { id: "sub-gasolina", name: "Gasolina" },
      { id: "sub-uber", name: "Uber / taxi" },
    ],
  },
  {
    id: "cat-estilo",
    name: "Estilo de vida",
    transactionType: "expense",
    color: "#7f6bb3",
    icon: "Sparkles",
    subcategories: [
      { id: "sub-gym", name: "Gimnasio" },
      { id: "sub-streaming", name: "Streaming" },
    ],
  },
];

export const demoRecurring = [
  {
    name: "Renta del depa",
    amount: 12000,
    transactionType: "expense" as const,
    categoryKey: "Casa",
    subcategoryKey: "Renta",
    payee: "Arrendador",
    notes: "Pago automático cada día 2",
    dayOfMonth: 2,
  },
  {
    name: "Spotify",
    amount: 149,
    transactionType: "expense" as const,
    categoryKey: "Estilo de vida",
    subcategoryKey: "Streaming",
    payee: "Spotify",
    notes: "Suscripción familiar",
    dayOfMonth: 6,
  },
];

export const demoTransactions = [
  {
    amount: 28400,
    occurredOn: 1,
    transactionType: "income" as const,
    categoryKey: "Ingresos",
    subcategoryKey: "Nómina",
    payee: "Empresa",
    notes: "Quincena principal",
  },
  {
    amount: 3700,
    occurredOn: 3,
    transactionType: "expense" as const,
    categoryKey: "Comida",
    subcategoryKey: "Supermercado",
    payee: "Costco",
    notes: "Compra grande de despensa",
  },
  {
    amount: 1840,
    occurredOn: 4,
    transactionType: "expense" as const,
    categoryKey: "Casa",
    subcategoryKey: "Servicios",
    payee: "CFE + agua",
    notes: "Servicios del mes",
  },
  {
    amount: 460,
    occurredOn: 5,
    transactionType: "expense" as const,
    categoryKey: "Movilidad",
    subcategoryKey: "Uber / taxi",
    payee: "Uber",
    notes: "Traslados a juntas",
  },
  {
    amount: 960,
    occurredOn: 9,
    transactionType: "expense" as const,
    categoryKey: "Comida",
    subcategoryKey: "Cafés y antojos",
    payee: "Blend Station",
    notes: "Cafés y comidas rápidas",
  },
  {
    amount: 5200,
    occurredOn: 12,
    transactionType: "income" as const,
    categoryKey: "Ingresos",
    subcategoryKey: "Freelance",
    payee: "Cliente freelance",
    notes: "Landing page de abril",
  },
  {
    amount: 899,
    occurredOn: 15,
    transactionType: "expense" as const,
    categoryKey: "Estilo de vida",
    subcategoryKey: "Gimnasio",
    payee: "Sports World",
    notes: "Mensualidad",
  },
];

export const demoBudgetTargets = [
  { categoryKey: "Casa", plannedAmount: 15000 },
  { categoryKey: "Comida", plannedAmount: 6000 },
  { categoryKey: "Movilidad", plannedAmount: 2500 },
  { categoryKey: "Estilo de vida", plannedAmount: 1800 },
];
