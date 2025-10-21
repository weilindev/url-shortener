-- URLs Table Schema (snake_case naming convention)
-- This is the main table for storing shortened URLs

-- Create the urls table
CREATE TABLE IF NOT EXISTS urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_code VARCHAR(10) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  clicks INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);
CREATE INDEX IF NOT EXISTS idx_urls_created_at ON urls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_urls_is_active ON urls(is_active);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_urls_updated_at ON urls;
CREATE TRIGGER update_urls_updated_at
  BEFORE UPDATE ON urls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE urls IS 'Main table for storing shortened URLs';
COMMENT ON COLUMN urls.id IS 'Unique identifier (UUID)';
COMMENT ON COLUMN urls.short_code IS 'Shortened URL code (e.g., abc123)';
COMMENT ON COLUMN urls.original_url IS 'Original long URL to redirect to';
COMMENT ON COLUMN urls.created_at IS 'Timestamp when the URL was created';
COMMENT ON COLUMN urls.updated_at IS 'Timestamp when the URL was last updated (auto-updated via trigger)';
COMMENT ON COLUMN urls.clicks IS 'Total number of clicks/redirects';
COMMENT ON COLUMN urls.expires_at IS 'Optional expiration timestamp';
COMMENT ON COLUMN urls.is_active IS 'Whether the URL is active (can be toggled on/off)';
