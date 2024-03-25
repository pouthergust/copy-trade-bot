require("dotenv").config();
const WebSocket = require("ws");
const api = require("./api");

const accounts = [];
const oldOrders = {};

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

  console.log(`${JSON.stringify(accounts)} accounts loaded!`)
  return listenKey;
}

function copyTrade(trade) {
  console.log("Trade Obj:", trade);
  const data = {
    symbol: trade.s,
    side: trade.S,
    type: trade.o
  }

  if (trade.q && parseFloat(trade.q)) data.quantity = trade.q;
  if (trade.p && parseFloat(trade.p)) data.price = trade.p;
  if (trade.sp && parseFloat(trade.sp)) data.stopPrice = trade.sp;
  if (trade.AP && parseFloat(trade.AP)) data.activationPrice = trade.AP;
  if (trade.cr && parseFloat(trade.cr)) data.callbackRate = trade.cr;
  if (trade.ps) data.positionSide = trade.ps;
  if (trade.f /* && trade.f !== "GTC" */) data.timeInForce = trade.f;

  return data;
}

async function start() {
  const listenKey = await loadAccounts();
  const ws = new WebSocket(`${process.env.BINANCE_WS_URL}/${listenKey}`);	

  ws.onmessage = async (event) => {
    try {
      const trade = JSON.parse(event.data);
      
      if (trade.e = "ORDER_TRADE_UPDATE" && !oldOrders[trade.i]) {
        oldOrders[trade.i] = true;
        
        console.clear();

        const data = copyTrade(trade.o);
        const promises = accounts.map(acc => api.newOrder({ data, ...acc }));
        const results = await Promise.allSettled(promises);
        console.log(results);
        
        process.exit(0);
      }
    } catch (e) {
      console.error(e);
    }
  }

  console.log("waiting news...");
  setInterval(() => {
    api.connectAccount();
  }, 59 * 60 * 1000);
}

start();