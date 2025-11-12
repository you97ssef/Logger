package helpers

import (
	"fmt"
	"logger/dtos"
	"strconv"
	"strings"
)

func TrackersToString(u *dtos.UpdateProfileDTO) *string {
	if u.Trackers == nil || len(*u.Trackers) == 0 {
		return nil
	}

	parts := make([]string, 0, len(*u.Trackers))
	for _, t := range *u.Trackers {
		parts = append(parts, fmt.Sprintf("%s,%s,%d", t.Name, t.Pattern, t.Platform))
	}

	result := strings.Join(parts, ";")
	return &result
}

func StringToTrackers(input string) ([]dtos.Tracker, error) {
	trackerStrs := strings.Split(input, ";")
	trackers := make([]dtos.Tracker, 0, len(trackerStrs))

	for i, s := range trackerStrs {
		parts := strings.Split(s, ",")
		if len(parts) != 3 {
			return nil, fmt.Errorf("invalid tracker format at index %d: %q", i, s)
		}

		platformInt, err := strconv.Atoi(parts[2])
		if err != nil {
			return nil, fmt.Errorf("invalid platform at index %d: %v", i, err)
		}
		if platformInt < 1 || platformInt > 3 {
			return nil, fmt.Errorf("invalid platform value %d at index %d (must be 1, 2, or 3)", platformInt, i)
		}

		trackers = append(trackers, dtos.Tracker{
			Name:     strings.TrimSpace(parts[0]),
			Pattern:  strings.TrimSpace(parts[1]),
			Platform: uint8(platformInt),
		})
	}

	return trackers, nil
}
