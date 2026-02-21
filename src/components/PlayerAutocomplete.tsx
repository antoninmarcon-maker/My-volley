import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayerAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: { id: string; name: string }[];
  placeholder?: string;
  className?: string;
}

export function PlayerAutocomplete({ value, onChange, suggestions, placeholder, className }: PlayerAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = value.trim()
    ? suggestions.filter(s => s.name.toLowerCase().includes(value.toLowerCase()) && s.name.toLowerCase() !== value.toLowerCase())
    : suggestions;

  const showDropdown = focused && filtered.length > 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          value={value}
          onChange={e => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => { setFocused(true); setOpen(true); }}
          placeholder={placeholder}
          className={cn('h-10 pr-8', className)}
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>
      {showDropdown && open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-40 overflow-y-auto">
          {filtered.map(s => (
            <button
              key={s.id}
              type="button"
              onMouseDown={e => {
                e.preventDefault();
                onChange(s.name);
                setOpen(false);
                setFocused(false);
              }}
              className="w-full text-left px-3 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
