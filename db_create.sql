-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2025-01-19 18:15:33.663

-- tables
-- Table: Clinics
CREATE TABLE Clinics (
    id char(36)  NOT NULL,
    name text  NOT NULL,
    address text  NOT NULL,
    CONSTRAINT Clinics_pk PRIMARY KEY (id)
);

-- Table: Consultations
CREATE TABLE Consultations (
    id char(36)  NOT NULL,
    date timestamp  NOT NULL,
    diagnosis text  NOT NULL,
    patients_history text  NOT NULL,
    examination_result text  NOT NULL,
    notes int  NOT NULL,
    Patients_id char(36)  NOT NULL,
    Doctors_id char(36)  NOT NULL,
    CONSTRAINT Consultations_pk PRIMARY KEY (id)
);

-- Table: Doctors
CREATE TABLE Doctors (
    id char(36)  NOT NULL,
    speciality text  NOT NULL,
    NPWZ bigint  NOT NULL,
    Clinics_id char(36)  NOT NULL,
    Users_id char(36)  NOT NULL,
    CONSTRAINT Doctors_pk PRIMARY KEY (id)
);

-- Table: Drugs
CREATE TABLE Drugs (
    id char(36)  NOT NULL,
    name text  NOT NULL,
    active_ingredient text  NOT NULL,
    amount_of_substance int  NOT NULL,
    unit_of_quantity text  NOT NULL,
    CONSTRAINT Drugs_pk PRIMARY KEY (id)
);

-- Table: MedicalHistory
CREATE TABLE MedicalHistory (
    id char(36)  NOT NULL,
    Patients_id char(36)  NOT NULL,
    Consultations_id char(36)  NOT NULL,
    Referrals_id char(36)  NOT NULL,
    Tests_id char(36)  NOT NULL,
    Prescriptions_id char(36)  NOT NULL,
    CONSTRAINT MedicalHistory_pk PRIMARY KEY (id)
);

-- Table: Patients
CREATE TABLE Patients (
    id char(36)  NOT NULL,
    address bigint  NULL,
    Clinics_id char(36)  NOT NULL,
    Users_id char(36)  NOT NULL,
    CONSTRAINT Patients_pk PRIMARY KEY (id)
);

-- Table: Prescriptions
CREATE TABLE Prescriptions (
    id char(36)  NOT NULL,
    date_of_issue timestamp  NOT NULL,
    expiration_date timestamp  NOT NULL,
    was_realized boolean  NOT NULL,
    Drugs_id char(36)  NOT NULL,
    Patients_id char(36)  NOT NULL,
    Doctors_id char(36)  NOT NULL,
    CONSTRAINT Prescriptions_pk PRIMARY KEY (id)
);

-- Table: Referrals
CREATE TABLE Referrals (
    id char(36)  NOT NULL,
    reason text  NOT NULL,
    note text  NOT NULL,
    Doctors_from_id char(36)  NOT NULL,
    Doctors_to_id char(36)  NOT NULL,
    Patients_id char(36)  NOT NULL,
    CONSTRAINT Referrals_pk PRIMARY KEY (id)
);

-- Table: Tests
CREATE TABLE Tests (
    id char(36)  NOT NULL,
    test_type text  NOT NULL,
    reason text  NOT NULL,
    result text  NULL,
    Patients_id char(36)  NOT NULL,
    Doctors_id char(36)  NOT NULL,
    CONSTRAINT Tests_pk PRIMARY KEY (id)
);

-- Table: Users
CREATE TABLE Users (
    id char(36)  NOT NULL,
    name text  NOT NULL,
    surname text  NOT NULL,
    email text  NOT NULL,
    password text  NOT NULL,
    PESEL bigint  NULL,
    phone_number bigint  NULL,
    CONSTRAINT Users_pk PRIMARY KEY (id)
);

-- Table: VisitDates
CREATE TABLE VisitDates (
    id char(36)  NOT NULL,
    consultation_type text  NOT NULL,
    date timestamp  NOT NULL,
    Patients_id char(36)  NULL,
    Doctors_id char(36)  NOT NULL,
    Clinics_id char(36)  NOT NULL,
    CONSTRAINT VisitDates_pk PRIMARY KEY (id)
);

-- foreign keys
-- Reference: Consultations_Doctors (table: Consultations)
ALTER TABLE Consultations ADD CONSTRAINT Consultations_Doctors FOREIGN KEY Consultations_Doctors (Doctors_id)
    REFERENCES Doctors (id);

-- Reference: Consultations_Patients (table: Consultations)
ALTER TABLE Consultations ADD CONSTRAINT Consultations_Patients FOREIGN KEY Consultations_Patients (Patients_id)
    REFERENCES Patients (id);

-- Reference: Doctors_Clinics (table: Doctors)
ALTER TABLE Doctors ADD CONSTRAINT Doctors_Clinics FOREIGN KEY Doctors_Clinics (Clinics_id)
    REFERENCES Clinics (id);

-- Reference: Doctors_Users (table: Doctors)
ALTER TABLE Doctors ADD CONSTRAINT Doctors_Users FOREIGN KEY Doctors_Users (Users_id)
    REFERENCES Users (id);

-- Reference: MedicalHistory_Consultations (table: MedicalHistory)
ALTER TABLE MedicalHistory ADD CONSTRAINT MedicalHistory_Consultations FOREIGN KEY MedicalHistory_Consultations (Consultations_id)
    REFERENCES Consultations (id);

-- Reference: MedicalHistory_Patients (table: MedicalHistory)
ALTER TABLE MedicalHistory ADD CONSTRAINT MedicalHistory_Patients FOREIGN KEY MedicalHistory_Patients (Patients_id)
    REFERENCES Patients (id);

-- Reference: MedicalHistory_Prescriptions (table: MedicalHistory)
ALTER TABLE MedicalHistory ADD CONSTRAINT MedicalHistory_Prescriptions FOREIGN KEY MedicalHistory_Prescriptions (Prescriptions_id)
    REFERENCES Prescriptions (id);

-- Reference: MedicalHistory_Referrals (table: MedicalHistory)
ALTER TABLE MedicalHistory ADD CONSTRAINT MedicalHistory_Referrals FOREIGN KEY MedicalHistory_Referrals (Referrals_id)
    REFERENCES Referrals (id);

-- Reference: MedicalHistory_Tests (table: MedicalHistory)
ALTER TABLE MedicalHistory ADD CONSTRAINT MedicalHistory_Tests FOREIGN KEY MedicalHistory_Tests (Tests_id)
    REFERENCES Tests (id);

-- Reference: Patients_Clinics (table: Patients)
ALTER TABLE Patients ADD CONSTRAINT Patients_Clinics FOREIGN KEY Patients_Clinics (Clinics_id)
    REFERENCES Clinics (id);

-- Reference: Patients_Users (table: Patients)
ALTER TABLE Patients ADD CONSTRAINT Patients_Users FOREIGN KEY Patients_Users (Users_id)
    REFERENCES Users (id);

-- Reference: Prescriptions_Doctors (table: Prescriptions)
ALTER TABLE Prescriptions ADD CONSTRAINT Prescriptions_Doctors FOREIGN KEY Prescriptions_Doctors (Doctors_id)
    REFERENCES Doctors (id);

-- Reference: Prescriptions_Drugs (table: Prescriptions)
ALTER TABLE Prescriptions ADD CONSTRAINT Prescriptions_Drugs FOREIGN KEY Prescriptions_Drugs (Drugs_id)
    REFERENCES Drugs (id);

-- Reference: Prescriptions_Patients (table: Prescriptions)
ALTER TABLE Prescriptions ADD CONSTRAINT Prescriptions_Patients FOREIGN KEY Prescriptions_Patients (Patients_id)
    REFERENCES Patients (id);

-- Reference: Referrals_Doctors_from (table: Referrals)
ALTER TABLE Referrals ADD CONSTRAINT Referrals_Doctors_from FOREIGN KEY Referrals_Doctors_from (Doctors_from_id)
    REFERENCES Doctors (id);

-- Reference: Referrals_Doctors_to (table: Referrals)
ALTER TABLE Referrals ADD CONSTRAINT Referrals_Doctors_to FOREIGN KEY Referrals_Doctors_to (Doctors_to_id)
    REFERENCES Doctors (id);

-- Reference: Referrals_Patients (table: Referrals)
ALTER TABLE Referrals ADD CONSTRAINT Referrals_Patients FOREIGN KEY Referrals_Patients (Patients_id)
    REFERENCES Patients (id);

-- Reference: Tests_Doctors (table: Tests)
ALTER TABLE Tests ADD CONSTRAINT Tests_Doctors FOREIGN KEY Tests_Doctors (Doctors_id)
    REFERENCES Doctors (id);

-- Reference: Tests_Patients (table: Tests)
ALTER TABLE Tests ADD CONSTRAINT Tests_Patients FOREIGN KEY Tests_Patients (Patients_id)
    REFERENCES Patients (id);

-- Reference: VisitDates_Clinics (table: VisitDates)
ALTER TABLE VisitDates ADD CONSTRAINT VisitDates_Clinics FOREIGN KEY VisitDates_Clinics (Clinics_id)
    REFERENCES Clinics (id);

-- Reference: VisitDates_Doctors (table: VisitDates)
ALTER TABLE VisitDates ADD CONSTRAINT VisitDates_Doctors FOREIGN KEY VisitDates_Doctors (Doctors_id)
    REFERENCES Doctors (id);

-- Reference: VisitDates_Patients (table: VisitDates)
ALTER TABLE VisitDates ADD CONSTRAINT VisitDates_Patients FOREIGN KEY VisitDates_Patients (Patients_id)
    REFERENCES Patients (id);

-- End of file.

