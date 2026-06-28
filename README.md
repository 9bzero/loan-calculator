# loan-calculator

Calculate monthly EMI and see the full amortization schedule.

Enter loan amount, interest rate (annual), and term in months. Shows monthly payment, total interest paid, and a month-by-month breakdown of principal vs interest.

## Run

```bash
npm install && npm run dev
```

Formula used: EMI = P × r × (1+r)^n / ((1+r)^n - 1) where r = monthly rate, n = number of months.
