const express = require("express");
const bodyParser = require("body-parser");
const { createPlivoSmsAdapter } = require("./plivoSmsAdapter");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const smsAdapter = createPlivoSmsAdapter();

app.post("/api/sms/send", async (req, res) => {
  try {
    const result = await smsAdapter.sendSms({
      from: req.body.from,
      to: req.body.to,
      body: req.body.body || req.body.message,
      statusCallbackUrl: req.body.statusCallbackUrl,
      statusCallbackMethod: req.body.statusCallbackMethod,
    });

    res.status(200).json({
      ok: true,
      provider: result.provider,
      messageId: result.messageId,
      status: result.status,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log("LeadOrbit SMS bridge running on port", port);
});
