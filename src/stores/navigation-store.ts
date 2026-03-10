import { create } from 'zustand'
import type { NavSection } from '@/types/portfolio.types'

interface NavigationState {
  activeSection: NavSection
  isMenuOpen: boolean
  setActiveSection: (section: NavSection) => void
  setMenuOpen: (open: boolean) => void
  toggleMenu: () => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeSection: 'hero',
  isMenuOpen: false,
  setActiveSection: (section) => set({ activeSection: section }),
  setMenuOpen: (open) => set({ isMenuOpen: open }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
}))
