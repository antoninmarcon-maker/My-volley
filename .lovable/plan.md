

## Diagnostic

J'ai tracé le flux complet du mode performance pour une action "Point gagné > Attaque" avec trajectoire (`hasDirection: true`). Deux bugs distincts empêchent le bon fonctionnement :

### Bug 1 — Le 2e clic (destination) est bloqué

Quand `addPoint` entre en mode direction (`startDirectionMode`), il :
- Met `pendingDirectionAction` à une valeur truthy
- Met `pendingActionMeta` à null (ligne 347)

Or dans `VolleyballCourt`, quand `pendingDirectionAction` est truthy :
```text
selectedTeam={pendingDirectionAction ? null : selectedTeam}  // → null
```
Donc `hasSelection = false`. Et dans `handlePointerDown` :
```text
if (!hasSelection) return;  // ← BLOQUE tous les clics !
```
Le check de direction dans `handleInteraction` (ligne 227) n'est jamais atteint car `handlePointerDown` retourne avant.

### Bug 2 — `pendingHasDirection` absent des dépendances

`handleInteraction` utilise `pendingHasDirection` (ligne 235) mais ne l'a pas dans son tableau de dépendances (ligne 247), ce qui peut causer des valeurs stale.

## Plan de correction

### Fichier : `src/components/VolleyballCourt.tsx`

1. **`handlePointerDown`** : Autoriser les clics quand le mode direction est actif (`pendingDirectionAction && directionOrigin`), même si `hasSelection` est false.

```typescript
const handlePointerDown = useCallback((e) => {
  const inDirectionMode = pendingDirectionAction && directionOrigin;
  if (!hasSelection && !inDirectionMode) return;
  // ... rest unchanged
}, [hasSelection, handleInteraction, pendingDirectionAction, directionOrigin]);
```

2. **`handleInteraction` deps** : Ajouter `pendingHasDirection` au tableau de dépendances.

3. **`handlePointerMove`** : Même correction, autoriser le drag en mode direction même sans `hasSelection`.

