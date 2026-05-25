import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return res.status(503).json({
      error: 'Checkout is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on Vercel.',
    });
  }

  const { email, fullName, items, notes } = req.body || {};

  if (!email || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Email and at least one cart item are required.' });
  }

  const normalized = items.map((item) => {
    const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
    const unit = Math.max(0, parseInt(item.unit_price_cents, 10) || 0);
    return {
      product_slug: item.product_slug || item.slug,
      product_name: item.product_name || item.name,
      quantity: qty,
      unit_price_cents: unit,
      line_total_cents: unit * qty,
      purchase_type: item.purchase_type === 'subscribe' ? 'subscribe' : 'one-time',
      image_url: item.image_url || item.image || null,
    };
  });

  const subtotal_cents = normalized.reduce((sum, line) => sum + line.line_total_cents, 0);

  const supabase = createClient(url, serviceKey);

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      email: String(email).trim().toLowerCase(),
      full_name: fullName ? String(fullName).trim() : null,
      status: 'pending',
      currency: 'GBP',
      subtotal_cents,
      total_cents: subtotal_cents,
      notes: notes || null,
    })
    .select('id')
    .single();

  if (orderError) {
    console.error('order insert error:', orderError);
    return res.status(500).json({ error: 'Failed to create order.' });
  }

  const orderItems = normalized.map((line) => ({
    order_id: order.id,
    ...line,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

  if (itemsError) {
    console.error('order_items insert error:', itemsError);
    await supabase.from('orders').delete().eq('id', order.id);
    return res.status(500).json({ error: 'Failed to save order items.' });
  }

  return res.status(201).json({
    orderId: order.id,
    subtotal_cents,
    total_cents: subtotal_cents,
  });
}
