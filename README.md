# E-commerce Phishing Project (Educational)

This repository contains a mock e-commerce site created **for educational purposes only**. It demonstrates common techniques used in phishing pages so developers and security researchers can study and learn from them.

## Telegram Configuration

The script [`statics/cashout.js`](statics/cashout.js) sends captured data to a Telegram bot. The file includes placeholder values `telegramToken` and `chatId` that **must be replaced** with your own bot token and chat ID if you intend to experiment with the code.

## Warning

This project is intended solely for learning about phishing and security. **Do not use it for any malicious activity.** The authors and contributors are not responsible for any misuse of this code.

## Running

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Product Data

The file [`data/products.json`](data/products.json) contains one sample entry. You can add more products by appending objects with the same structure, for example:

```json
{
  "id": 2,
  "name": "Another Item",
  "price": 19.99,
  "originalPrice": 29.99,
  "image": "https://example.com/item.jpg",
  "images": ["https://example.com/item.jpg"],
  "description": "Short description",
  "features": ["Feature 1", "Feature 2"],
  "category": "Demo",
  "inStock": true,
  "rating": 4.8,
  "reviews": 3
}
```

All interface pages and scripts are in English. Product data is included only as sample content.
