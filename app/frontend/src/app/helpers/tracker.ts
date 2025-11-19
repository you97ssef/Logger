import { Tracker } from '../dtos/profile';

export class TrackerHelper {
    static trackersToString(trackers: Tracker[] | null): string | null {
        if (!trackers || trackers.length === 0) {
            return null;
        }

        return trackers
            .map((t) => `${t.name},${t.pattern},${t.platform}`)
            .join(';');
    }

    static stringToTrackers(trackersString: string | null): Tracker[] {
        if (!trackersString) {
            return [];
        }

        const trackerParts = trackersString.split(';');
        return trackerParts.map((part) => {
            const [name, pattern, platform] = part.split(',');
            return {
                name: name?.trim() || '',
                pattern: pattern?.trim() || '',
                platform: platform?.trim() || '1',
            };
        });
    }
}
