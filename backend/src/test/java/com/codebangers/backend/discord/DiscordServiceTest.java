package com.codebangers.backend.discord;

import com.codebangers.backend.course.model.Course;
import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.course.model.Enrollment.PaymentStatus;
import com.codebangers.backend.course.model.EnrollmentTier;
import com.codebangers.backend.course.repository.EnrollmentRepository;
import com.codebangers.backend.discord.dto.DiscordMemberDto;
import com.codebangers.backend.discord.dto.DiscordStatusResponse;
import com.codebangers.backend.discord.service.DiscordGateway;
import com.codebangers.backend.discord.service.DiscordService;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DiscordServiceTest {

    @Mock
    private DiscordGateway discordGateway;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    private DiscordService discordService;
    private User testUser;

    @BeforeEach
    void setUp() {
        discordService = new DiscordService(discordGateway, userRepository, enrollmentRepository);

        testUser = new User("student1", "Jean", "Dupont", "jean@example.com", "hash", Role.STUDENT);
        testUser.setId(UUID.randomUUID());

        lenient().when(discordGateway.getInviteUrl()).thenReturn("https://discord.gg/noseumcode");
        lenient().when(discordGateway.getStarterRoleId()).thenReturn("role-starter-123");
        lenient().when(discordGateway.getWebRoleId()).thenReturn("role-web-456");
        lenient().when(discordGateway.getVipRoleId()).thenReturn("role-vip-789");
        lenient().when(discordGateway.getDefaultRoleId()).thenReturn("role-member-000");
        lenient().when(discordGateway.getStarterStageChannelUrl()).thenReturn("https://discord.com/channels/guild123/stage-starter");
        lenient().when(discordGateway.getWebStageChannelUrl()).thenReturn("https://discord.com/channels/guild123/stage-web");
        lenient().when(discordGateway.getLuffyVoiceChannelUrl()).thenReturn("https://discord.com/channels/guild123/voice-luffy");
        lenient().when(discordGateway.getGokuVoiceChannelUrl()).thenReturn("https://discord.com/channels/guild123/voice-goku");
        lenient().when(discordGateway.getNarutoVoiceChannelUrl()).thenReturn("https://discord.com/channels/guild123/voice-naruto");
        lenient().when(discordGateway.getMangaVoiceChannelUrls()).thenReturn(java.util.Map.of(
                "luffyCodeLabUrl", "https://discord.com/channels/guild123/voice-luffy",
                "gokuDojoLiveUrl", "https://discord.com/channels/guild123/voice-goku",
                "narutoTeamHubUrl", "https://discord.com/channels/guild123/voice-naruto"
        ));
    }

    @Test
    @DisplayName("Devrait retourner le statut non lié quand l'utilisateur n'a pas d'ID Discord")
    void shouldReturnUnlinkedStatusWhenNoDiscordId() {
        DiscordStatusResponse status = discordService.getDiscordStatus(testUser);

        assertFalse(status.linked());
        assertNull(status.discordUserId());
        assertNull(status.discordUsername());
        assertFalse(status.serverJoined());
        assertEquals("https://discord.gg/noseumcode", status.inviteUrl());
        assertTrue(status.assignedRoleNames().isEmpty());
    }

    @Test
    @DisplayName("Devrait lier avec succès un compte Discord et ajouter le membre au serveur avec le rôle approprié")
    void shouldLinkDiscordAccountSuccessfully() {
        when(userRepository.findByDiscordUserId("discord-999")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Course starterCourse = new Course("HTML & CSS", "desc");
        Enrollment enrollment = new Enrollment(testUser, starterCourse, PaymentStatus.PAID, 10, EnrollmentTier.STARTER, null);
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(List.of(enrollment));

        User updatedUser = discordService.linkDiscordAccount(
                testUser, "discord-999", "jean_discord", "avatar.png", "token-xyz"
        );

        assertTrue(updatedUser.isDiscordLinked());
        assertEquals("discord-999", updatedUser.getDiscordUserId());
        assertEquals("jean_discord", updatedUser.getDiscordUsername());
        assertNotNull(updatedUser.getDiscordLinkedAt());

        verify(discordGateway).addMemberToGuild(eq("discord-999"), eq("token-xyz"), anyList());
        verify(userRepository).save(testUser);
    }

    @Test
    @DisplayName("Devrait bloquer la liaison si le compte Discord est déjà rattaché à un autre compte NoSeumCode (Anti-collision)")
    void shouldPreventLinkingIfDiscordAlreadyAttachedToAnotherUser() {
        User anotherUser = new User("other", "Autre", "Apprenant", "autre@example.com", "hash", Role.STUDENT);
        anotherUser.setId(UUID.randomUUID());

        when(userRepository.findByDiscordUserId("discord-999")).thenReturn(Optional.of(anotherUser));

        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                discordService.linkDiscordAccount(testUser, "discord-999", "jean_discord", "avatar.png", "token-xyz")
        );

        assertTrue(ex.getMessage().contains("déjà associé à un autre compte"));
        verify(userRepository, never()).save(testUser);
    }

    @Test
    @DisplayName("Devrait dissocier un compte Discord")
    void shouldUnlinkDiscordAccountSuccessfully() {
        testUser.setDiscordUserId("discord-999");
        testUser.setDiscordUsername("jean_discord");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User unlinked = discordService.unlinkDiscordAccount(testUser);

        assertFalse(unlinked.isDiscordLinked());
        assertNull(unlinked.getDiscordUserId());
        assertNull(unlinked.getDiscordUsername());
        verify(userRepository).save(testUser);
    }

    @Test
    @DisplayName("Devrait attribuer le rôle Starter pour un apprenant Starter")
    void shouldResolveStarterRoleForStarterTier() {
        Course course = new Course("HTML", "desc");
        Enrollment enrollment = new Enrollment(testUser, course, PaymentStatus.PAID, 0, EnrollmentTier.STARTER, null);
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(List.of(enrollment));

        List<String> roleIds = discordService.resolveTargetRoleIds(testUser);

        assertTrue(roleIds.contains("role-starter-123"));
        assertTrue(roleIds.contains("role-member-000"));
        assertFalse(roleIds.contains("role-web-456"));
        assertFalse(roleIds.contains("role-vip-789"));
    }

    @Test
    @DisplayName("Devrait attribuer le rôle Web et Starter pour un apprenant Web")
    void shouldResolveWebAndStarterRolesForWebTier() {
        Course course = new Course("JavaScript", "desc");
        Enrollment enrollment = new Enrollment(testUser, course, PaymentStatus.PAID, 0, EnrollmentTier.WEB, null);
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(List.of(enrollment));

        List<String> roleIds = discordService.resolveTargetRoleIds(testUser);

        assertTrue(roleIds.contains("role-web-456"));
        assertTrue(roleIds.contains("role-starter-123"));
        assertTrue(roleIds.contains("role-member-000"));
        assertFalse(roleIds.contains("role-vip-789"));
    }

    @Test
    @DisplayName("Devrait attribuer les rôles VIP, Web et Starter pour un apprenant VIP")
    void shouldResolveAllRolesForVipTier() {
        Course course = new Course("VIP Mentoring", "desc");
        Enrollment enrollment = new Enrollment(testUser, course, PaymentStatus.PAID, 0, EnrollmentTier.VIP, null);
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(List.of(enrollment));

        List<String> roleIds = discordService.resolveTargetRoleIds(testUser);

        assertTrue(roleIds.contains("role-vip-789"));
        assertTrue(roleIds.contains("role-web-456"));
        assertTrue(roleIds.contains("role-starter-123"));
        assertTrue(roleIds.contains("role-member-000"));
    }

    @Test
    @DisplayName("Devrait synchroniser manuellement les rôles Discord d'un utilisateur lié")
    void shouldSyncUserRoles() {
        testUser.setDiscordUserId("discord-999");
        Course course = new Course("VIP Mentoring", "desc");
        Enrollment enrollment = new Enrollment(testUser, course, PaymentStatus.PAID, 0, EnrollmentTier.VIP, null);
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(List.of(enrollment));
        when(discordGateway.getGuildMember("discord-999")).thenReturn(Optional.of(
                new DiscordMemberDto("discord-999", "jean", null, null, List.of("role-vip-789"), "2026-09-28")
        ));

        DiscordStatusResponse response = discordService.syncUserRoles(testUser);

        assertTrue(response.linked());
        assertTrue(response.serverJoined());
        verify(discordGateway).addRoleToMember("discord-999", "role-vip-789");
        verify(discordGateway).addRoleToMember("discord-999", "role-web-456");
        verify(discordGateway).addRoleToMember("discord-999", "role-starter-123");
    }

    @Test
    @DisplayName("Devrait retirer les rôles Discord quand les paiements sont échoués ou remboursés")
    void shouldRemoveRevokedRolesWhenSyncingUserRoles() {
        testUser.setDiscordUserId("discord-999");
        Course course = new Course("VIP Mentoring", "desc");
        Enrollment enrollment = new Enrollment(testUser, course, PaymentStatus.FAILED, 0, EnrollmentTier.VIP, null);
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(List.of(enrollment));
        when(discordGateway.getGuildMember("discord-999")).thenReturn(Optional.of(
                new DiscordMemberDto("discord-999", "jean", null, null, List.of("role-vip-789"), "2026-09-28")
        ));

        DiscordStatusResponse response = discordService.syncUserRoles(testUser);

        assertTrue(response.linked());
        verify(discordGateway).removeRoleFromMember("discord-999", "role-vip-789");
        verify(discordGateway).removeRoleFromMember("discord-999", "role-web-456");
        verify(discordGateway).removeRoleFromMember("discord-999", "role-starter-123");
    }

    @Test
    @DisplayName("Devrait résoudre le libellé Formateur pour un utilisateur de rôle TEACHER")
    void shouldResolveTeacherRoleNameForTeacherUser() {
        User teacherUser = new User("cedric_teacher", "Cédric", "Ragot", "cedric@codebangers.fr", "hash", Role.TEACHER);
        teacherUser.setId(UUID.randomUUID());
        when(enrollmentRepository.findByUserId(teacherUser.getId())).thenReturn(List.of());

        List<String> names = discordService.resolveRoleNamesForUser(teacherUser);

        assertTrue(names.contains("Formateur"));
    }

    @Test
    @DisplayName("Devrait résoudre le salon Scène Starter pour un apprenant Starter lié")
    void shouldResolveStarterStageChannelUrlForStarterStudent() {
        testUser.setDiscordUserId("discord-999");
        Course course = new Course("HTML & CSS", "desc");
        Enrollment enrollment = new Enrollment(testUser, course, PaymentStatus.PAID, 0, EnrollmentTier.STARTER, null);
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(List.of(enrollment));
        when(discordGateway.getGuildMember("discord-999")).thenReturn(Optional.of(
                new DiscordMemberDto("discord-999", "jean", null, null, List.of("role-starter-123"), "2026-09-28")
        ));

        DiscordStatusResponse status = discordService.getDiscordStatus(testUser);

        assertTrue(status.linked());
        assertEquals("https://discord.com/channels/guild123/stage-starter", status.stageChannelUrl());
        assertNotNull(status.mangaVoiceChannels());
        assertEquals("https://discord.com/channels/guild123/voice-luffy", status.mangaVoiceChannels().get("luffyCodeLabUrl"));
        assertEquals("https://discord.com/channels/guild123/voice-goku", status.mangaVoiceChannels().get("gokuDojoLiveUrl"));
        assertEquals("https://discord.com/channels/guild123/voice-naruto", status.mangaVoiceChannels().get("narutoTeamHubUrl"));
    }

    @Test
    @DisplayName("Devrait résoudre le salon Scène Web pour un apprenant Web ou VIP lié")
    void shouldResolveWebStageChannelUrlForWebAndVipStudents() {
        testUser.setDiscordUserId("discord-999");
        Course course = new Course("JavaScript", "desc");
        Enrollment enrollment = new Enrollment(testUser, course, PaymentStatus.PAID, 0, EnrollmentTier.WEB, null);
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(List.of(enrollment));
        when(discordGateway.getGuildMember("discord-999")).thenReturn(Optional.of(
                new DiscordMemberDto("discord-999", "jean", null, null, List.of("role-web-456"), "2026-09-28")
        ));

        DiscordStatusResponse status = discordService.getDiscordStatus(testUser);

        assertEquals("https://discord.com/channels/guild123/stage-web", status.stageChannelUrl());
    }

    @Test
    @DisplayName("Devrait donner l'accès modérateur au salon Scène pour un Enseignant ou Administrateur")
    void shouldResolveModeratorStageChannelUrlForTeacherAndAdmin() {
        User teacher = new User("teacher1", "Prof", "X", "prof@example.com", "hash", Role.TEACHER);
        teacher.setId(UUID.randomUUID());
        teacher.setDiscordUserId("discord-prof-1");

        when(discordGateway.getGuildMember("discord-prof-1")).thenReturn(Optional.of(
                new DiscordMemberDto("discord-prof-1", "prof", null, null, List.of(), "2026-09-28")
        ));

        DiscordStatusResponse teacherStatus = discordService.getDiscordStatus(teacher);
        assertEquals("https://discord.com/channels/guild123/stage-web", teacherStatus.stageChannelUrl());

        User admin = new User("admin1", "Admin", "Boss", "admin@example.com", "hash", Role.ADMIN);
        admin.setId(UUID.randomUUID());
        admin.setDiscordUserId("discord-admin-1");

        when(discordGateway.getGuildMember("discord-admin-1")).thenReturn(Optional.of(
                new DiscordMemberDto("discord-admin-1", "admin", null, null, List.of(), "2026-09-28")
        ));

        DiscordStatusResponse adminStatus = discordService.getDiscordStatus(admin);
        assertEquals("https://discord.com/channels/guild123/stage-web", adminStatus.stageChannelUrl());
    }

    @Test
    @DisplayName("Devrait renvoyer une URL de salon Scène nulle si l'apprenant n'a aucune inscription payée")
    void shouldReturnNullStageChannelUrlWhenNoPaidEnrollment() {
        testUser.setDiscordUserId("discord-999");
        when(enrollmentRepository.findByUserId(testUser.getId())).thenReturn(List.of());
        when(discordGateway.getGuildMember("discord-999")).thenReturn(Optional.of(
                new DiscordMemberDto("discord-999", "jean", null, null, List.of(), "2026-09-28")
        ));

        DiscordStatusResponse status = discordService.getDiscordStatus(testUser);

        assertNull(status.stageChannelUrl());
        assertNotNull(status.mangaVoiceChannels());
        assertFalse(status.mangaVoiceChannels().isEmpty());
    }
}
