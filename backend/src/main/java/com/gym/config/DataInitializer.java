package com.gym.config;

import com.gym.entity.*;
import com.gym.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MembershipRepository membershipRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private GymClassRepository gymClassRepository;

    @Autowired
    private TrainingSessionRepository trainingSessionRepository;

    @Autowired
    private ClassRegistrationRepository classRegistrationRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if no users exist
        if (userRepository.count() == 0) {
            // Create Admin User
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@gym.com");
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);

            // Create Trainer User
            User trainer = new User();
            trainer.setUsername("trainer");
            trainer.setPassword(passwordEncoder.encode("trainer123"));
            trainer.setEmail("trainer@gym.com");
            trainer.setFirstName("John");
            trainer.setLastName("Trainer");
            trainer.setRole(User.Role.TRAINER);
            userRepository.save(trainer);

            // Create Staff User
            User staff = new User();
            staff.setUsername("staff");
            staff.setPassword(passwordEncoder.encode("staff123"));
            staff.setEmail("staff@gym.com");
            staff.setFirstName("Jane");
            staff.setLastName("Staff");
            staff.setRole(User.Role.STAFF);
            userRepository.save(staff);

            // Create Member User
            User member = new User();
            member.setUsername("member");
            member.setPassword(passwordEncoder.encode("member123"));
            member.setEmail("member@gym.com");
            member.setFirstName("Bob");
            member.setLastName("Member");
            member.setRole(User.Role.MEMBER);
            userRepository.save(member);

            // Create sample memberships
            createSampleMemberships(member);

            // Create sample equipment
            createSampleEquipment();

            // Create sample gym classes
            createSampleGymClasses(trainer);

            // Create sample training sessions
            createSampleTrainingSessions(trainer, member);

            // Create sample payments
            createSamplePayments(member);

            System.out.println("Sample data created successfully!");
            System.out.println("Admin - username: admin, password: admin123");
            System.out.println("Trainer - username: trainer, password: trainer123");
            System.out.println("Staff - username: staff, password: staff123");
            System.out.println("Member - username: member, password: member123");
        }
    }

    private void createSampleMemberships(User member) {
        // Basic membership
        Membership basicMembership = new Membership(member, Membership.MembershipType.BASIC, 
            new BigDecimal("29.99"), LocalDateTime.now(), LocalDateTime.now().plusMonths(1));
        basicMembership.setDescription("Basic monthly membership");
        membershipRepository.save(basicMembership);

        // Premium membership
        Membership premiumMembership = new Membership(member, Membership.MembershipType.PREMIUM, 
            new BigDecimal("49.99"), LocalDateTime.now().minusMonths(1), LocalDateTime.now().plusMonths(2));
        premiumMembership.setDescription("Premium membership with access to all facilities");
        membershipRepository.save(premiumMembership);
    }

    private void createSampleEquipment() {
        // Cardio equipment
        Equipment treadmill = new Equipment("Treadmill", Equipment.EquipmentType.CARDIO, new BigDecimal("2500.00"));
        treadmill.setDescription("Professional treadmill for cardio workouts");
        treadmill.setLocation("Cardio Area");
        treadmill.setSerialNumber("TREAD-001");
        equipmentRepository.save(treadmill);

        Equipment bike = new Equipment("Stationary Bike", Equipment.EquipmentType.CARDIO, new BigDecimal("1200.00"));
        bike.setDescription("Stationary bike for cycling workouts");
        bike.setLocation("Cardio Area");
        bike.setSerialNumber("BIKE-001");
        equipmentRepository.save(bike);

        // Strength equipment
        Equipment bench = new Equipment("Weight Bench", Equipment.EquipmentType.STRENGTH, new BigDecimal("800.00"));
        bench.setDescription("Adjustable weight bench for strength training");
        bench.setLocation("Strength Area");
        bench.setSerialNumber("BENCH-001");
        equipmentRepository.save(bench);

        Equipment rack = new Equipment("Power Rack", Equipment.EquipmentType.STRENGTH, new BigDecimal("1500.00"));
        rack.setDescription("Power rack for squats and other compound movements");
        rack.setLocation("Strength Area");
        rack.setSerialNumber("RACK-001");
        equipmentRepository.save(rack);
    }

    private void createSampleGymClasses(User trainer) {
        // Yoga class
        GymClass yoga = new GymClass("Morning Yoga", GymClass.ClassType.YOGA, trainer, 
            LocalTime.of(7, 0), LocalTime.of(8, 0), 20);
        yoga.setDescription("Relaxing morning yoga session");
        yoga.setLocation("Studio A");
        yoga.setPrice(new BigDecimal("15.00"));
        yoga.setScheduleDays("MON,WED,FRI");
        gymClassRepository.save(yoga);

        // Spinning class
        GymClass spinning = new GymClass("Spinning", GymClass.ClassType.SPINNING, trainer, 
            LocalTime.of(18, 0), LocalTime.of(19, 0), 15);
        spinning.setDescription("High-intensity spinning workout");
        spinning.setLocation("Cardio Studio");
        spinning.setPrice(new BigDecimal("20.00"));
        spinning.setScheduleDays("TUE,THU");
        gymClassRepository.save(spinning);

        // Strength training class
        GymClass strength = new GymClass("Strength Training", GymClass.ClassType.STRENGTH_TRAINING, trainer, 
            LocalTime.of(19, 0), LocalTime.of(20, 0), 12);
        strength.setDescription("Full-body strength training workout");
        strength.setLocation("Strength Area");
        strength.setPrice(new BigDecimal("25.00"));
        strength.setScheduleDays("MON,WED,FRI");
        gymClassRepository.save(strength);
    }

    private void createSampleTrainingSessions(User trainer, User member) {
        // Personal training session
        TrainingSession personalSession = new TrainingSession(trainer, member, 
            TrainingSession.SessionType.PERSONAL_TRAINING, LocalDateTime.now().plusDays(1), 60);
        personalSession.setPrice(new BigDecimal("50.00"));
        personalSession.setLocation("Training Area");
        personalSession.setNotes("Focus on strength and conditioning");
        trainingSessionRepository.save(personalSession);

        // Assessment session
        TrainingSession assessmentSession = new TrainingSession(trainer, member, 
            TrainingSession.SessionType.ASSESSMENT, LocalDateTime.now().plusDays(3), 45);
        assessmentSession.setPrice(new BigDecimal("30.00"));
        assessmentSession.setLocation("Assessment Room");
        assessmentSession.setNotes("Fitness assessment and goal setting");
        trainingSessionRepository.save(assessmentSession);
    }

    private void createSamplePayments(User member) {
        // Membership payment
        Payment membershipPayment = new Payment(member, Payment.PaymentType.MEMBERSHIP_FEE, 
            Payment.PaymentMethod.CREDIT_CARD, new BigDecimal("29.99"));
        membershipPayment.setDescription("Monthly membership fee");
        membershipPayment.setStatus(Payment.PaymentStatus.COMPLETED);
        paymentRepository.save(membershipPayment);

        // Class payment
        Payment classPayment = new Payment(member, Payment.PaymentType.CLASS_FEE, 
            Payment.PaymentMethod.CASH, new BigDecimal("15.00"));
        classPayment.setDescription("Yoga class payment");
        classPayment.setStatus(Payment.PaymentStatus.COMPLETED);
        paymentRepository.save(classPayment);

        // Training session payment
        Payment trainingPayment = new Payment(member, Payment.PaymentType.TRAINING_SESSION, 
            Payment.PaymentMethod.DEBIT_CARD, new BigDecimal("50.00"));
        trainingPayment.setDescription("Personal training session");
        trainingPayment.setStatus(Payment.PaymentStatus.PENDING);
        paymentRepository.save(trainingPayment);
    }
} 