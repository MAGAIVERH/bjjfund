import {
  pgTable,
  text,
  serial,
  varchar,
  numeric,
  boolean,
  timestamp,
  date,
  jsonb,
  integer,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";

/**
 * ---------- BETTER AUTH USER ----------
 */
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  role: text("role").default("supporter").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

/**
 * ---------- SESSIONS (Better Auth) ----------
 */
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

/**
 * ---------- ACCOUNTS (Better Auth) ----------
 */
export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  password: text("password"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

/**
 * ---------- VERIFICATIONS (Better Auth) ----------
 */
export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

/**
 * ---------- ROLES ----------
 */
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

/**
 * ---------- USER_ROLES ----------
 */
export const userRoles = pgTable(
  "user_roles",
  {
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    roleId: serial("role_id").references(() => roles.id, {
      onDelete: "cascade",
    }),
    primary: boolean("primary").default(false),
    assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.roleId] }),
  }),
);

/**
 * ---------- PROFILES ----------
 */
export const profiles = pgTable("profiles", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  phone: text("phone"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/**
 * ---------- ATHLETES ----------
 */
export const athletes = pgTable("athletes", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  faixa: text("faixa"),
  escola: text("escola"),
  nascimento: date("nascimento"),
  cidade: text("cidade"),
  evento: text("evento"), // <-- adiciona aqui
  image: varchar("image", { length: 255 }), // opcional no TS
  bio: text("bio"),
  ouro: text("ouro").default("0"),
  prata: text("prata").default("0"),
  bronze: text("bronze").default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/**
 * ---------- COMPETITIONS ----------
 */
export const competitions = pgTable("competitions", {
  id: text("id").primaryKey(),
  athleteId: text("athlete_id").references(() => athletes.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  location: text("location"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  result: text("result"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/**
 * ---------- CAMPAIGNS ----------
 */
export const campaigns = pgTable(
  "campaigns",
  {
    id: text("id").primaryKey(),
    athleteId: text("athlete_id").references(() => athletes.id, {
      onDelete: "cascade",
    }),
    title: text("title").notNull(),
    description: text("description"),
    goalAmount: numeric("goal_amount", { precision: 12, scale: 2 }).default(
      "0",
    ),
    collectedAmount: numeric("collected_amount", {
      precision: 12,
      scale: 2,
    }).default("0"),
    startDate: timestamp("start_date", { withTimezone: true }),
    endDate: timestamp("end_date", { withTimezone: true }),
    status: text("status").default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    idxAthlete: index("idx_campaigns_athlete").on(t.athleteId),
  }),
);

/**
 * ---------- CAMPAIGN_ITEMS ----------
 */
export const campaignItems = pgTable("campaign_items", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id").references(() => campaigns.id, {
    onDelete: "cascade",
  }),
  name: text("name"),
  description: text("description"),
  quantity: integer("quantity").default(1),
  price: numeric("price", { precision: 12, scale: 2 }).default("0"),
  type: text("type").default("donation"),
});

/**
 * ---------- DONATIONS ----------
 */
export const donations = pgTable(
  "donations",
  {
    id: text("id").primaryKey(),
    donorUserId: text("donor_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    campaignId: text("campaign_id").references(() => campaigns.id, {
      onDelete: "set null",
    }),
    athleteId: text("athlete_id").references(() => athletes.id, {
      onDelete: "set null",
    }),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("BRL"),
    status: text("status").default("pending").notNull(),
    paymentProvider: text("payment_provider"),
    paymentProviderId: text("payment_provider_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    metadata: jsonb("metadata"),
  },
  (t) => ({
    idxCampaign: index("idx_donations_campaign").on(t.campaignId),
    idxStatus: index("idx_donations_status").on(t.status),
  }),
);

/**
 * ---------- TRANSACTIONS ----------
 */
export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  donationId: text("donation_id").references(() => donations.id, {
    onDelete: "set null",
  }),
  provider: text("provider"),
  providerTxId: text("provider_tx_id"),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  fee: numeric("fee", { precision: 12, scale: 2 }).default("0"),
  netAmount: numeric("net_amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/**
 * ---------- ATHLETE_DONORS ----------
 */
export const athleteDonors = pgTable(
  "athlete_donors",
  {
    athleteId: text("athlete_id").references(() => athletes.id, {
      onDelete: "cascade",
    }),
    donorUserId: text("donor_user_id").references(() => user.id, {
      onDelete: "cascade",
    }),
    firstDonationId: text("first_donation_id").references(() => donations.id, {
      onDelete: "set null",
    }),
    totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).default(
      "0",
    ),
    donationsCount: integer("donations_count").default(0),
    lastDonatedAt: timestamp("last_donated_at", { withTimezone: true }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.athleteId, t.donorUserId] }),
    idxAthlete: index("idx_athlete_donors_athlete").on(t.athleteId),
    idxDonor: index("idx_athlete_donors_donor").on(t.donorUserId),
  }),
);

/**
 * ---------- MEDIA ----------
 */
export const media = pgTable("media", {
  id: text("id").primaryKey(),
  ownerUserId: text("owner_user_id").references(() => user.id, {
    onDelete: "set null",
  }),
  campaignId: text("campaign_id").references(() => campaigns.id, {
    onDelete: "cascade",
  }),
  url: text("url").notNull(),
  type: text("type"),
  alt: text("alt"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/**
 * ---------- METRICS ----------
 */
export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  totalCollectedCents: integer("total_collected_cents").default(0).notNull(),
  totalAthletesSupported: integer("total_athletes_supported")
    .default(0)
    .notNull(),
  totalActiveSupporters: integer("total_active_supporters")
    .default(0)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

/**
 * ---------- ATHLETE_METRICS ----------
 */
export const athleteMetrics = pgTable("athlete_metrics", {
  athleteId: text("athlete_id")
    .primaryKey()
    .references(() => athletes.id, { onDelete: "cascade" }),
  totalCollectedCents: integer("total_collected_cents").default(0).notNull(),
  supportersCount: integer("supporters_count").default(0).notNull(),
  donationsCount: integer("donations_count").default(0).notNull(),
  lastDonatedAt: timestamp("last_donated_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

/**
 * ---------- CAMPAIGN_METRICS ----------
 */
export const campaignMetrics = pgTable("campaign_metrics", {
  campaignId: text("campaign_id")
    .primaryKey()
    .references(() => campaigns.id, { onDelete: "cascade" }),
  totalCollectedCents: integer("total_collected_cents").default(0).notNull(),
  supportersCount: integer("supporters_count").default(0).notNull(),
  donationsCount: integer("donations_count").default(0).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
