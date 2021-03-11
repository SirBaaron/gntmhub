export function calculateStockPrice(stockIndex: number): number {
  return 0.9 + stockIndex / 10;
}

export function calculatePrice(
  stocks: any,
  candidateId: string,
  amount: number
) {
  const stockTotal = stocks[candidateId];
  return Array(Math.abs(amount))
    .fill(stockTotal)
    .map((total, index) =>
      calculateStockPrice(amount > 0 ? total + index + 1 : total - index)
    )
    .reduce((p, c) => (amount > 0 ? p + c : p - c), 0);
}

export function calculateStocksForPrice(
  stocks: any,
  candidateId: string,
  price: number
) {
  let amount = 1;
  while(calculatePrice(stocks, candidateId, amount) <= price){
    amount++;
  }
  return amount - 1;
}

export const isAllowedTime = () => {
  const date = new Date();
  if(date.getUTCDay() !== 4) return true;
  if(date.getUTCHours() < 19 || date.getUTCHours() >= 22) return true;
  if(date.getUTCHours() === 20 && date.getUTCMinutes() <= 10) return true;
  if(date.getUTCHours() === 21 && date.getUTCMinutes() >= 30) return true;
  return false;
}