const plivo = require("plivo");

function requireValue(value, name) {
  if (!value) {
    throw new Error(name + " is required");
  }
  return value;
}

function getMessageId(response) {
  if (!response) {
    return undefined;
  }

  if (Array.isArray(response.message_uuid) && response.message_uuid.length > 0) {
    return response.message_uuid[0];
  }

  if (Array.isArray(response.messageUuid) && response.messageUuid.length > 0) {
    return response.messageUuid[0];
  }

  return response.message_uuid || response.messageUuid;
}

function createPlivoSmsAdapter(config) {
  const options = config || {};
  const authId = options.authId || process.env.PLIVO_AUTH_ID;
  const authToken = options.authToken || process.env.PLIVO_AUTH_TOKEN;
  const defaultFrom = options.defaultFrom || process.env.PLIVO_SOURCE_NUMBER;

  requireValue(authId, "PLIVO_AUTH_ID");
  requireValue(authToken, "PLIVO_AUTH_TOKEN");

  const client = new plivo.Client(authId, authToken);

  async function sendSms(payload) {
    const request = payload || {};
    const from = request.from || defaultFrom;
    const to = request.to;
    const body = request.body || request.message;
    const statusCallbackUrl = request.statusCallbackUrl;
    const statusCallbackMethod = (request.statusCallbackMethod || "POST").toUpperCase();

    requireValue(from, "from");
    requireValue(to, "to");
    requireValue(body, "body");

    let response;

    if (statusCallbackUrl) {
      response = await client.messages.create(from, to, body, {
        url: statusCallbackUrl,
        method: statusCallbackMethod,
      });
    } else {
      response = await client.messages.create(from, to, body);
    }

    return {
      provider: "plivo",
      messageId: getMessageId(response),
      status: response && response.message ? response.message : "queued",
      raw: response,
    };
  }

  return {
    sendSms,
  };
}

module.exports = {
  createPlivoSmsAdapter,
};
