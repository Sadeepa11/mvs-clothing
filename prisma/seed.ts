import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting MVS Clothing database seed...');

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const admin = await prisma.user.create({
    data: {
      name: 'MVS Admin',
      email: 'admin@mvsclothing.com',
      role: 'ADMIN',
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: 'Sophia Laurent',
      email: 'sophia@example.com',
      role: 'CUSTOMER',
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: 'Alexander Wright',
      email: 'alex@example.com',
      role: 'CUSTOMER',
    },
  });

  console.log('👤 Created Users:', { admin: admin.email, customer1: customer1.email });

  // Sample Products Data
  const productsData = [
    {
      title: 'Architectural Wool Overcoat',
      slug: 'architectural-wool-overcoat',
      description: 'Engineered from double-faced Italian cashmere-wool blend. Features a relaxed structured shoulders, sharp notch lapel, and concealed horn buttons. An effortless statement piece for cold weather sophistication.',
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
        { size: 'L', color: 'Slate Gray', colorHex: '#4B5563', stock: 7 },
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
        { size: 'M', color: 'Muted Gold', colorHex: '#C5A880', stock: 15 },
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
        { size: 'M', color: 'Off-White', colorHex: '#F9FAFB', stock: 22 }
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
        { size: 'L', color: 'Slate Gray', colorHex: '#4B5563', stock: 10 }
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
        { size: 'OS', color: 'Warm Gold', colorHex: '#C5A880', stock: 18 }
      ]
    },
    {
      title: 'Seamless Merino Wool Sweater',
      slug: 'seamless-merino-wool-sweater',
      description: 'Knitted using 3D WholeGarment tech for a completely seamless, fluid feel. Extra-fine 19.5 micron Australian Merino wool provides unmatched breathability.',
      price: 215.0,
      compareAtPrice: 260.0,
      category: 'Men',
      featured: false,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop'
      ]),
      details: JSON.stringify({
        fabric: '100% Extra-Fine Australian Merino Wool',
        care: 'Hand wash cold or gentle wool cycle.',
        shipping: 'Worldwide shipping available.'
      }),
      variants: [
        { size: 'S', color: 'Slate Gray', colorHex: '#4B5563', stock: 14 },
        { size: 'M', color: 'Slate Gray', colorHex: '#4B5563', stock: 22 },
        { size: 'L', color: 'Deep Charcoal', colorHex: '#111827', stock: 19 }
      ]
    },
    {
      title: 'Architectural Sunglasses in Titanium',
      slug: 'architectural-sunglasses-in-titanium',
      description: 'Japanese pure titanium frame with custom bevel edge geometry and anti-reflective Zeiss polarized lenses. Ultralight sub-20 gram weight.',
      price: 320.0,
      compareAtPrice: 380.0,
      category: 'Accessories',
      featured: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=1200&auto=format&fit=crop'
      ]),
      details: JSON.stringify({
        fabric: '100% Japanese Pure Titanium & Zeiss Lenses',
        care: 'Clean with microfiber cloth provided.',
        shipping: 'Includes hard protective leather case.'
      }),
      variants: [
        { size: 'OS', color: 'Matte Charcoal', colorHex: '#111827', stock: 10 },
        { size: 'OS', color: 'Brushed Gold', colorHex: '#C5A880', stock: 6 }
      ]
    }
  ];

  // Insert Products & Variants
  for (const item of productsData) {
    const { variants, ...productInfo } = item;
    const createdProduct = await prisma.product.create({
      data: productInfo,
    });

    for (const v of variants) {
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          ...v,
        },
      });
    }
  }

  console.log(`👕 Seeded ${productsData.length} luxury products with variants.`);

  // Create Sample Orders
  const sampleProducts = await prisma.product.findMany({ include: { variants: true } });

  if (sampleProducts.length > 0) {
    const p1 = sampleProducts[0];
    const p2 = sampleProducts[1];
    const p3 = sampleProducts[2];

    const order1 = await prisma.order.create({
      data: {
        orderNumber: 'MVS-98214',
        userId: customer1.id,
        customerName: customer1.name,
        customerEmail: customer1.email,
        shippingAddress: '742 Evergreen Terrace',
        city: 'New York',
        postalCode: '10001',
        country: 'United States',
        subtotal: 1035.0,
        tax: 82.8,
        shippingFee: 0.0,
        total: 1117.8,
        status: 'Delivered',
        paymentStatus: 'Paid',
        paymentMethod: 'Apple Pay',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
        items: {
          create: [
            {
              productId: p1.id,
              variantId: p1.variants[0]?.id,
              title: p1.title,
              size: p1.variants[0]?.size || 'M',
              color: p1.variants[0]?.color || 'Deep Charcoal',
              price: p1.price,
              quantity: 1,
              imageUrl: JSON.parse(p1.images)[0],
            },
            {
              productId: p2.id,
              variantId: p2.variants[0]?.id,
              title: p2.title,
              size: p2.variants[0]?.size || 'S',
              color: p2.variants[0]?.color || 'Off-White',
              price: p2.price,
              quantity: 1,
              imageUrl: JSON.parse(p2.images)[0],
            },
          ],
        },
      },
    });

    const order2 = await prisma.order.create({
      data: {
        orderNumber: 'MVS-98215',
        userId: customer2.id,
        customerName: customer2.name,
        customerEmail: customer2.email,
        shippingAddress: '10880 Wilshire Blvd',
        city: 'Los Angeles',
        postalCode: '90024',
        country: 'United States',
        subtotal: 370.0,
        tax: 29.6,
        shippingFee: 15.0,
        total: 414.6,
        status: 'Processing',
        paymentStatus: 'Paid',
        paymentMethod: 'Credit Card',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
        items: {
          create: [
            {
              productId: p3.id,
              variantId: p3.variants[0]?.id,
              title: p3.title,
              size: p3.variants[0]?.size || 'L',
              color: p3.variants[0]?.color || 'Deep Charcoal',
              price: p3.price,
              quantity: 2,
              imageUrl: JSON.parse(p3.images)[0],
            },
          ],
        },
      },
    });

    const order3 = await prisma.order.create({
      data: {
        orderNumber: 'MVS-98216',
        customerName: 'Marcus Vance',
        customerEmail: 'marcus@example.com',
        shippingAddress: '450 Sutter St',
        city: 'San Francisco',
        postalCode: '94108',
        country: 'United States',
        subtotal: 495.0,
        tax: 39.6,
        shippingFee: 0.0,
        total: 534.6,
        status: 'Pending',
        paymentStatus: 'Paid',
        paymentMethod: 'Credit Card',
        createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
        items: {
          create: [
            {
              productId: p1.id,
              variantId: p1.variants[1]?.id,
              title: p1.title,
              size: p1.variants[1]?.size || 'L',
              color: p1.variants[1]?.color || 'Deep Charcoal',
              price: p1.price,
              quantity: 1,
              imageUrl: JSON.parse(p1.images)[0],
            },
          ],
        },
      },
    });

    console.log(`📦 Seeded sample orders: ${order1.orderNumber}, ${order2.orderNumber}, ${order3.orderNumber}`);
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
