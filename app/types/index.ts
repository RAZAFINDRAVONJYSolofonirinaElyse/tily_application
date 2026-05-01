// src/types/index.ts

export type SokajyType  = 'lovitao' | 'tily' | 'mpiandalana' | 'mpitarika' | 'mpiandraikitra'
export type SexeType    = 'lahy' | 'vavy'
export type FafiStatut  = 'nandoa' | 'ampahany' | 'tsy_nandoa'
export type NavPage     = 'dashboard' | 'membres' | 'surveillance' | 'fdp' | 'teknika' | 'fafi' | 'audit' | 'admin'
export type UserSampana = 'lovitao' | 'tily' | 'mpiandalana' | 'mpitarika' | 'tonia'

export interface SessionUser {
  userId:      number
  email:       string
  nom:         string
  prenoms:     string
  sampana:     UserSampana
  isSuperAdmin: boolean
  isApproved:  boolean
}

export interface UserRecord {
  id:          number
  nom:         string
  prenoms:     string
  email:       string
  sampana:     UserSampana
  isApproved:  boolean
  isSuperAdmin: boolean
  isActive:    boolean
  createdAt:   string
}

export interface AuditEntry {
  id:       number
  userId:   number
  action:   string
  entity:   string
  entityId?: number
  details?: Record<string, unknown>
  createdAt: string
  user:     { nom: string; prenoms: string; sampana: UserSampana }
}

// ---- Domain models (client-side) ----

export interface AmbaratongaItem {
  id?: number
  label: string
  ordre?: number
  daty: string
  talenta: string
  talenDaty: string
}

export interface FanekenaItem {
  id?: number
  sokajyFane?: string
  daty: string
  toerana: string
  andraikitra: string
}

export interface FiofananaItem {
  id?: number
  dingam: string
  fotoana: string
  toerana: string
  tomponAndraikitra: string
  fanamarihana: string
}

export interface Membre {
  id: number | null
  numeroCarte: string
  sokajy: SokajyType
  taomPanabeazana: string
  anarana: string
  fanampiny: string
  datyNahaterahana: string
  toeraNahaterahana: string
  sex: SexeType
  iraitampo: string
  rayAnarana: string
  rayAsa: string
  renyAnarana: string
  renyAsa: string
  finday: string
  adiresy: string
  email: string
  kilasy: string
  piangonanaKilasy: string
  sekolyAlahady: boolean
  sampanaPiangonana: string
  lidiRaLovitao: string
  tilyMaitso: string
  fanasan: boolean
  mpanantona: boolean
  sampanaRaisina: string
  aretina: string
  sakafo: string
  toetraManokana: string
  tenyRaaman: string
  asaAtao: string
  fahaizana: string
  traikefa: string
  mpiandalanaGrade: string
  menafifyGrade: string
  fiantso: string
  andraikitrePoste: string
  manambady: boolean
  zanakaIsa: number
  fiangonana: string
  fivondronana: string
  ambaratonga: AmbaratongaItem[]
  fanekena: FanekenaItem[]
  fiofanana?: FiofananaItem[]
  ambDone?: number
  ambTotal?: number
}

export interface FDPRowItem {
  daty: string
  lohahevitra: string
  sehatra: string
  fomba: string
  toerana: string
}

export interface FDP {
  id?: number
  taomPanabeazana: string
  sokajy: SokajyType
  faritany: string
  fivondronana: string
  faritra: string
  sampana: string
  quarter: string
  months: number
  tanjona: string
  kendrena: [string, string, string]
  rows: FDPRowItem[]
}

export interface TeknikaRowItem {
  ora: string
  atao: string
  fomba: string
  tomponAndraikitra: string
  fitaovana: string
  fanamarihana: string
}

export interface Teknika {
  id?: number
  taomPanabeazana: string
  sokajy: SokajyType
  sampana: string
  daty: string
  tanjona: string
  kendrena: [string, string, string]
  faharetany: string
  toerana: string
  vontoatiny: string
  tombane: string
  rows: TeknikaRowItem[]
}

export interface FafiEntry {
  id?: number
  membreId: number
  taomPanabeazana: string
  datyFandoavana: string
  volaNaloa: string
  statut: FafiStatut
  mpandray: string
  fanamarihana: string
  // joined
  anarana?: string
  fanampiny?: string
  sokajy?: SokajyType
  numeroCarte?: string
}

export interface FafiStats {
  sokajy: SokajyType
  taomPanabeazana: string
  totalMembres: number
  nandoa: number
  ampahany: number
  tsyNandoa: number
  totalVola: number
}

export type MembresState = Record<SokajyType, Membre[]>

// ---- Config ----
export interface CatConfig {
  label: string
  color: string
  light: string
  dot: string
  tw: {
    bg: string
    text: string
    border: string
    badge: string
    sidebar: string
    sidebarActive: string
    btn: string
  }
}

export const CATS: Record<SokajyType, CatConfig> = {
  lovitao: {
    label: 'Lovitao', color: '#EFC100', light: '#FEF9E0', dot: '#EFC100',
    tw: {
      bg: 'bg-lovitao-light', text: 'text-lovitao', border: 'border-lovitao-dot',
      badge: 'bg-lovitao-light text-lovitao border border-lovitao-dot',
      sidebar: 'border-l-lovitao-dot text-white/50',
      sidebarActive: 'border-l-lovitao-dot bg-white/10 text-white',
      btn: 'bg-lovitao text-white hover:bg-lovitao/90',
    },
  },
  tily: {
    label: 'Tily', color: '#00911B', light: '#E6F7E9', dot: '#00911B',
    tw: {
      bg: 'bg-tily-light', text: 'text-tily', border: 'border-tily-dot',
      badge: 'bg-tily-light text-tily border border-tily-dot',
      sidebar: 'border-l-tily-dot text-white/50',
      sidebarActive: 'border-l-tily-dot bg-white/10 text-white',
      btn: 'bg-tily text-white hover:bg-tily/90',
    },
  },
  mpiandalana: {
    label: 'Mpiandalana', color: '#EF0013', light: '#FEE6E8', dot: '#EF0013',
    tw: {
      bg: 'bg-mpiandalana-light', text: 'text-mpiandalana', border: 'border-mpiandalana-dot',
      badge: 'bg-mpiandalana-light text-mpiandalana border border-mpiandalana-dot',
      sidebar: 'border-l-mpiandalana-dot text-white/50',
      sidebarActive: 'border-l-mpiandalana-dot bg-white/10 text-white',
      btn: 'bg-mpiandalana text-white hover:bg-mpiandalana/90',
    },
  },
  mpitarika: {
    label: 'Mpitarika', color: '#6D071A', light: '#FBF0F2', dot: '#6D071A',
    tw: {
      bg: 'bg-mpitarika-light', text: 'text-mpitarika', border: 'border-mpitarika-dot',
      badge: 'bg-mpitarika-light text-mpitarika border border-mpitarika-dot',
      sidebar: 'border-l-mpitarika-dot text-white/50',
      sidebarActive: 'border-l-mpitarika-dot bg-white/10 text-white',
      btn: 'bg-mpitarika text-white hover:bg-mpitarika/90',
    },
  },
  mpiandraikitra: {
    label: 'Mpiandraikitra', color: '#0041A0', light: '#E6EEF8', dot: '#0041A0',
    tw: {
      bg: 'bg-mpiandraikitra-light', text: 'text-mpiandraikitra', border: 'border-mpiandraikitra-dot',
      badge: 'bg-mpiandraikitra-light text-mpiandraikitra border border-mpiandraikitra-dot',
      sidebar: 'border-l-mpiandraikitra-dot text-white/50',
      sidebarActive: 'border-l-mpiandraikitra-dot bg-white/10 text-white',
      btn: 'bg-mpiandraikitra text-white hover:bg-mpiandraikitra/90',
    },
  },
}

export const AMB: Record<SokajyType, string[]> = {
  lovitao:        ['Miana-mandady', 'Vakimaso I', 'Vakimaso II', 'Mpiremby'],
  tily:           ['Zazavao', 'Mpikatroka', 'Menavazana'],
  mpiandalana:    ['Mpiomana', 'Mpiatrika', 'Mpihary'],
  mpitarika:      ['Mpiketrika mameno', 'Mpialoha lalana', 'Mahatsangy no àry'],
  mpiandraikitra: ['Mpiomana', 'Mpiatrika', 'Mpihary'],
}

const Y = new Date().getFullYear()
export const YEARS = Array.from({ length: 6 }, (_, i) => { const y = Y - 1 + i; return `${y}-${y + 1}` })
export const CURRENT_YEAR = `${Y - 1}-${Y}`

export const FIOFANANA_DINGAM = [
  'FANOMANANA A', 'FANOMANANA B', 'FANOMANANA D', 'FANOMANANA E', 'FANOMANANA F',
  'FANATERANA A', 'FANATERANA B', 'FANATERANA D', 'FANATERANA E', 'FANATERANA F',
  'RAVINALA', 'Nanolorana TP2',
]

export function newMembre(cat: SokajyType, taom: string): Membre {
  const isMpia = cat === 'mpiandraikitra'
  return {
    id: null, numeroCarte: '', sokajy: cat, taomPanabeazana: taom,
    anarana: '', fanampiny: '', datyNahaterahana: '', toeraNahaterahana: '',
    sex: 'lahy', iraitampo: '',
    rayAnarana: '', rayAsa: '', renyAnarana: '', renyAsa: '',
    finday: '', adiresy: '', email: '', kilasy: '', piangonanaKilasy: '',
    sekolyAlahady: false, sampanaPiangonana: '',
    lidiRaLovitao: '', tilyMaitso: '',
    fanasan: false, mpanantona: false, sampanaRaisina: '',
    aretina: '', sakafo: '', toetraManokana: '', tenyRaaman: '',
    asaAtao: '', fahaizana: '', traikefa: '', mpiandalanaGrade: '', menafifyGrade: '',
    fiantso: '', andraikitrePoste: '', manambady: false, zanakaIsa: 0, fiangonana: '', fivondronana: '',
    ambaratonga: isMpia ? [] : AMB[cat].map(a => ({ label: a, daty: '', talenta: '', talenDaty: '' })),
    fanekena: isMpia
      ? [
          { daty: '', toerana: '', andraikitra: '' },
          { daty: '', toerana: '', andraikitra: '' },
          ...Array(4).fill(null).map(() => ({ daty: '', toerana: '', andraikitra: '', sokajyFane: '' })),
        ]
      : [{ daty: '', toerana: '', andraikitra: '' }],
    fiofanana: isMpia
      ? FIOFANANA_DINGAM.map(d => ({ dingam: d, fotoana: '', toerana: '', tomponAndraikitra: '', fanamarihana: '' }))
      : [],
  }
}
