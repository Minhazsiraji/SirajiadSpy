import{normalizeCountry}from'./countries';

type PaymentSignal={label:string;pattern:RegExp};

const MARKET_SIGNALS:Record<string,PaymentSignal[]>={
  BD:[{label:'bKash',pattern:/\bbkash\b|বিকাশ/i},{label:'Nagad',pattern:/\bnagad\b|নগদ/i}],
  NP:[{label:'eSewa',pattern:/\besewa\b/i},{label:'Khalti',pattern:/\bkhalti\b/i},{label:'IME Pay',pattern:/\bime\s*pay\b/i}],
  IN:[{label:'UPI',pattern:/\bupi\b/i},{label:'Paytm',pattern:/\bpaytm\b/i},{label:'PhonePe',pattern:/\bphonepe\b/i}],
  PK:[{label:'Easypaisa',pattern:/\beasypaisa\b/i},{label:'JazzCash',pattern:/\bjazz\s*cash\b|\bjazzcash\b/i}],
  GH:[{label:'Mobile Money',pattern:/\bmobile money\b|\bmomo\b/i},{label:'MTN MoMo',pattern:/\bmtn\s*(momo|mobile money)\b/i}],
  KE:[{label:'M-Pesa',pattern:/\bm[-\s]?pesa\b/i}],
  RW:[{label:'Mobile Money',pattern:/\bmobile money\b|\bmomo\b/i}],
  PH:[{label:'GCash',pattern:/\bgcash\b/i},{label:'Maya',pattern:/\bpaymaya\b|\bmaya\b/i}],
  ID:[{label:'GoPay',pattern:/\bgopay\b/i},{label:'OVO',pattern:/\bovo\b/i},{label:'DANA',pattern:/\bdana\b/i}],
  MY:[{label:'Touch n Go eWallet',pattern:/touch\s*['’]?n\s*go/i},{label:'Boost',pattern:/\bboost\b/i}],
  TH:[{label:'PromptPay',pattern:/\bpromptpay\b/i}],
  VN:[{label:'MoMo',pattern:/\bmomo\b/i},{label:'ZaloPay',pattern:/\bzalopay\b/i}],
};

export function paymentSignalsForMarket(country?:string|null){return MARKET_SIGNALS[normalizeCountry(country)]||[]}
export function detectMarketPaymentSignals(html:string,country?:string|null){return paymentSignalsForMarket(country).filter(s=>s.pattern.test(html)).map(s=>s.label)}
export function paymentSignalHint(country?:string|null){const labels=paymentSignalsForMarket(country).map(s=>s.label);return labels.length?labels.join(', '):'local payment methods'}
