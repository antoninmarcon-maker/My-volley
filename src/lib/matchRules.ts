import { Team, PointType, ActionType, MatchMetadata } from '@/types/sports';
import { CustomAction } from '@/lib/actionsConfig';

/**
 * Validates match logic according to action_data_requirements.md
 * Returns a set of boolean flags describing exactly what information needs
 * to be collected for the current action.
 */
export function getActionRequirements(
    hasPlayers: boolean,
    team: Team,
    type: PointType,
    actionKey: ActionType,
    meta: Partial<CustomAction> & { placeOnCourt?: boolean } | undefined,
    metadata: MatchMetadata | null,
    isPerformanceMode: boolean
) {
    // 1. Core eligibility based on category
    const isBlueScored = team === 'blue' && type === 'scored';
    const isRedFault = team === 'red' && type === 'fault';
    const isNeutral = type === 'neutral';

    // Eligible actions are the only ones taking inputs from our team
    const isEligibleForInput = isNeutral || isBlueScored || isRedFault;

    // 2. Player assignment rule
    const needsAssignToPlayer =
        hasPlayers &&
        meta?.assignToPlayer !== false &&
        isEligibleForInput;

    // 3. Court placement rule
    const SERVICE_FAULT_ACTIONS = ['service_miss', 'gameplay_fault', 'timeout'];
    const isAutoPlacedAction = SERVICE_FAULT_ACTIONS.includes(actionKey);

    const needsCourtPlacement =
        metadata?.hasCourt !== false &&
        meta?.placeOnCourt !== false &&
        !isAutoPlacedAction;

    // 4. Rating rule
    const globalRatingsEnabled = metadata?.enableRatings !== false;
    const perActionRating = meta?.hasRating === true;
    const nonRateableActions = ['timeout'];

    // Rating is NEVER asked for faults. Only for scored/neutral actions if configured so.
    const needsRating =
        isEligibleForInput &&
        type !== 'fault' &&
        !nonRateableActions.includes(actionKey) &&
        (perActionRating || globalRatingsEnabled);

    // 5. Direction rule
    const needsDirection =
        isPerformanceMode &&
        metadata?.hasCourt !== false &&
        meta?.hasDirection === true;

    // 6. Fast-track auto point logic
    const isAutoPoint =
        metadata?.hasCourt === false ||
        isAutoPlacedAction ||
        meta?.placeOnCourt === false;

    return {
        needsAssignToPlayer,
        needsCourtPlacement,
        needsRating,
        needsDirection,
        isAutoPoint
    };
}

/**
 * Legacy compatibility helper, to avoid breaking useMatchState internal loops
 */
export function needsPlayerAssignment(hasPlayers: boolean, team: Team, type: PointType, assignToPlayer: boolean | undefined): boolean {
    if (!hasPlayers) return false;
    if (assignToPlayer === false) return false;
    return type === 'neutral' || (team === 'blue' && type === 'scored') || (team === 'red' && type === 'fault');
}
