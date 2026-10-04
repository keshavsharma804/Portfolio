import { useContext } from 'react'
import {
  I18nContext,
  ThemeContext,
  PlainViewContext,
  type I18nValue,
  type ThemeValue,
  type PlainViewValue,
} from './preferences-context'

export function useI18n(): I18nValue {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used inside I18nProvider')
  return context
}

export function useTheme(): ThemeValue {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}

export function usePlainView(): PlainViewValue {
  const context = useContext(PlainViewContext)
  if (!context) throw new Error('usePlainView must be used inside PlainViewProvider')
  return context
}
