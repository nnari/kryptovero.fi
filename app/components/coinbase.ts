import { Temporal } from "proposal-temporal";

export const getPriceAt = async (date: Temporal.PlainDate, symbol: string) => {
  const result = await fetch(
    `https://api.pro.coinbase.com/products/${symbol}-EUR/candles?start=${date.toString(
      { calendarName: "never" }
    )}Z00:00:00.00&end=${date
      .add(Temporal.Duration.from({ days: 1 }))
      .toString({
        calendarName: "never",
      })}Z00:00:00.00&granularity=86400`
  ).then((res) => res.json());
  const open = result?.[0]?.[3] ?? 1;
  const close = result?.[0]?.[4] ?? 1;
  return (open + close) / 2;
};

type ProductResponse = { quote_currency: string; base_currency: string }[];
export const getCoins = async () => {
  const result = await fetch(`https://api.pro.coinbase.com/products`).then(
    (res) => res.json() as Promise<ProductResponse>
  );
  return Array.from(
    new Set(
      result
        .flatMap(({ base_currency, quote_currency }) => [
          base_currency,
          quote_currency,
        ])
        .sort()
    )
  );
};
