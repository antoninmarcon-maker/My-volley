import { useRegisterSW } from 'virtual:pwa-register/react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, X } from 'lucide-react';

export function PwaUpdatePrompt() {
  const { t } = useTranslation();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] max-w-md mx-auto animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-primary/30 shadow-lg shadow-primary/10">
        <RefreshCw size={20} className="text-primary shrink-0" />
        <p className="text-sm font-medium text-foreground flex-1">{t('pwa.updateAvailable')}</p>
        <button
          onClick={() => updateServiceWorker(true)}
          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold whitespace-nowrap"
        >
          {t('pwa.update')}
        </button>
        <button
          onClick={() => setNeedRefresh(false)}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
