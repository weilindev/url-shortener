-- Click Analytics Table
-- This table stores detailed analytics for each URL click

CREATE TABLE IF NOT EXISTS click_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url_id UUID NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
  ip_address VARCHAR(45), -- Support both IPv4 and IPv6
  user_agent TEXT,
  referrer TEXT,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Indexes for better query performance
  CONSTRAINT fk_url FOREIGN KEY (url_id) REFERENCES urls(id) ON DELETE CASCADE
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_click_analytics_url_id ON click_analytics(url_id);
CREATE INDEX IF NOT EXISTS idx_click_analytics_clicked_at ON click_analytics(clicked_at DESC);

-- Add comment for documentation
COMMENT ON TABLE click_analytics IS 'Stores detailed analytics for URL clicks including IP, user agent, and referrer';
COMMENT ON COLUMN click_analytics.ip_address IS 'IP address of the visitor (IPv4 or IPv6)';
COMMENT ON COLUMN click_analytics.user_agent IS 'Browser/device information from User-Agent header';
COMMENT ON COLUMN click_analytics.referrer IS 'Source URL from Referer header';
COMMENT ON COLUMN click_analytics.clicked_at IS 'Timestamp when the URL was clicked';
