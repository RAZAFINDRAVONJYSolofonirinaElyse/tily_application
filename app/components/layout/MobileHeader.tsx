'use client'

import React from 'react'
import { LuMenu } from 'react-icons/lu'
import { useShell } from '@/(shell)/ShellContext'

const NAV_LABELS: Record<string, string> = {
  dashboard:    'Tableau de bord',
  membres:      'Mpikambana',
  surveillance: 'Fanaraha-maso',
  fdp:          'Fandaharam-panabeazana',
  teknika:      'Fisy Teknika',
  fafi:         'FAFI Assurance',
  audit:        'Historique',
  admin:        'Administration',
}

export default function MobileHeader({ onMenuOpen }: { onMenuOpen: () => void }) {
  const { nav } = useShell()
  return (
    <header className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm lg:hidden">
      <button
        type="button"
        onClick={onMenuOpen}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
        aria-label="Ouvrir le menu"
      >
        <LuMenu size={20} />
      </button>
      <img src="/LogoTily.png" alt="" className="h-6 w-6 object-contain" />
      <p className="font-semibold text-gray-900">{NAV_LABELS[nav] ?? nav}</p>
    </header>
  )
}
