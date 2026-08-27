package com.codebangers.backend.config;

import com.codebangers.backend.chapter.model.Chapter;
import com.codebangers.backend.chapter.repository.ChapterRepository;
import com.codebangers.backend.content.model.Content;
import com.codebangers.backend.content.model.Content.ContentType;
import com.codebangers.backend.content.repository.ContentRepository;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.repository.CourseRepository;
import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.course.model.Enrollment.PaymentStatus;
import com.codebangers.backend.course.repository.EnrollmentRepository;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import com.codebangers.backend.workshop.model.UserWorkshop;
import com.codebangers.backend.workshop.model.Workshop;
import com.codebangers.backend.workshop.repository.UserWorkshopRepository;
import com.codebangers.backend.workshop.repository.WorkshopRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@Profile("dev")
public class SeedDataInitializer {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final ChapterRepository chapterRepository;
    private final ContentRepository contentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final WorkshopRepository workshopRepository;
    private final UserWorkshopRepository userWorkshopRepository;
    private final PasswordEncoder passwordEncoder;

    public SeedDataInitializer(UserRepository userRepository,
                               CourseRepository courseRepository,
                               ChapterRepository chapterRepository,
                               ContentRepository contentRepository,
                               EnrollmentRepository enrollmentRepository,
                               WorkshopRepository workshopRepository,
                               UserWorkshopRepository userWorkshopRepository,
                               PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.chapterRepository = chapterRepository;
        this.contentRepository = contentRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.workshopRepository = workshopRepository;
        this.userWorkshopRepository = userWorkshopRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seed() {
        if (!courseRepository.findAll().isEmpty()) {
            return;
        }

        User admin = userRepository.findByEmail("admin@codebangers.com")
                .orElseGet(() -> userRepository.save(new User("admin", "Admin", "User", "admin@codebangers.com", passwordEncoder.encode("changeme123"), Role.ADMIN)));
        User teacher = userRepository.findByEmail("teacher@codebangers.com")
                .orElseGet(() -> userRepository.save(new User("teacher", "Jane", "Doe", "teacher@codebangers.com", passwordEncoder.encode("changeme123"), Role.TEACHER)));
        User student = userRepository.findByEmail("student@codebangers.com")
                .orElseGet(() -> userRepository.save(new User("student", "John", "Smith", "student@codebangers.com", passwordEncoder.encode("changeme123"), Role.STUDENT)));
        User testUser = userRepository.findByEmail("test@codebangers.com")
                .orElseGet(() -> userRepository.save(new User("testuser", "Test", "User", "test@codebangers.com", passwordEncoder.encode("changeme123"), Role.ADMIN)));

        Course javaCourse = courseRepository.save(new Course("Java Fundamentals", "Learn the basics of Java programming"));
        Course springCourse = courseRepository.save(new Course("Spring Boot Essentials", "Build modern APIs with Spring Boot"));

        Chapter javaIntro = chapterRepository.save(new Chapter(javaCourse, null, "Introduction to Java", 1));
        Chapter javaOop = chapterRepository.save(new Chapter(javaCourse, null, "OOP Concepts", 2));
        Chapter springApi = chapterRepository.save(new Chapter(springCourse, null, "Creating REST APIs", 1));

        contentRepository.save(new Content(javaIntro, ContentType.HEADING, "Welcome to Java", null, 1));
        contentRepository.save(new Content(javaIntro, ContentType.PARAGRAPH, "Java is a powerful and portable language.", null, 2));
        contentRepository.save(new Content(javaOop, ContentType.CODE, "class Car { }", null, 1));
        contentRepository.save(new Content(springApi, ContentType.PARAGRAPH, "Spring Boot simplifies application setup.", null, 1));

        enrollmentRepository.save(new Enrollment(teacher, javaCourse, PaymentStatus.PAID, 100));
        enrollmentRepository.save(new Enrollment(student, javaCourse, PaymentStatus.PAID, 45));
        enrollmentRepository.save(new Enrollment(student, springCourse, PaymentStatus.PENDING, 10));
        enrollmentRepository.save(new Enrollment(testUser, springCourse, PaymentStatus.PAID, 80));

        Workshop workshop = workshopRepository.save(new Workshop("Live Coding Session", "Hands-on live session with the teaching team", LocalDateTime.now().plusDays(2), LocalDateTime.now().plusDays(2).plusHours(3)));
        userWorkshopRepository.save(new UserWorkshop(student, workshop, true));
        userWorkshopRepository.save(new UserWorkshop(teacher, workshop, false));
    }
}
