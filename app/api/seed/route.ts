import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Check if products already exist
    const count = await prisma.product.count();
    if (count > 0) {
      return NextResponse.json({ message: `Database already seeded with ${count} products.` });
    }

    // Seed default admin
    const admin = await prisma.user.upsert({
      where: { email: 'admin@mvsclothing.com' },
      update: {},
      create: {
        name: 'MVS Admin',
        email: 'admin@mvsclothing.com',
        role: 'ADMIN',
      },
    });

    const productsData = [
      {
        title: 'Architectural Wool Overcoat',
        slug: 'architectural-wool-overcoat',
        description: 'Engineered from double-faced Italian cashmere-wool blend. Features relaxed structured shoulders, sharp notch lapel, and concealed horn buttons. An effortless statement piece for cold weather sophistication.',
        price: 495.0,
        compareAtPrice: 580.0,
        category: 'Men',
        featured: true,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=1200&auto=format&fit=crop'
        ]),
        details: JSON.stringify({
          fabric: '85% Virgin Wool, 15% Cashmere',
          care: 'Dry clean only. Store on wide padded hanger.',
          shipping: 'Complimentary worldwide express shipping & 30-day returns.'
        }),
        variants: [
          { size: 'S', color: 'Deep Charcoal', colorHex: '#111827', stock: 12 },
          { size: 'M', color: 'Deep Charcoal', colorHex: '#111827', stock: 18 },
          { size: 'L', color: 'Deep Charcoal', colorHex: '#111827', stock: 15 },
          { size: 'XL', color: 'Deep Charcoal', colorHex: '#111827', stock: 8 },
          { size: 'M', color: 'Slate Gray', colorHex: '#4B5563', stock: 10 },
        ]
      },
      {
        title: 'Silk Structured Trench Coat',
        slug: 'silk-structured-trench-coat',
        description: 'Minimalist double-breasted trench silhouette woven in crisp heavy silk-cotton twill. Features storm flap detail, removable waist sash, and hand-bound interior seam finishing.',
        price: 540.0,
        compareAtPrice: null,
        category: 'Women',
        featured: true,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=1200&auto=format&fit=crop'
        ]),
        details: JSON.stringify({
          fabric: '60% Organic Silk, 40% Long-staple Cotton',
          care: 'Specialist dry clean.',
          shipping: 'Free standard shipping on all orders over $250.'
        }),
        variants: [
          { size: 'XS', color: 'Off-White', colorHex: '#F9FAFB', stock: 5 },
          { size: 'S', color: 'Off-White', colorHex: '#F9FAFB', stock: 14 },
          { size: 'M', color: 'Off-White', colorHex: '#F9FAFB', stock: 20 },
          { size: 'L', color: 'Off-White', colorHex: '#F9FAFB', stock: 11 },
          { size: 'S', color: 'Muted Gold', colorHex: '#C5A880', stock: 9 },
        ]
      },
      {
        title: 'Heavyweight Supima Cotton Hoodie',
        slug: 'heavyweight-supima-cotton-hoodie',
        description: 'Crafted from 480 GSM American Supima cotton french terry. Custom boxy fit with clean drop shoulders, double-layer hood, and rib-knit gusset details.',
        price: 185.0,
        compareAtPrice: 220.0,
        category: 'Men',
        featured: true,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1200&auto=format&fit=crop'
        ]),
        details: JSON.stringify({
          fabric: '100% Supima Organic Cotton (480 GSM)',
          care: 'Machine wash cold on gentle cycle. Lay flat to dry.',
          shipping: 'Standard shipping 3-5 business days.'
        }),
        variants: [
          { size: 'S', color: 'Deep Charcoal', colorHex: '#111827', stock: 25 },
          { size: 'M', color: 'Deep Charcoal', colorHex: '#111827', stock: 32 },
          { size: 'L', color: 'Deep Charcoal', colorHex: '#111827', stock: 28 },
          { size: 'XL', color: 'Off-White', colorHex: '#F9FAFB', stock: 18 },
        ]
      },
      {
        title: 'Tailored Wide-Leg Trousers',
        slug: 'tailored-wide-leg-trousers',
        description: 'High-waisted tailoring with forward deep pleats and fluid wide-leg silhouette. Woven in breathable Japanese tropical wool suitable for year-round wear.',
        price: 290.0,
        compareAtPrice: null,
        category: 'Women',
        featured: false,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?q=80&w=1200&auto=format&fit=crop'
        ]),
        details: JSON.stringify({
          fabric: '100% Japanese Wool Crepe',
          care: 'Dry clean only.',
          shipping: 'Free worldwide express shipping.'
        }),
        variants: [
          { size: 'XS', color: 'Deep Charcoal', colorHex: '#111827', stock: 8 },
          { size: 'S', color: 'Deep Charcoal', colorHex: '#111827', stock: 16 },
          { size: 'M', color: 'Deep Charcoal', colorHex: '#111827', stock: 14 },
        ]
      },
      {
        title: 'Minimalist Leather Tote Bag',
        slug: 'minimalist-leather-tote-bag',
        description: 'Handcrafted in Florence from full-grain vegetable-tanned calfskin leather. Raw suede interior with detachable zip pouch and magnetic top closure.',
        price: 360.0,
        compareAtPrice: 420.0,
        category: 'Accessories',
        featured: true,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1200&auto=format&fit=crop'
        ]),
        details: JSON.stringify({
          fabric: '100% Full-Grain Calfskin Leather',
          care: 'Treat with leather conditioner periodically. Avoid long sun exposure.',
          shipping: 'Complimentary signature delivery.'
        }),
        variants: [
          { size: 'OS', color: 'Deep Charcoal', colorHex: '#111827', stock: 15 },
          { size: 'OS', color: 'Warm Gold', colorHex: '#C5A880', stock: 8 }
        ]
      },
      {
        title: 'Cashmere Ribbed Knit Beanie',
        slug: 'cashmere-ribbed-knit-beanie',
        description: 'Ultra-soft 7-gauge knitted beanie made from 100% Grade-A Mongolian Cashmere. Seamless construction for maximum comfort and warmth.',
        price: 95.0,
        compareAtPrice: 130.0,
        category: 'Sale',
        featured: false,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1200&auto=format&fit=crop'
        ]),
        details: JSON.stringify({
          fabric: '100% Pure Mongolian Cashmere',
          care: 'Hand wash in cold water with wool detergent. Dry flat.',
          shipping: 'Standard delivery 3-5 days.'
        }),
        variants: [
          { size: 'OS', color: 'Slate Gray', colorHex: '#4B5563', stock: 30 },
          { size: 'OS', color: 'Off-White', colorHex: '#F9FAFB', stock: 25 },
        ]
      }
    ];

    for (const item of productsData) {
      const { variants, ...prod } = item;
      const created = await prisma.product.create({ data: prod });
      for (const v of variants) {
        await prisma.productVariant.create({
          data: { productId: created.id, ...v },
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Database successfully seeded!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
