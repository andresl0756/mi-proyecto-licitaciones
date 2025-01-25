/*
  # Initial Database Schema Setup

  1. Tables
    - users: Store user information and preferences
    - tenders: Store tender information
    - tender_awards: Store tender award information
    - proposals: Store proposal information
    - notifications: Store user notifications
    - reports: Store generated reports
    - audit_logs: Store system audit logs

  2. Security
    - Enable RLS on all tables
    - Add policies for data access based on user roles
    - Implement secure data access patterns
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'analyst', 'operator', 'supervisor', 'guest');
CREATE TYPE tender_status AS ENUM ('draft', 'published', 'closed', 'awarded', 'cancelled');
CREATE TYPE tender_type AS ENUM ('public', 'private');
CREATE TYPE currency AS ENUM ('CLP', 'USD', 'EUR');
CREATE TYPE proposal_status AS ENUM ('draft', 'pending_review', 'approved', 'submitted', 'rejected');
CREATE TYPE notification_type AS ENUM ('tender_new', 'tender_update', 'proposal_review', 'tender_award', 'system');
CREATE TYPE report_type AS ENUM ('tender_analysis', 'performance', 'market_insights');
CREATE TYPE report_format AS ENUM ('pdf', 'excel');

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id uuid REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  company_rut text NOT NULL,
  company_address text,
  position text,
  role user_role NOT NULL DEFAULT 'guest',
  notification_preferences jsonb NOT NULL DEFAULT '{"email": true, "whatsapp": false, "sms": false, "push": false}',
  preferences jsonb NOT NULL DEFAULT '{"categories": [], "locations": [], "budgetRange": {"min": 0, "max": 0}}',
  created_at timestamptz NOT NULL DEFAULT now(),
  last_active timestamptz NOT NULL DEFAULT now()
);

-- Create tenders table
CREATE TABLE tenders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code text UNIQUE NOT NULL,
  title text NOT NULL,
  status tender_status NOT NULL DEFAULT 'draft',
  type tender_type NOT NULL,
  description text,
  buyer jsonb NOT NULL,
  estimated_amount numeric(15,2),
  currency currency NOT NULL,
  published_at timestamptz,
  closing_at timestamptz NOT NULL,
  delivery_deadline timestamptz,
  categories text[] NOT NULL DEFAULT '{}',
  requirements text[] NOT NULL DEFAULT '{}',
  attachments jsonb[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create tender_awards table
CREATE TABLE tender_awards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tender_id uuid REFERENCES tenders(id) ON DELETE CASCADE,
  supplier_rut text NOT NULL,
  supplier_name text NOT NULL,
  awarded_amount numeric(15,2) NOT NULL,
  currency currency NOT NULL,
  awarded_at timestamptz NOT NULL,
  reason text,
  documents jsonb[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create proposals table
CREATE TABLE proposals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tender_id uuid REFERENCES tenders(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  status proposal_status NOT NULL DEFAULT 'draft',
  technical_details jsonb NOT NULL,
  commercial_details jsonb NOT NULL,
  documents jsonb[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  reviewed_by uuid REFERENCES users(id),
  reviewed_at timestamptz,
  comments text
);

-- Create notifications table
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  read_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'
);

-- Create reports table
CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type report_type NOT NULL,
  title text NOT NULL,
  parameters jsonb NOT NULL,
  results jsonb NOT NULL,
  format report_format NOT NULL,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  ip_address inet NOT NULL
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tender_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users policies
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Admins can view all users"
  ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Tenders policies
CREATE POLICY "Anyone can view published tenders"
  ON tenders
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can manage all tenders"
  ON tenders
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Proposals policies
CREATE POLICY "Users can view their own proposals"
  ON proposals
  FOR SELECT
  USING (user_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Supervisors can review proposals"
  ON proposals
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()
      AND role IN ('supervisor', 'admin')
    )
  );

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  USING (user_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

-- Reports policies
CREATE POLICY "Users can view their own reports"
  ON reports
  FOR SELECT
  USING (user_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Analysts can view all reports"
  ON reports
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()
      AND role IN ('analyst', 'admin')
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_tenders_status ON tenders(status);
CREATE INDEX idx_tenders_closing_at ON tenders(closing_at);
CREATE INDEX idx_proposals_tender_id ON proposals(tender_id);
CREATE INDEX idx_proposals_user_id ON proposals(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);