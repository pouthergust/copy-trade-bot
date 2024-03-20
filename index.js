require("dotenv").config();

const accounts = [];

async function loadAccounts() {
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