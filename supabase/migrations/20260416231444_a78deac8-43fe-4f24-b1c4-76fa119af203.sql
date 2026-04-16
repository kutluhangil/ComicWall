-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'TRY',
  shipping_info JSONB NOT NULL,
  iyzico_payment_id TEXT,
  iyzico_conversation_id TEXT,
  iyzico_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_title TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  line_total NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS for orders
CREATE POLICY "Users can view own orders"
ON public.orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS for order_items
CREATE POLICY "Users can view own order items"
ON public.order_items FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.orders
  WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
));

CREATE POLICY "Users can create own order items"
ON public.order_items FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM public.orders
  WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
));

-- Indexes
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_iyzico_token ON public.orders(iyzico_token);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();