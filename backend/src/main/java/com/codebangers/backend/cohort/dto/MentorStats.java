package com.codebangers.backend.cohort.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MentorStats {
    
    @JsonProperty("mentor_slots_remaining")
    private int mentorSlotsRemaining;

    public MentorStats() {}

    public MentorStats(int mentorSlotsRemaining) {
        this.mentorSlotsRemaining = mentorSlotsRemaining;
    }

    public int getMentorSlotsRemaining() {
        return mentorSlotsRemaining;
    }

    public void setMentorSlotsRemaining(int mentorSlotsRemaining) {
        this.mentorSlotsRemaining = mentorSlotsRemaining;
    }
}
