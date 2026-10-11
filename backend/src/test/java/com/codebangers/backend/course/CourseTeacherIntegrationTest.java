package com.codebangers.backend.course;

import com.codebangers.backend.chapter.model.Chapter;
import com.codebangers.backend.chapter.repository.ChapterRepository;
import com.codebangers.backend.config.JwtService;
import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.model.CourseTier;
import com.codebangers.backend.course.repository.CourseRepository;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@EnabledIfEnvironmentVariable(named = "SPRING_PROFILES_ACTIVE", matches = ".*")
public class CourseTeacherIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private JwtService jwtService;

    private MockMvc mockMvc;

    private User admin;
    private User teacher;
    private Course course;
    private Chapter chapter;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();
    }

    @AfterEach
    void tearDown() {
        if (course != null && course.getId() != null) {
            try {
                course.getAssignedTeachers().clear();
                courseRepository.saveAndFlush(course);
            } catch (Exception ignored) {}
        }
        if (chapter != null && chapter.getId() != null) {
            try {
                chapterRepository.deleteById(chapter.getId());
            } catch (Exception ignored) {}
        }
        if (course != null && course.getId() != null) {
            try {
                courseRepository.deleteById(course.getId());
            } catch (Exception ignored) {}
        }
        if (teacher != null && teacher.getId() != null) {
            try {
                userRepository.deleteById(teacher.getId());
            } catch (Exception ignored) {}
        }
        if (admin != null && admin.getId() != null) {
            try {
                userRepository.deleteById(admin.getId());
            } catch (Exception ignored) {}
        }
    }

    @Test
    @DisplayName("Real end-to-end flow: admin assigns course to teacher and teacher retrieves assigned course with eager fetch and no lazy exceptions")
    void testRealWorldAdminAssignsCourseAndTeacherRetrievesIt() throws Exception {
        // 1. Insère en base réelle un administrateur et un utilisateur TEACHER
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        admin = new User("admin_" + suffix, "Admin", "Super", "admin_" + suffix + "@codebangers.fr", "hash", Role.ADMIN);
        admin = userRepository.save(admin);

        teacher = new User("teacher_" + suffix, "Prof", "Expert", "teacher_" + suffix + "@codebangers.fr", "hash", Role.TEACHER);
        teacher = userRepository.save(teacher);

        // Insère un cours complet avec createdBy = admin
        course = new Course("Formation Intégration Réelle " + suffix, "Description complète de la formation");
        course.setCreatedBy(admin);
        course.setPriceInCents(57900L);
        course.setCurrency("EUR");
        course.setSlug("formation-reelle-" + suffix);
        course.setRequiredTier(CourseTier.WEB);
        course = courseRepository.save(course);

        // Insère un chapitre associé
        chapter = new Chapter(course, "Chapitre 1 : Introduction Réelle", 1);
        chapter = chapterRepository.save(chapter);

        // 2. Génère de vrais tokens JWT
        String adminToken = jwtService.generateToken(admin);
        String teacherToken = jwtService.generateToken(teacher);

        // 3. Appelle l'endpoint réel POST /api/courses/{courseId}/teachers/{teacherId} avec le token admin
        mockMvc.perform(post("/api/courses/" + course.getId() + "/teachers/" + teacher.getId())
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(course.getId().toString()))
                .andExpect(jsonPath("$.assignedTeachers", hasSize(1)))
                .andExpect(jsonPath("$.assignedTeachers[0].id").value(teacher.getId().toString()));

        // 4. Vérifie l'insertion effective dans la table de jointure course_teacher
        assertTrue(courseRepository.isTeacherAssignedToCourse(course.getId(), teacher.getId()),
                "Le formateur doit être effectivement inséré dans la table de jointure course_teacher");

        // 5. Appelle l'endpoint réel GET /api/courses/my-assigned-courses avec le token formateur
        mockMvc.perform(get("/api/courses/my-assigned-courses")
                .header("Authorization", "Bearer " + teacherToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(course.getId().toString()))
                .andExpect(jsonPath("$[0].title").value(course.getTitle()))
                .andExpect(jsonPath("$[0].chaptersCount").value(1))
                .andExpect(jsonPath("$[0].createdByName", containsString("Admin")))
                .andExpect(jsonPath("$[0].assignedTeachers[0].id").value(teacher.getId().toString()));
    }
}
