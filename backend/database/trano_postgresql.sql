
-- =====================================================================
-- Trano PERN — Schéma PostgreSQL UUID v4
-- PostgreSQL 13+
-- =====================================================================

BEGIN;

-- ---------- users ----------
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(120) NOT NULL,
    email           VARCHAR(190) NOT NULL,
    password        VARCHAR(255) NOT NULL,
    phone           VARCHAR(30),
    role            VARCHAR(255) NOT NULL,
    suspended_at    TIMESTAMP(0),
    remember_token  VARCHAR(100),
    created_at      TIMESTAMP(0),
    updated_at      TIMESTAMP(0),
    avatar_path     VARCHAR(255),
    city            VARCHAR(100),
    bio             TEXT
);
CREATE UNIQUE INDEX users_email_unique ON users (email);

-- ---------- personal_access_tokens ----------
CREATE TABLE personal_access_tokens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tokenable_type  VARCHAR(255) NOT NULL,
    tokenable_id    UUID NOT NULL,
    name            TEXT NOT NULL,
    token           VARCHAR(64) NOT NULL,
    abilities       TEXT,
    last_used_at    TIMESTAMP(0),
    expires_at      TIMESTAMP(0),
    created_at      TIMESTAMP(0),
    updated_at      TIMESTAMP(0)
);
CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index
    ON personal_access_tokens (tokenable_type, tokenable_id);
CREATE UNIQUE INDEX personal_access_tokens_token_unique ON personal_access_tokens (token);
CREATE INDEX personal_access_tokens_expires_at_index ON personal_access_tokens (expires_at);

-- ---------- password_reset_tokens ----------
CREATE TABLE password_reset_tokens (
    email       VARCHAR(255) PRIMARY KEY,
    token       VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP(0)
);

-- ---------- property_types ----------
CREATE TABLE property_types (
    id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label  VARCHAR(255) NOT NULL
);
CREATE UNIQUE INDEX property_types_label_unique ON property_types (label);

-- ---------- properties ----------
CREATE TABLE properties (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id      UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    type_id       UUID NOT NULL REFERENCES property_types (id),
    title         VARCHAR(160) NOT NULL,
    description   TEXT,
    price         INTEGER NOT NULL DEFAULT 0,
    currency      VARCHAR(3) NOT NULL DEFAULT 'MGA',
    surface       SMALLINT,
    rooms         SMALLINT,
    city          VARCHAR(100) NOT NULL DEFAULT '',
    address       VARCHAR(255),
    lat           NUMERIC(10,7),
    lng           NUMERIC(10,7),
    status        VARCHAR(255) NOT NULL DEFAULT 'brouillon',
    published_at  TIMESTAMP(0),
    deleted_at    TIMESTAMP(0),
    created_at    TIMESTAMP(0),
    updated_at    TIMESTAMP(0)
);
CREATE INDEX properties_status_city_price_index ON properties (status, city, price);
CREATE INDEX properties_owner_id_status_index ON properties (owner_id, status);
CREATE INDEX properties_published_at_index ON properties (published_at);

-- ---------- property_images ----------
CREATE TABLE property_images (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id  UUID NOT NULL REFERENCES properties (id) ON DELETE CASCADE,
    path         VARCHAR(255) NOT NULL,
    position     SMALLINT NOT NULL DEFAULT 0
);

-- ---------- favorites ----------
CREATE TABLE favorites (
    user_id      UUID NOT NULL REFERENCES users (id),
    property_id  UUID NOT NULL REFERENCES properties (id),
    created_at   TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, property_id)
);

-- ---------- inquiries ----------
CREATE TABLE inquiries (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id    UUID NOT NULL REFERENCES properties (id),
    user_id        UUID NOT NULL REFERENCES users (id),
    message        TEXT NOT NULL,
    contact_phone  VARCHAR(30),
    status         VARCHAR(255) NOT NULL DEFAULT 'en_attente',
    created_at     TIMESTAMP(0),
    updated_at     TIMESTAMP(0)
);
CREATE INDEX inquiries_property_id_status_index ON inquiries (property_id, status);
CREATE INDEX inquiries_user_id_property_id_index ON inquiries (user_id, property_id);
CREATE UNIQUE INDEX inquiries_active_unique
    ON inquiries (user_id, property_id)
    WHERE status IN ('en_attente', 'acceptee');

-- ---------- audit_logs ----------
CREATE TABLE audit_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users (id),
    action      VARCHAR(255) NOT NULL,
    details     TEXT NOT NULL,
    created_at  TIMESTAMP(0),
    updated_at  TIMESTAMP(0)
);

-- ---------- leases ----------
CREATE TABLE leases (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id        UUID NOT NULL REFERENCES properties (id),
    owner_id           UUID NOT NULL REFERENCES users (id),
    tenant_id          UUID NOT NULL REFERENCES users (id),
    inquiry_id         UUID NOT NULL REFERENCES inquiries (id),
    start_date         DATE NOT NULL,
    end_date           DATE,
    monthly_rent       INTEGER NOT NULL,
    deposit            INTEGER NOT NULL DEFAULT 0,
    due_day            SMALLINT NOT NULL DEFAULT 0,
    reminders_enabled  BOOLEAN NOT NULL DEFAULT TRUE,
    status             VARCHAR(255) NOT NULL DEFAULT 'propose',
    confirmed_at       TIMESTAMP(0),
    terminated_on      DATE,
    created_at         TIMESTAMP(0),
    updated_at         TIMESTAMP(0)
);
CREATE INDEX leases_property_id_status_start_date_end_date_index
    ON leases (property_id, status, start_date, end_date);
CREATE INDEX leases_tenant_id_status_index ON leases (tenant_id, status);
CREATE INDEX leases_owner_id_status_index ON leases (owner_id, status);
CREATE INDEX leases_inquiry_id_index ON leases (inquiry_id);
CREATE UNIQUE INDEX leases_live_inquiry_unique
    ON leases (inquiry_id)
    WHERE status IN ('propose', 'actif');

-- ---------- rent_payments ----------
CREATE TABLE rent_payments (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lease_id      UUID NOT NULL REFERENCES leases (id),
    period        DATE NOT NULL,
    due_date      DATE NOT NULL,
    amount        INTEGER NOT NULL,
    paid_at       DATE,
    cancelled_at  TIMESTAMP(0),
    method        VARCHAR(255),
    reference     VARCHAR(160),
    created_at    TIMESTAMP(0),
    updated_at    TIMESTAMP(0)
);
CREATE UNIQUE INDEX rent_payments_lease_id_period_unique ON rent_payments (lease_id, period);
CREATE INDEX rent_payments_paid_at_due_date_index ON rent_payments (paid_at, due_date);

-- ---------- rent_reminders ----------
CREATE TABLE rent_reminders (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rent_payment_id  UUID NOT NULL REFERENCES rent_payments (id),
    status           VARCHAR(255) NOT NULL DEFAULT 'pending',
    attempts         INTEGER NOT NULL DEFAULT 0,
    attempted_at     TIMESTAMP(0),
    sent_at          TIMESTAMP(0),
    failed_at        TIMESTAMP(0),
    created_at       TIMESTAMP(0),
    updated_at       TIMESTAMP(0)
);
CREATE UNIQUE INDEX rent_reminders_rent_payment_id_unique ON rent_reminders (rent_payment_id);

-- ---------- reviews ----------
CREATE TABLE reviews (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lease_id    UUID NOT NULL REFERENCES leases (id),
    owner_id    UUID NOT NULL REFERENCES users (id),
    tenant_id   UUID NOT NULL REFERENCES users (id),
    rating      SMALLINT NOT NULL,
    comment     TEXT NOT NULL,
    reply       TEXT,
    replied_at  TIMESTAMP(0),
    hidden_at   TIMESTAMP(0),
    created_at  TIMESTAMP(0),
    updated_at  TIMESTAMP(0)
);
CREATE UNIQUE INDEX reviews_lease_id_unique ON reviews (lease_id);
CREATE INDEX reviews_owner_id_hidden_at_index ON reviews (owner_id, hidden_at);

-- ---------- review_reports ----------
CREATE TABLE review_reports (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id   UUID NOT NULL REFERENCES reviews (id),
    user_id     UUID NOT NULL REFERENCES users (id),
    reason      TEXT NOT NULL,
    created_at  TIMESTAMP(0),
    updated_at  TIMESTAMP(0)
);
CREATE UNIQUE INDEX review_reports_review_id_user_id_unique ON review_reports (review_id, user_id);

-- ---------- visit_slots ----------
CREATE TABLE visit_slots (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id   UUID NOT NULL REFERENCES properties (id),
    owner_id      UUID NOT NULL REFERENCES users (id),
    starts_at     TIMESTAMP(0) NOT NULL,
    ends_at       TIMESTAMP(0) NOT NULL,
    cancelled_at  TIMESTAMP(0),
    created_at    TIMESTAMP(0),
    updated_at    TIMESTAMP(0)
);
CREATE INDEX visit_slots_owner_id_starts_at_ends_at_index ON visit_slots (owner_id, starts_at, ends_at);
CREATE INDEX visit_slots_property_id_starts_at_index ON visit_slots (property_id, starts_at);

-- ---------- visit_bookings ----------
CREATE TABLE visit_bookings (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_slot_id  UUID NOT NULL REFERENCES visit_slots (id),
    property_id    UUID NOT NULL REFERENCES properties (id),
    client_id      UUID NOT NULL REFERENCES users (id),
    status         VARCHAR(255) NOT NULL DEFAULT 'confirmee',
    cancelled_at   TIMESTAMP(0),
    created_at     TIMESTAMP(0),
    updated_at     TIMESTAMP(0)
);
CREATE INDEX visit_bookings_client_id_status_index ON visit_bookings (client_id, status);
CREATE UNIQUE INDEX visit_slot_booking_unique
    ON visit_bookings (visit_slot_id)
    WHERE status = 'confirmee';

-- ---------- visit_events ----------
CREATE TABLE visit_events (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_booking_id  UUID NOT NULL REFERENCES visit_bookings (id),
    actor_id          UUID REFERENCES users (id),
    action            VARCHAR(255) NOT NULL,
    from_slot_id      UUID REFERENCES visit_slots (id),
    to_slot_id        UUID REFERENCES visit_slots (id),
    created_at        TIMESTAMP(0),
    updated_at        TIMESTAMP(0)
);

-- ---------- maintenance_tickets ----------
CREATE TABLE maintenance_tickets (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lease_id      UUID NOT NULL REFERENCES leases (id),
    owner_id      UUID NOT NULL REFERENCES users (id),
    tenant_id     UUID NOT NULL REFERENCES users (id),
    title         VARCHAR(160) NOT NULL,
    description   TEXT NOT NULL,
    priority      VARCHAR(255) NOT NULL DEFAULT 'normale',
    status        VARCHAR(255) NOT NULL DEFAULT 'nouveau',
    scheduled_at  TIMESTAMP(0),
    resolved_at   TIMESTAMP(0),
    created_at    TIMESTAMP(0),
    updated_at    TIMESTAMP(0)
);
CREATE INDEX maintenance_tickets_owner_id_status_index ON maintenance_tickets (owner_id, status);
CREATE INDEX maintenance_tickets_tenant_id_status_index ON maintenance_tickets (tenant_id, status);

-- ---------- maintenance_images ----------
CREATE TABLE maintenance_images (
    id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    maintenance_ticket_id  UUID NOT NULL REFERENCES maintenance_tickets (id),
    path                   VARCHAR(255) NOT NULL,
    created_at             TIMESTAMP(0),
    updated_at             TIMESTAMP(0)
);

-- ---------- maintenance_events ----------
CREATE TABLE maintenance_events (
    id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    maintenance_ticket_id  UUID NOT NULL REFERENCES maintenance_tickets (id),
    actor_id               UUID NOT NULL REFERENCES users (id),
    action                 VARCHAR(255) NOT NULL,
    note                   TEXT,
    scheduled_at           TIMESTAMP(0),
    created_at             TIMESTAMP(0),
    updated_at             TIMESTAMP(0)
);

-- ---------- activity_notifications ----------
CREATE TABLE activity_notifications (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_key     VARCHAR(150) NOT NULL,
    user_id       UUID NOT NULL REFERENCES users (id),
    subject       VARCHAR(190) NOT NULL,
    body          TEXT NOT NULL,
    page          VARCHAR(30) NOT NULL,
    status        VARCHAR(255) NOT NULL DEFAULT 'pending',
    attempts      INTEGER NOT NULL DEFAULT 0,
    attempted_at  TIMESTAMP(0),
    sent_at       TIMESTAMP(0),
    failed_at     TIMESTAMP(0),
    created_at    TIMESTAMP(0),
    updated_at    TIMESTAMP(0)
);
CREATE UNIQUE INDEX activity_notifications_event_key_user_id_unique
    ON activity_notifications (event_key, user_id);
CREATE INDEX activity_notifications_status_id_index ON activity_notifications (status, id);

-- ---------- migrations (Laravel legacy table) ----------
CREATE TABLE migrations (
    id         SERIAL PRIMARY KEY,
    migration  VARCHAR(255) NOT NULL,
    batch      INTEGER NOT NULL
);

COMMIT;
