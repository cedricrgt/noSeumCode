package com.codebangers.backend.domain;

import com.codebangers.backend.chapter.model.Chapter;
import com.codebangers.backend.content.model.Content;
import com.codebangers.backend.content.model.ContentType;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.course.model.Enrollment.PaymentStatus;
import com.codebangers.backend.workshop.model.Workshop;
import com.codebangers.backend.workshop.model.UserWorkshop;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class DomainModelTest {

    @Test
    void shouldCreateCoreLearningDomainEntities() {
        Course course = new Course("Java Basics", "A short intro to Java");
        Chapter chapter = new Chapter(course, null, "Setup", 1);
        Content content = new Content(chapter, ContentType.PARAGRAPH, "Hello world", null, 1);
        Enrollment enrollment = new Enrollment(null, course, PaymentStatus.PENDING, 0);
        Workshop workshop = new Workshop("Spring Boot Bootcamp", "Hands-on session", null, null);
        UserWorkshop userWorkshop = new UserWorkshop(null, workshop, true);

        assertNotNull(course);
        assertEquals("Java Basics", course.getTitle());
        assertEquals("Setup", chapter.getTitle());
        assertEquals(ContentType.PARAGRAPH, content.getContentType());
        assertEquals(PaymentStatus.PENDING, enrollment.getPaymentStatus());
        assertEquals("Spring Boot Bootcamp", workshop.getTitle());
        assertEquals(true, userWorkshop.isAttended());
    }
}
