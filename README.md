# Greg Harper Coaching website

Static site (HTML + CSS + a little JS). No build step, loads fast, works on every screen size.

## 1. Connect Stripe (about 15 min)
1. Create a Stripe account at stripe.com and finish verification.
2. **Product catalog → Add product** for each item:
   - Swim Coaching: $165, **recurring monthly**
   - Full Triathlon Programming: $300, **recurring monthly**
   - Video Analysis + 6-Week Plan: $300, one-time
   - The 5 workout plans: one-time ($50, $28, $40, $28, $40)
3. **Payment Links → New** for each product. Under *After payment*, pick
   "Don't show confirmation page" and redirect to `https://YOUR-DOMAIN/thanks.html`.
4. Paste each link into `STRIPE_LINKS` at the top of `main.js`.
   Buttons without a link scroll to the contact form instead, so nothing breaks.
5. Customers manage/cancel subscriptions: turn on **Settings → Billing → Customer portal**.

**Delivering PDFs:** Stripe doesn't send files on its own. Simplest options:
- Email the PDF manually when Stripe notifies you of a sale, or
- Put the PDF download link in the product's *Custom confirmation message / receipt*, or
- Use a no-code tool (Zapier/Make: "Stripe new payment → send email with PDF").

## 2. Publish
Drag this folder onto **Netlify** (app.netlify.com/drop). The contact form works
automatically there (Netlify Forms). On another host, swap the form for Formspree.

## 3. Before going live
- Replace `www.gregharpercoaching.com` everywhere (index.html, robots.txt, sitemap.xml) with the real domain.
- Photos come from Greg's Shopify store and Instagram (`assets/original`, `assets/instagram`); web-optimized versions live in `assets/img`. Swap in higher-resolution originals if Greg has them.
- Check facts/wording in the hero, About and the Full Triathlon card.
- Submit the sitemap in Google Search Console.
