// User related types
export type UserRole = 'admin' | 'analyst' | 'operator' | 'supervisor' | 'guest';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  companyRut: string;
  companyAddress: string;
  position: string;
  role: UserRole;
  notificationPreferences: {
    email: boolean;
    whatsapp: boolean;
    sms: boolean;
    push: boolean;
  };
  createdAt: Date;
  lastActive: Date;
  preferences: {
    categories: string[];
    locations: string[];
    budgetRange: {
      min: number;
      max: number;
    };
  };
}

// Tender related types
export type TenderStatus = 'draft' | 'published' | 'closed' | 'awarded' | 'cancelled';
export type TenderType = 'public' | 'private';
export type Currency = 'CLP' | 'USD' | 'EUR';

export interface Tender {
  id: string;
  code: string;
  title: string;
  status: TenderStatus;
  type: TenderType;
  description: string;
  buyer: {
    name: string;
    code: string;
    address: string;
  };
  estimatedAmount: number;
  currency: Currency;
  publishedAt: Date;
  closingAt: Date;
  deliveryDeadline: Date;
  categories: string[];
  requirements: string[];
  attachments: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
}

export interface TenderAward {
  id: string;
  tenderId: string;
  supplierRut: string;
  supplierName: string;
  awardedAmount: number;
  currency: Currency;
  awardedAt: Date;
  reason: string;
  documents: {
    id: string;
    type: string;
    url: string;
  }[];
}

export interface Proposal {
  id: string;
  tenderId: string;
  userId: string;
  status: 'draft' | 'pending_review' | 'approved' | 'submitted' | 'rejected';
  technicalDetails: {
    description: string;
    methodology: string;
    timeline: string;
    team: string;
  };
  commercialDetails: {
    amount: number;
    currency: Currency;
    paymentTerms: string;
    validity: string;
  };
  documents: {
    id: string;
    type: string;
    url: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  comments: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'tender_new' | 'tender_update' | 'proposal_review' | 'tender_award' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  readAt?: Date;
  metadata: Record<string, any>;
}

export interface Report {
  id: string;
  userId: string;
  type: 'tender_analysis' | 'performance' | 'market_insights';
  title: string;
  parameters: Record<string, any>;
  results: Record<string, any>;
  format: 'pdf' | 'excel';
  createdAt: Date;
  url: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: 'tender' | 'proposal' | 'user' | 'report';
  entityId: string;
  metadata: Record<string, any>;
  createdAt: Date;
  ipAddress: string;
}