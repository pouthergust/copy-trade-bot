const crypto = require('node:crypto');
const axios = require('axios');

const apiUrl = process.env.BINANCE_API_URL;
const apiKey = process.env.TRADER0_API_KEY;
// const apiSecret = process.env.TRADER0_API_SECRET;

async function connectAccount() { 
  try {
    const result = await axios({
      method: "POST",
      url: `${apiUrl}/v1/listenKey`,
      // url: `${apiUrl}/api/v3/userDataStream`,
      headers: { 'X-MBX-APIKEY': apiKey}
    })

    return result.data;
  } catch (error) {
    console.error(error.response || error);
  }
}

async function newOrder({ data, apiKey, apiSecret }) {
  data.timestamp = Date.now();
  data.recvWindow = 6e4;

  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(`${new URLSearchParams(data)}`)
    .digest('hex');

  const qs = `?${new URLSearchParams({ ...data, signature })}`;
  try {
    const result = await axios({
      method: "POST",
      url: `${apiUrl}/v1/order${qs}`,
      headers: { 'X-MBX-APIKEY': apiKey } 
    });

    return result.data;
  } catch (e) {
    console.error(e.response || e);
  }
}

module.exports = {
  connectAccount,
  newOrder
}