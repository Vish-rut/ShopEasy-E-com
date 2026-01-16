import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { items, userId, shippingAddress } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const subtotal = items.reduce(
      (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
      0
    );
    const shipping = subtotal > 500 ? 0 : 99;
    const total = subtotal + shipping;

    const amountInPaise = Math.round(total * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaise,
      currency: "inr",
      metadata: {
        userId,
        itemCount: items.length.toString(),
      },
    });

    const orderItems = items.map((item: CartItem) => ({
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.image,
      price: Math.round(item.product.price * 100),
      quantity: item.quantity,
      selected_size: item.selectedSize || null,
      selected_color: item.selectedColor || null,
    }));

    const { error: orderError } = await supabase.from("orders").insert({
      user_id: userId,
      stripe_payment_intent_id: paymentIntent.id,
      amount: amountInPaise,
      currency: "inr",
      status: "pending",
      shipping_address: shippingAddress || null,
      items: orderItems,
    });

    if (orderError) {
      console.error("Error creating order:", orderError);
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: total,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
