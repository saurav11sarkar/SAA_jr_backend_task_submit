import config from "../config";
import SSLCommerzPayment from "sslcommerz-lts";
import AppError from "../error/appError";


const store_id = config.ssl.store_id!;
const store_passwd = config.ssl.store_password!;
const is_live = false;

const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

export const paymentService = {
  initPayment: async (paymentData: any) => {
    try {
      console.log("Initializing payment with data:", paymentData);

      const data = {
        total_amount: paymentData.amount,
        currency: "BDT",
        tran_id: paymentData.invoiceId,
        success_url: `${config.base_url}/api/v1/job-seeker/payment/success/${paymentData.invoiceId}`,
        fail_url: `${config.base_url}/api/v1/job-seeker/payment/fail/${paymentData.invoiceId}`,
        cancel_url: `${config.base_url}/cancel`,
        product_name: "Job Application",
        product_category: "Service",
        product_profile: "general",

        // Customer Information
        cus_name: "Job Seeker",
        cus_email: "test@example.com",
        cus_add1: "Dhaka",
        cus_city: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01700000000",

        // Shipping Information (required by SSLCommerz)
        shipping_method: "NO", // Important: Set to "NO" since this is a service

        // When shipping_method is "NO", these can be empty but must be present
      };

      console.log("Sending to SSLCommerz:", data);
      const response = await sslcz.init(data);
      console.log("SSLCommerz response:", response);

      if (!response?.GatewayPageURL) {
        console.error("No GatewayPageURL in response:", response);
        throw new AppError(
          500,
          `Payment initialization failed: ${"No Gateway URL returned"}`
        );
      }

      return { url: response.GatewayPageURL };
    } catch (error) {
      console.error("Payment error:", error);
      throw new AppError(
        500,
        `Payment initialization failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
  validatePayment: async () => true,
};
