require("dotenv").config();
const api = require("./api");

const accounts = [];

async function loadAccounts() {
  const { listenKey } = await api.connectAccount();
  if (!listenKey) return;
  console.log('listenKey:', listenKey);

  let i=1 ;

  while(process.env[`TRADER${i}_API_KEY`]) {
    accounts.push({
      apiKey: process.env[`TRADER${i}_API_KEY`],
      apiSecret: process.env[`TRADER${i}_API_SECRET`],
    })

    i++;
  }

  console.log(`${accounts.length} accounts loaded!`)
}

loadAccounts();