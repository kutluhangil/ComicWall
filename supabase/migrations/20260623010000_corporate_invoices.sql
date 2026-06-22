-- fatura tipi ve kurumsal fatura bilgileri için addresses tablosuna sütunlar ekle
ALTER TABLE public.addresses
  ADD COLUMN IF NOT EXISTS invoice_type text NOT NULL DEFAULT 'individual',
  ADD COLUMN IF NOT EXISTS company_name text,
  ADD COLUMN IF NOT EXISTS tax_office text,
  ADD COLUMN IF NOT EXISTS tax_number text,
  ADD COLUMN IF NOT EXISTS district text;

-- kısıtlamalar ekle
ALTER TABLE public.addresses DROP CONSTRAINT IF EXISTS addresses_invoice_type_check;
ALTER TABLE public.addresses
  ADD CONSTRAINT addresses_invoice_type_check
  CHECK (invoice_type IN ('individual', 'corporate'));
