CREATE TABLE IF NOT EXISTS services (service_name text NOT NULL PRIMARY KEY, service_url text NOT NULL, service_status boolean NOT NULL);
CREATE TABLE IF NOT EXISTS subscriptions (subscriber_email text NOT NULL, service_name text NOT NULL REFERENCES services (service_name));
