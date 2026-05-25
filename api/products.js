import { createClient } from '@supabase/supabase-js';

const FALLBACK_PRODUCTS = [
  {
    slug: 'nad-smartstrip',
    name: 'NAD SmartStrip+',
    description: 'Smartstrip+ with SpeedRelease: ditch the needles and just let it melt for a daily boost.',
    price_cents: 6900,
    subscribe_price_cents: 4900,
    image_url: 'cdn/shop/t/32/assets/Nad%20Strip9321.png?v=172847355907439936341775885985',
    sort_order: 1,
  },
  {
    slug: 'nad-prime-vials',
    name: 'Nad+Prime Vial kit',
    description: 'Pure, potent NAD+ vial designed to restore cellular energy, focus, and performance.',
    price_cents: 24900,
    subscribe_price_cents: 21165,
    image_url: 'cdn/shop/t/32/assets/Vialsff43.png?v=90810362016220207791775885985',
    sort_order: 2,
  },
];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return res.status(200).json({ products: FALLBACK_PRODUCTS, source: 'fallback' });
  }

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from('products')
      .select('slug, name, description, price_cents, subscribe_price_cents, image_url, sort_order')
      .eq('active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    return res.status(200).json({
      products: data?.length ? data : FALLBACK_PRODUCTS,
      source: data?.length ? 'supabase' : 'fallback',
    });
  } catch (err) {
    console.error('products API error:', err);
    return res.status(200).json({ products: FALLBACK_PRODUCTS, source: 'fallback' });
  }
}
