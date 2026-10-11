package com.codebangers.backend.course.dto;

import java.util.UUID;

public record TeacherResponse(
    UUID id,
    String firstName,
    String lastName,
    String email,
    String userName
) {}
