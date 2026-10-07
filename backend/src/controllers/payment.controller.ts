import type { RequestHandler } from "express";
import { serializeConnection, serializePayment, serializePendingToken } from "../lib/serializers.js";
import { assertWebhookAccess } from "../services/payments/gateway.js";
import * as paymentService from "../services/payment.service.js";

export const createPayment: RequestHandler = async (request, response) => {
  const { payment, checkout } = await paymentService.submitPayment(
    request.auth!.userId,
    request.body.planName,
    request.body.phone,
    request.body.provider,
  );
  response.status(201).json({
    payment: serializePayment(payment),
    checkout: { message: checkout.message },
  });
};

export const getPayments: RequestHandler = async (request, response) => {
  const rows = await paymentService.listPayments(request.auth!.userId);
  response.json({ payments: rows.map(serializePayment) });
};

export const getPayment: RequestHandler = async (request, response) => {
  const payment = await paymentService.getPayment(request.auth!.userId, String(request.params.reference));
  response.json({ payment: serializePayment(payment) });
};

export const getWifiStatus: RequestHandler = async (request, response) => {
  const { connection, pendingToken } = await paymentService.getWifiStatus(request.auth!.userId);
  response.json({
    connection: serializeConnection(connection),
    pendingToken: serializePendingToken(pendingToken),
  });
};

export const activateWifi: RequestHandler = async (request, response) => {
  const payment = await paymentService.activateWifi(request.auth!.userId, request.body.token);
  response.json({
    connection: serializeConnection(payment),
    payment: serializePayment(payment),
  });
};

export const azamPayWebhook: RequestHandler = async (request, response) => {
  assertWebhookAccess(String(request.query.token ?? request.headers["x-webhook-token"] ?? ""));
  const body = (request.body ?? {}) as Record<string, unknown>;
  const payment = await paymentService.handleGatewayWebhook(body);
  response.json({ ok: true, reference: payment?.reference });
};
