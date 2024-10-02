import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const createPaymentIntent = catchAsync(async (req, res) => {
  const { amount } = req.body;

  const result = await PaymentService.createPaymentIntent(amount);
  const clientSecret = {
    clientSecret: result.client_secret,
  };

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment intent created successfully",
    data: clientSecret,
  });
});

export const PaymentController = {
  createPaymentIntent,
};
