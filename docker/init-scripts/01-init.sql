-- ===========================================
-- WebMailForcenecedor - Schema do Banco de Dados
-- Inicialização PostgreSQL
-- ===========================================

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- TABELA: users
-- Armazena informações dos usuários do webmail
-- ===========================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    display_name VARCHAR(255),
    avatar_url TEXT,
    signature TEXT,
    timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
    language VARCHAR(10) DEFAULT 'pt-BR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- ===========================================
-- TABELA: email_cache
-- Cache local de emails para performance
-- ===========================================
CREATE TABLE IF NOT EXISTS email_cache (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message_id VARCHAR(255) NOT NULL,
    folder VARCHAR(100) DEFAULT 'INBOX',
    subject TEXT,
    sender VARCHAR(255),
    sender_name VARCHAR(255),
    recipient VARCHAR(255),
    cc TEXT,
    bcc TEXT,
    body_preview TEXT,
    body_html TEXT,
    body_text TEXT,
    received_at TIMESTAMP WITH TIME ZONE,
    is_read BOOLEAN DEFAULT FALSE,
    is_starred BOOLEAN DEFAULT FALSE,
    is_important BOOLEAN DEFAULT FALSE,
    has_attachments BOOLEAN DEFAULT FALSE,
    labels TEXT[], -- Array de labels/tags
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, message_id)
);

-- ===========================================
-- TABELA: attachments
-- Metadados dos anexos
-- ===========================================
CREATE TABLE IF NOT EXISTS attachments (
    id SERIAL PRIMARY KEY,
    email_id INTEGER REFERENCES email_cache(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    content_type VARCHAR(100),
    size_bytes BIGINT,
    storage_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- TABELA: folders
-- Pastas personalizadas do usuário
-- ===========================================
CREATE TABLE IF NOT EXISTS folders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    parent_id INTEGER REFERENCES folders(id),
    icon VARCHAR(50),
    color VARCHAR(20),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, name, parent_id)
);

-- ===========================================
-- TABELA: contacts
-- Contatos do usuário
-- ===========================================
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    company VARCHAR(255),
    phone VARCHAR(50),
    avatar_url TEXT,
    notes TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, email)
);

-- ===========================================
-- TABELA: email_drafts
-- Rascunhos de emails
-- ===========================================
CREATE TABLE IF NOT EXISTS email_drafts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    recipient TEXT,
    cc TEXT,
    bcc TEXT,
    subject TEXT,
    body_html TEXT,
    body_text TEXT,
    attachments JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- TABELA: user_settings
-- Configurações do usuário
-- ===========================================
CREATE TABLE IF NOT EXISTS user_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    emails_per_page INTEGER DEFAULT 50,
    default_folder VARCHAR(100) DEFAULT 'INBOX',
    auto_refresh_interval INTEGER DEFAULT 60, -- segundos
    notification_enabled BOOLEAN DEFAULT TRUE,
    theme VARCHAR(20) DEFAULT 'light',
    compact_view BOOLEAN DEFAULT FALSE,
    show_preview_pane BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- ÍNDICES PARA PERFORMANCE
-- ===========================================
CREATE INDEX IF NOT EXISTS idx_email_cache_user_folder ON email_cache(user_id, folder);
CREATE INDEX IF NOT EXISTS idx_email_cache_received ON email_cache(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_cache_sender ON email_cache(sender);
CREATE INDEX IF NOT EXISTS idx_email_cache_subject ON email_cache USING gin(to_tsvector('portuguese', subject));
CREATE INDEX IF NOT EXISTS idx_contacts_user ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);

-- ===========================================
-- TRIGGERS
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER email_cache_updated_at
    BEFORE UPDATE ON email_cache
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER contacts_updated_at
    BEFORE UPDATE ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ===========================================
-- DADOS INICIAIS (OPCIONAL)
-- ===========================================
-- Inserir pastas padrão do sistema
INSERT INTO folders (user_id, name, icon, sort_order) VALUES
    (NULL, 'INBOX', 'inbox', 1),
    (NULL, 'Sent', 'send', 2),
    (NULL, 'Drafts', 'file-text', 3),
    (NULL, 'Spam', 'alert-triangle', 4),
    (NULL, 'Trash', 'trash-2', 5)
ON CONFLICT DO NOTHING;

-- Mensagem de sucesso
DO $$
BEGIN
    RAISE NOTICE 'WebMailForcenecedor: Schema criado com sucesso!';
END $$;
