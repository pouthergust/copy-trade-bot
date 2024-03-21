const axios = require('axios');

const apiUrl = process.env.BINANCE_API_URL;
const apiKey = process.env.TRADER0_API_KEY;
// const apiSecret = process.env.TRADER0_API_SECRET;

async function connectAccount() { 
  try {
    const result = await axios({
      method: "POST",
      // url: `${apiUrl}/v1/listenKey`,
      url: `${apiUrl}/api/v3/userDataStream`,
      headers: { 'X-MBX-APIKEY': apiKey}
    })

    return result.data;
  } catch (error) {
    console.error(error.response || error);
  }
}

module.exports = {
  connectAccount
}