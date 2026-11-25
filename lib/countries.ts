export const COUNTRIES = [
  { name: '일본', en: 'JAPAN', code: 'NRT' },
  { name: '중국', en: 'CHINA', code: 'PVG' },
  { name: '대만', en: 'TAIWAN', code: 'TPE' },
  { name: '태국', en: 'THAILAND', code: 'BKK' },
  { name: '베트남', en: 'VIETNAM', code: 'DAD' },
  { name: '필리핀', en: 'PHILIPPINES', code: 'CEB' },
  { name: '싱가포르', en: 'SINGAPORE', code: 'SIN' },
  { name: '말레이시아', en: 'MALAYSIA', code: 'KUL' },
  { name: '인도네시아', en: 'INDONESIA', code: 'DPS' },
  { name: '몽골', en: 'MONGOLIA', code: 'UBN' },
  { name: '라오스', en: 'LAOS', code: 'VTE' },
  { name: '캄보디아', en: 'CAMBODIA', code: 'REP' },
  { name: '미국', en: 'USA', code: 'JFK' },
  { name: '캐나다', en: 'CANADA', code: 'YVR' },
  { name: '멕시코', en: 'MEXICO', code: 'CUN' },
  { name: '호주', en: 'AUSTRALIA', code: 'SYD' },
  { name: '뉴질랜드', en: 'NEW ZEALAND', code: 'AKL' },
  { name: '프랑스', en: 'FRANCE', code: 'CDG' },
  { name: '영국', en: 'UNITED KINGDOM', code: 'LHR' },
  { name: '이탈리아', en: 'ITALY', code: 'FCO' },
  { name: '스페인', en: 'SPAIN', code: 'BCN' },
  { name: '독일', en: 'GERMANY', code: 'FRA' },
  { name: '스위스', en: 'SWITZERLAND', code: 'ZRH' },
  { name: '체코', en: 'CZECHIA', code: 'PRG' },
  { name: '오스트리아', en: 'AUSTRIA', code: 'VIE' },
  { name: '튀르키예', en: 'TÜRKIYE', code: 'IST' },
  { name: '그리스', en: 'GREECE', code: 'ATH' },
  { name: '포르투갈', en: 'PORTUGAL', code: 'LIS' },
  { name: '크로아티아', en: 'CROATIA', code: 'DBV' },
  { name: '아랍에미리트', en: 'UAE', code: 'DXB' },
] as const

export type CountryName = (typeof COUNTRIES)[number]['name']

export const COUNTRY_NAMES = COUNTRIES.map((c) => c.name) as unknown as readonly [
  CountryName,
  ...CountryName[],
]

export function findCountry(name: string) {
  return COUNTRIES.find((c) => c.name === name)
}
