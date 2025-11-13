package controllers

import (
	"encoding/json"
	"logger/helpers"
	"logger/models"
	"strings"
)

// handleTrackers evaluates the profile trackers against the given entry text.
// It emits an in-app realtime notification and/or sends an email depending on
// each tracker's platform configuration.
func (ctl *Controller) handleTrackers(profile *models.Profile, entry *models.Entry, token string) {
    if profile == nil || profile.Trackers == nil || *profile.Trackers == "" {
        return
    }

    trackers, err := helpers.StringToTrackers(*profile.Trackers)
    if err != nil {
        ctl.server.Logger.Alert(err)
        return
    }

    for _, t := range trackers {
        if t.Pattern == "" {
            continue
        }

        if !strings.Contains(entry.Text, t.Pattern) {
            continue
        }

        // In-app (realtime) notification
        if t.Platform == models.InApp || t.Platform == models.Both {
            notif := map[string]any{
                "type":        "tracker_hit",
                "trackerName": t.Name,
                "pattern":     t.Pattern,
                "profileId":   profile.ID,
                "entry":       entry,
            }
            if b, mErr := json.Marshal(notif); mErr == nil {
                ctl.server.RealTime.BroadcastToToken(token, b)
            } else {
                ctl.server.Logger.Alert(mErr)
            }
        }

        // Email notification
        if t.Platform == models.Email || t.Platform == models.Both {
            user, uerr := ctl.repositories.UserRepo.FindById(profile.UserId)
            if uerr != nil {
                ctl.server.Logger.Alert(uerr)
            } else if user != nil {
                to := []string{user.Email}
                subject := "Tracker matched: " + t.Name
                body := "<p>Your tracker '<strong>" + t.Name + "</strong>' matched pattern <code>" + t.Pattern + "</code>.</p>" +
                    "<p><strong>Profile:</strong> " + profile.Name + "</p>" +
                    "<p><strong>Log:</strong> " + entry.Text + "</p>"
                if err := ctl.server.Mailer.SendEmail(to, subject, body); err != nil {
                    ctl.server.Logger.Alert(err)
                }
            }
        }
    }
}
