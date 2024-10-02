import Stripe from "stripe";
import config from "../../config";
import { TPayment } from "./payment.interface";
import { getExistingUserById } from "../user/user.utils";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { getExistingPostById } from "../post/post.utils";
import { Payment } from "./payment.model";

const stripe = new Stripe(config.stripe_secret_key!, {
  apiVersion: "2024-06-20",
});

const createPaymentIntent = async (amount: number) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "usd",
    payment_method_types: ["card"],
  });
  return paymentIntent;
};

const createPayment = async (userId: string, payload: TPayment) => {
  const existingUser = await getExistingUserById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const existingPost = await getExistingPostById(payload.post.toString());

  if (!existingPost) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  payload.user = existingUser._id;

  const result = await Payment.create(payload);

  return result;
};

export const PaymentService = {
  createPaymentIntent,
  createPayment,
};
