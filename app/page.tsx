"use client";
import { useState, useEffect } from "react";
import { PricingCard, PricingSwitch } from "@/components/pricing";
import { plans } from "@/constant/data";
import { CurrencyDropDown } from "@/components/currencyDropdown";
import axios from "axios";

export default function Home() {
  const [pricingPeriod, setPricingPeriod] = useState<
    "monthly" | "quarterly" | "yearly"
  >("monthly");
  const [selectedCurrency, setSelectedCurrency] = useState("usd");
  const [conversionRates, setConversionRates] = useState<{
    [key: string]: number;
  }>({});

  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value);
  };

  const togglePricingPeriod = (value: string) => {
    switch (value) {
      case "0":
        setPricingPeriod("monthly");
        break;
      case "1":
        setPricingPeriod("quarterly");
        break;
      case "2":
        setPricingPeriod("yearly");
        break;
      default:
        setPricingPeriod("monthly");
    }
  };

  useEffect(() => {
    if (
      selectedCurrency !== "usd" &&
      Object.keys(conversionRates).length === 0
    ) {
      axios
        .get(
          `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_KEY}/latest/USD`
        )
        .then((response: any) => {
          setConversionRates(response.data.conversion_rates);
          console.log("Fetched Exchange Rate");
        })
        .catch((error: Error) => {
          console.error("Error fetching conversion rates", error);
        });
    }
  }, [selectedCurrency, conversionRates]);

  return (
    <>
      <div className="bg-pricing-hero w-full h-[22.313rem] flex justify-center items-center">
        <div className="flex flex-col justify-center items-center max-w-[31.5rem] text-center space-y-3">
          <p className="text-lg font-medium text-primary">Affordable pricing</p>
          <h3 className="text-[2rem] font-medium text-primary">
            Choose the best GMIND AI plan
          </h3>
          <p className="text-sm text-primary-light">
            We offer three comprehensive packages to cater to your needs:
            <br /> Basic, Premium, and Supported/Partners.
          </p>
          <div className="flex justify-center space-x-8 items-end">
            <CurrencyDropDown onValueChange={handleCurrencyChange} />
            <PricingSwitch onSwitch={togglePricingPeriod} />
          </div>
        </div>
      </div>

      <div className="py-14">
        <section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 mt-8">
          {plans.map((plan) => {
            return (
              <PricingCard
                key={plan.title}
                {...plan}
                pricingPeriod={pricingPeriod}
                conversionRates={conversionRates}
                selectedCurrency={selectedCurrency}
              />
            );
          })}
        </section>
      </div>
    </>
  );
}
