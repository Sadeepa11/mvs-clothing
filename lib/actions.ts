'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

export async function getProducts(options?: {
  category?: string;
  sort?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
}) {
  try {
    const where: any = {};

    if (options?.category && options.category !== 'All') {
      where.category = options.category;
    }

    if (options?.featured) {
      where.featured = true;
    }

    if (options?.search && options.search.trim() !== '') {
      where.OR = [
        { title: { contains: options.search } },
        { description: { contains: options.search } },
        { category: { contains: options.search } },
      ];
    }

    if (options?.minPrice !== undefined || options?.maxPrice !== undefined) {
      where.price = {};
      if (options.minPrice !== undefined) where.price.gte = options.minPrice;
      if (options.maxPrice !== undefined) where.price.lte = options.maxPrice;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (options?.sort === 'price-asc') orderBy = { price: 'asc' };
    if (options?.sort === 'price-desc') orderBy = { price: 'desc' };
    if (options?.sort === 'newest') orderBy = { createdAt: 'desc' };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        variants: true,
      },
    });

    return { success: true, data: products };
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return { success: false, error: error.message || 'Failed to fetch products', data: [] };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: true,
      },
    });
    if (!product) return { success: false, error: 'Product not found' };
    return { success: true, data: product };
  } catch (error: any) {
    console.error('Error fetching product by slug:', error);
    return { success: false, error: error.message };
  }
}

export async function createProduct(data: {
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  category: string;
  featured?: boolean;
  images: string[];
  details?: { fabric?: string; care?: string; shipping?: string };
  variants: { size: string; color: string; colorHex?: string; stock: number }[];
}) {
  try {
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        price: Number(data.price),
        compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : null,
        category: data.category,
        featured: data.featured || false,
        images: JSON.stringify(data.images),
        details: data.details ? JSON.stringify(data.details) : null,
        variants: {
          create: data.variants.map((v) => ({
            size: v.size,
            color: v.color,
            colorHex: v.colorHex || '#111827',
            stock: Number(v.stock),
          })),
        },
      },
      include: { variants: true },
    });

    revalidatePath('/');
    revalidatePath('/catalog');
    revalidatePath('/admin/products');
    revalidatePath('/admin/inventory');
    return { success: true, data: product };
  } catch (error: any) {
    console.error('Error creating product:', error);
    return { success: false, error: error.message || 'Failed to create product' };
  }
}

export async function updateProduct(
  id: string,
  data: {
    title?: string;
    description?: string;
    price?: number;
    compareAtPrice?: number | null;
    category?: string;
    featured?: boolean;
    images?: string[];
    details?: { fabric?: string; care?: string; shipping?: string };
    variants?: { id?: string; size: string; color: string; colorHex?: string; stock: number }[];
  }
) {
  try {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = Number(data.price);
    if (data.compareAtPrice !== undefined) updateData.compareAtPrice = data.compareAtPrice ? Number(data.compareAtPrice) : null;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.images !== undefined) updateData.images = JSON.stringify(data.images);
    if (data.details !== undefined) updateData.details = JSON.stringify(data.details);

    // Update base product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    // If variants were supplied, update or create variants
    if (data.variants) {
      for (const v of data.variants) {
        if (v.id) {
          await prisma.productVariant.update({
            where: { id: v.id },
            data: {
              size: v.size,
              color: v.color,
              colorHex: v.colorHex || '#111827',
              stock: Number(v.stock),
            },
          });
        } else {
          await prisma.productVariant.create({
            data: {
              productId: id,
              size: v.size,
              color: v.color,
              colorHex: v.colorHex || '#111827',
              stock: Number(v.stock),
            },
          });
        }
      }
    }

    revalidatePath('/');
    revalidatePath('/catalog');
    revalidatePath(`/product/${updatedProduct.slug}`);
    revalidatePath('/admin/products');
    revalidatePath('/admin/inventory');
    return { success: true, data: updatedProduct };
  } catch (error: any) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message || 'Failed to update product' };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/catalog');
    revalidatePath('/admin/products');
    revalidatePath('/admin/inventory');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message || 'Failed to delete product' };
  }
}

export async function updateVariantStock(variantId: string, newStock: number) {
  try {
    const updated = await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: Math.max(0, newStock) },
    });
    revalidatePath('/admin/inventory');
    revalidatePath('/admin/products');
    revalidatePath('/catalog');
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error updating variant stock:', error);
    return { success: false, error: error.message };
  }
}

export async function createOrder(orderData: {
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  country?: string;
  subtotal: number;
  tax: number;
  shippingFee: number;
  total: number;
  paymentMethod?: string;
  items: {
    productId: string;
    variantId: string;
    title: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }[];
}) {
  try {
    const orderNumber = `MVS-${Math.floor(10000 + Math.random() * 90000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        shippingAddress: orderData.shippingAddress,
        city: orderData.city,
        postalCode: orderData.postalCode,
        country: orderData.country || 'United States',
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        shippingFee: orderData.shippingFee,
        total: orderData.total,
        status: 'Pending',
        paymentStatus: 'Paid',
        paymentMethod: orderData.paymentMethod || 'Credit Card',
        items: {
          create: orderData.items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            title: i.title,
            size: i.size,
            color: i.color,
            price: i.price,
            quantity: i.quantity,
            imageUrl: i.imageUrl,
          })),
        },
      },
      include: { items: true },
    });

    // Deduct stock for each variant
    for (const item of orderData.items) {
      if (item.variantId) {
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
        });
        if (variant) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stock: Math.max(0, variant.stock - item.quantity) },
          });
        }
      }
    }

    revalidatePath('/admin/orders');
    revalidatePath('/admin/inventory');
    revalidatePath('/admin');
    return { success: true, data: order };
  } catch (error: any) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message || 'Failed to process order' };
  }
}

export async function getOrders(statusFilter?: string) {
  try {
    const where: any = {};
    if (statusFilter && statusFilter !== 'All') {
      where.status = statusFilter;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    return { success: true, data: orders };
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    revalidatePath('/admin/orders');
    revalidatePath('/admin');
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }
}

export async function getAnalyticsOverview() {
  try {
    const totalOrders = await prisma.order.count();
    const totalProducts = await prisma.product.count();
    
    const allOrders = await prisma.order.findMany({
      select: { total: true, status: true, createdAt: true },
    });

    const totalSales = allOrders.reduce((sum, o) => sum + o.total, 0);

    const variants = await prisma.productVariant.findMany({
      select: { stock: true },
    });
    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
    const lowStockCount = variants.filter((v) => v.stock < 5).length;

    // Recent sales trend
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    return {
      success: true,
      data: {
        totalSales,
        totalOrders,
        totalProducts,
        totalStock,
        lowStockCount,
        recentOrders,
      },
    };
  } catch (error: any) {
    console.error('Error getting analytics overview:', error);
    return {
      success: false,
      error: error.message,
      data: {
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalStock: 0,
        lowStockCount: 0,
        recentOrders: [],
      },
    };
  }
}
