package com.codebangers.backend.discord.service;

import com.codebangers.backend.course.model.Enrollment;
import com.codebangers.backend.course.model.Enrollment.PaymentStatus;
import com.codebangers.backend.course.model.EnrollmentTier;
import com.codebangers.backend.course.repository.EnrollmentRepository;
import com.codebangers.backend.discord.dto.DiscordMemberDto;
import com.codebangers.backend.discord.dto.DiscordStatusResponse;
import com.codebangers.backend.user.model.Role;
import com.codebangers.backend.user.model.User;
import com.codebangers.backend.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Service métier de gestion de l'intégration Discord & liaison des comptes apprenants (Sprint 11).
 */
@Service
@Transactional
public class DiscordService {

    private static final Logger log = LoggerFactory.getLogger(DiscordService.class);

    private final DiscordGateway discordGateway;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public DiscordService(
            DiscordGateway discordGateway,
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository) {
        this.discordGateway = discordGateway;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    /**
     * Retourne le statut de connexion Discord actuel d'un utilisateur.
     */
    @Transactional(readOnly = true)
    public DiscordStatusResponse getDiscordStatus(User user) {
        if (user == null || !user.isDiscordLinked()) {
            return new DiscordStatusResponse(
                    false,
                    null,
                    null,
                    null,
                    null,
                    false,
                    List.of(),
                    discordGateway.getInviteUrl()
            );
        }

        Optional<DiscordMemberDto> memberOpt = discordGateway.getGuildMember(user.getDiscordUserId());
        boolean serverJoined = memberOpt.isPresent();

        List<String> assignedRoleNames = resolveRoleNamesForUser(user);

        return new DiscordStatusResponse(
                true,
                user.getDiscordUserId(),
                user.getDiscordUsername(),
                user.getDiscordAvatar(),
                user.getDiscordLinkedAt(),
                serverJoined,
                assignedRoleNames,
                discordGateway.getInviteUrl()
        );
    }

    /**
     * Associe un compte Discord à un utilisateur existant NoSeumCode.
     */
    public User linkDiscordAccount(User user, String discordUserId, String discordUsername, String discordAvatar, String userAccessToken) {
        if (user == null) {
            throw new IllegalArgumentException("L'utilisateur NoSeumCode ne peut pas être null.");
        }
        if (discordUserId == null || discordUserId.isBlank()) {
            throw new IllegalArgumentException("L'identifiant utilisateur Discord ne peut pas être vide.");
        }

        // Vérifier si un AUTRE utilisateur est déjà lié à ce compte Discord (OWASP ASVS / Anti-collision)
        Optional<User> existingUserWithDiscord = userRepository.findByDiscordUserId(discordUserId);
        if (existingUserWithDiscord.isPresent() && !existingUserWithDiscord.get().getId().equals(user.getId())) {
            throw new IllegalStateException("Ce compte Discord est déjà associé à un autre compte NoSeumCode (" + existingUserWithDiscord.get().getEmail() + ").");
        }

        user.setDiscordUserId(discordUserId);
        user.setDiscordUsername(discordUsername != null ? discordUsername : "DiscordUser");
        if (discordAvatar != null && !discordAvatar.isBlank()) {
            user.setDiscordAvatar(discordAvatar);
        }
        user.setDiscordLinkedAt(LocalDateTime.now());
        User savedUser = userRepository.save(user);

        log.info("🔗 Compte Discord @{} (ID: {}) associé avec succès à l'utilisateur NoSeumCode {}",
                user.getDiscordUsername(), discordUserId, user.getEmail());

        // Automatisation serveur : ajout au serveur Discord et attribution des rôles
        List<String> targetRoleIds = resolveTargetRoleIds(user);
        if (userAccessToken != null && !userAccessToken.isBlank()) {
            discordGateway.addMemberToGuild(discordUserId, userAccessToken, targetRoleIds);
        } else {
            for (String roleId : targetRoleIds) {
                discordGateway.addRoleToMember(discordUserId, roleId);
            }
        }

        return savedUser;
    }

    /**
     * Dissocie le compte Discord d'un utilisateur.
     */
    public User unlinkDiscordAccount(User user) {
        if (user == null) {
            throw new IllegalArgumentException("L'utilisateur ne peut pas être null.");
        }

        String oldDiscordId = user.getDiscordUserId();
        String oldDiscordUsername = user.getDiscordUsername();

        user.setDiscordUserId(null);
        user.setDiscordUsername(null);
        user.setDiscordAvatar(null);
        user.setDiscordLinkedAt(null);
        User savedUser = userRepository.save(user);

        log.info("🔓 Compte Discord @{} (ID: {}) dissocié de l'utilisateur NoSeumCode {}",
                oldDiscordUsername, oldDiscordId, user.getEmail());

        return savedUser;
    }

    /**
     * Synchronise manuellement les rôles Discord de l'apprenant en fonction de ses inscriptions actives.
     */
    public DiscordStatusResponse syncUserRoles(User user) {
        if (user == null || !user.isDiscordLinked()) {
            return getDiscordStatus(user);
        }

        List<String> targetRoleIds = resolveTargetRoleIds(user);
        String discordUserId = user.getDiscordUserId();

        List<String> manageableTierRoleIds = new ArrayList<>();
        addRoleIfNotEmpty(manageableTierRoleIds, discordGateway.getVipRoleId());
        addRoleIfNotEmpty(manageableTierRoleIds, discordGateway.getWebRoleId());
        addRoleIfNotEmpty(manageableTierRoleIds, discordGateway.getStarterRoleId());

        for (String roleId : targetRoleIds) {
            discordGateway.addRoleToMember(discordUserId, roleId);
        }

        for (String roleId : manageableTierRoleIds) {
            if (!targetRoleIds.contains(roleId)) {
                discordGateway.removeRoleFromMember(discordUserId, roleId);
            }
        }

        log.info("🔄 Rôles Discord synchronisés pour {} (Discord ID: {})", user.getEmail(), discordUserId);
        return getDiscordStatus(user);
    }

    /**
     * Détermine les rôles Discord à attribuer selon les inscriptions payantes de l'utilisateur.
     */
    public List<String> resolveTargetRoleIds(User user) {
        List<String> roleIds = new ArrayList<>();
        if (user == null) return roleIds;

        List<Enrollment> enrollments = enrollmentRepository.findByUserId(user.getId());
        EnrollmentTier highestTier = enrollments.stream()
                .filter(e -> e.getPaymentStatus() == PaymentStatus.PAID)
                .map(Enrollment::getTier)
                .filter(Objects::nonNull)
                .max(Comparator.comparingInt(EnrollmentTier::getLevel))
                .orElse(null);

        if (highestTier != null) {
            switch (highestTier) {
                case VIP -> {
                    addRoleIfNotEmpty(roleIds, discordGateway.getVipRoleId());
                    addRoleIfNotEmpty(roleIds, discordGateway.getWebRoleId());
                    addRoleIfNotEmpty(roleIds, discordGateway.getStarterRoleId());
                }
                case WEB -> {
                    addRoleIfNotEmpty(roleIds, discordGateway.getWebRoleId());
                    addRoleIfNotEmpty(roleIds, discordGateway.getStarterRoleId());
                }
                case STARTER -> {
                    addRoleIfNotEmpty(roleIds, discordGateway.getStarterRoleId());
                }
            }
        }

        // Rôle de membre par défaut si configuré
        addRoleIfNotEmpty(roleIds, discordGateway.getDefaultRoleId());

        return roleIds;
    }

    /**
     * Traduit les rôles Discord assignés en labels lisibles pour l'interface apprenant.
     */
    public List<String> resolveRoleNamesForUser(User user) {
        List<String> names = new ArrayList<>();
        if (user == null) return names;

        if (user.getRole() == Role.ADMIN) {
            names.add("Administrateur");
        } else if (user.getRole() == Role.TEACHER) {
            names.add("Formateur");
        }

        List<Enrollment> enrollments = enrollmentRepository.findByUserId(user.getId());
        EnrollmentTier highestTier = enrollments.stream()
                .filter(e -> e.getPaymentStatus() == PaymentStatus.PAID)
                .map(Enrollment::getTier)
                .filter(Objects::nonNull)
                .max(Comparator.comparingInt(EnrollmentTier::getLevel))
                .orElse(null);

        if (highestTier != null) {
            switch (highestTier) {
                case VIP -> names.add("Mentorat VIP");
                case WEB -> names.add("Pack Web");
                case STARTER -> names.add("Starter");
            }
        }

        if (names.isEmpty()) {
            names.add("Membre Communauté");
        }

        return names;
    }

    private void addRoleIfNotEmpty(List<String> list, String roleId) {
        if (roleId != null && !roleId.isBlank() && !list.contains(roleId)) {
            list.add(roleId);
        }
    }
}
