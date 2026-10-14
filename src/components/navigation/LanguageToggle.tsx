import { useTranslation } from 'react-i18next'

interface LanguageToggleProps {
  language: 'en' | 'th'
  onChange: (language: 'en' | 'th') => void
}

export function LanguageToggle({ language, onChange }: LanguageToggleProps) {
  const { t } = useTranslation()

  return (
    <div className="language-toggle" role="group" aria-label={t('navigation.language')}>
      {(['en', 'th'] as const).map((option) => (
        <button
          aria-pressed={language === option}
          className={language === option ? 'language-toggle__option is-active' : 'language-toggle__option'}
          key={option}
          onClick={() => onChange(option)}
          type="button"
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
