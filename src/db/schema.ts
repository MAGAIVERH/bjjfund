import {
  pgTable,
  uuid,
  serial,
  text,
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
 * ---------- USERS (tabela principal de autenticação) ----------
 * Guarda todos os usuários do sistema (atletas e doadores).
 */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"), // nulo se OAuth
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  lastLogin: timestamp("last_login", { withTimezone: true }),
});

/**
 * ---------- PROFILES ----------
 * Informações públicas / apresentáveis do usuário.
 * 1:1 com users (userId é PK).
 */
export const profiles = pgTable("profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  phone: text("phone"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/**
 * ---------- ROLES ----------
 * Lista de roles do sistema (athlete, donor, admin).
 */
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

/**
 * ---------- USER_ROLES ----------
 * Associação N:N entre users e roles.
 * PK composta (userId, roleId).
 */
export const userRoles = pgTable(
  "user_roles",
  {
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
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
 * ---------- ATHLETES ----------
 * Perfil específico de atleta. Cada atleta está ligado a um user.
 * (userId é UNIQUE para garantir 1 atleta por user)
 */
export const athletes = pgTable("athletes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  faixa: text("faixa"),
  escola: text("escola"),
  nascimento: date("nascimento"),
  cidade: text("cidade"),
  bio: text("bio"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/**
 * ---------- COMPETITIONS ----------
 * Competição vinculada a atleta.
 */
export const competitions = pgTable("competitions", {
  id: uuid("id").defaultRandom().primaryKey(),
  athleteId: uuid("athlete_id").references(() => athletes.id, {
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
 * Campanhas de arrecadação criadas por atletas.
 * collectedAmount é cache (pode ser mantido por triggers/workers).
 */
export const campaigns = pgTable(
  "campaigns",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    athleteId: uuid("athlete_id").references(() => athletes.id, {
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
 * Itens/ recompensas / rifas / produtos dentro de uma campanha.
 */
export const campaignItems = pgTable("campaign_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  campaignId: uuid("campaign_id").references(() => campaigns.id, {
    onDelete: "cascade",
  }),
  name: text("name"),
  description: text("description"),
  quantity: integer("quantity").default(1),
  price: numeric("price", { precision: 12, scale: 2 }).default("0"),
  type: text("type").default("donation"), // donation | raffle | product
});

/**
 * ---------- DONATIONS ----------
 * Cada doação é **para um único atleta** (pode também apontar para campanha).
 * status: pending | succeeded | failed | refunded
 */
export const donations = pgTable(
  "donations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    donorUserId: uuid("donor_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    campaignId: uuid("campaign_id").references(() => campaigns.id, {
      onDelete: "set null",
    }),
    athleteId: uuid("athlete_id").references(() => athletes.id, {
      onDelete: "set null",
    }),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("BRL"),
    status: text("status").default("pending").notNull(),
    paymentProvider: text("payment_provider"), // stripe | pix | ...
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
 * Registro financeiro detalhado por provedor (fees, net).
 */
export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  donationId: uuid("donation_id").references(() => donations.id, {
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
 * ---------- ATHLETE_DONORS (pivot M:N) ----------
 * Relação explícita atleta <-> doador, para consultas/agg rápidas.
 * PK composta (athleteId, donorUserId).
 * É atualizada quando uma doação (succeeded) ocorre:
 *  - se não existir, cria com firstDonationId
 *  - atualiza totalAmount, donationsCount, lastDonatedAt
 */
export const athleteDonors = pgTable(
  "athlete_donors",
  {
    athleteId: uuid("athlete_id").references(() => athletes.id, {
      onDelete: "cascade",
    }),
    donorUserId: uuid("donor_user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    firstDonationId: uuid("first_donation_id").references(() => donations.id, {
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
 * Imagens / vídeos de campanhas e avatares (armazenar URL).
 */
export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerUserId: uuid("owner_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  campaignId: uuid("campaign_id").references(() => campaigns.id, {
    onDelete: "cascade",
  }),
  url: text("url").notNull(),
  type: text("type"), // image, video
  alt: text("alt"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/**
 * ---------- METRICS (global) ----------
 * Mantém 1 registro global para dashboard rápido.
 */
export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(), // manter 1 registro (id = 1)
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
 * Métricas por atleta (uma linha por atleta).
 */
export const athleteMetrics = pgTable("athlete_metrics", {
  athleteId: uuid("athlete_id")
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
 * Métricas por campanha (uma linha por campanha).
 */
export const campaignMetrics = pgTable("campaign_metrics", {
  campaignId: uuid("campaign_id")
    .primaryKey()
    .references(() => campaigns.id, { onDelete: "cascade" }),
  totalCollectedCents: integer("total_collected_cents").default(0).notNull(),
  supportersCount: integer("supporters_count").default(0).notNull(),
  donationsCount: integer("donations_count").default(0).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
