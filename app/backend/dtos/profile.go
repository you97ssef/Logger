package dtos

type NewProfileDTO struct {
	Name     string     `json:"name" binding:"required,max=255"`
	Trackers *[]Tracker `json:"trackers" binding:"omitempty,dive"`
}

type UpdateProfileDTO struct {
	Name     *string    `json:"name" binding:"omitempty,max=255"`
	Trackers *[]Tracker `json:"trackers" binding:"omitempty,dive"`
}

type Tracker struct {
	Name     string `json:"name" binding:"required,max=64"`
	Pattern  string `json:"pattern" binding:"required,max=64"`
	Platform uint8  `json:"platform" binding:"required"`
}
