# Custom Domain Setup Guide - yourhelpa.com.ng

## Overview

This guide walks you through connecting your custom domain `yourhelpa.com.ng` to your YourHelpa application hosted on Supabase (Figma Make).

---

## Prerequisites

✅ **What You Need:**
1. Domain registered: `yourhelpa.com.ng`
2. Access to your domain registrar (where you bought the domain)
3. Supabase project ID (current URL format: `https://[PROJECT_ID].supabase.co`)
4. Admin access to your Supabase project

---

## Part 1: Supabase Custom Domain Setup

### Step 1: Access Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your YourHelpa project
3. Navigate to **Settings** → **Custom Domains** (in the left sidebar)

### Step 2: Add Your Custom Domain

1. Click **"Add custom domain"**
2. Enter your domain: `yourhelpa.com.ng`
3. Click **"Verify domain"**

Supabase will provide you with DNS records to add to your domain.

---

## Part 2: DNS Configuration

### DNS Records Required

Supabase will ask you to add **one of these configurations**:

#### Option A: CNAME Record (Recommended for Subdomains)

If you want to use a subdomain like `app.yourhelpa.com.ng`:

| Type  | Name/Host | Value/Target              | TTL  |
|-------|-----------|---------------------------|------|
| CNAME | app       | [provided-by-supabase]    | 3600 |

#### Option B: A Record (For Root Domain)

If you want to use the root domain `yourhelpa.com.ng`:

| Type | Name/Host | Value/Target          | TTL  |
|------|-----------|----------------------|------|
| A    | @         | [IP-provided-by-supabase] | 3600 |

**Note**: Supabase will provide the exact values during the setup process.

### Step 3: Configure DNS at Your Registrar

Common Nigerian domain registrars and where to find DNS settings:

#### If you use **Web4Africa**:
1. Login to https://clients.web4africa.com
2. Go to **Domains** → **My Domains**
3. Click on `yourhelpa.com.ng`
4. Click **"Manage DNS"** or **"DNS Management"**
5. Add the records provided by Supabase

#### If you use **Whogohost**:
1. Login to https://www.whogohost.com/host/clientarea.php
2. Go to **Domains** → **My Domains**
3. Click on `yourhelpa.com.ng`
4. Click **"Manage Domain"**
5. Select **"DNS Management"**
6. Add the records provided by Supabase

#### If you use **Qservers**:
1. Login to https://www.qservers.net/client/
2. Go to **Domains** → **My Domains**
3. Click on `yourhelpa.com.ng`
4. Click **"Manage"** → **"DNS Management"**
5. Add the records provided by Supabase

#### If you use **HostGator Nigeria**:
1. Login to https://portal.hostgator.com.ng
2. Go to **Domains** → **DNS Management**
3. Select `yourhelpa.com.ng`
4. Add the records provided by Supabase

#### Generic Instructions (Any Registrar):
1. Login to your domain registrar
2. Find "DNS Management", "DNS Settings", or "Name Servers"
3. Add the DNS records provided by Supabase
4. Save changes

---

## Part 3: Verify DNS Configuration

### Check DNS Propagation

DNS changes can take **24-72 hours** to propagate worldwide, but usually complete within **1-4 hours**.

#### Check DNS Status Online:
1. Visit https://dnschecker.org
2. Enter `yourhelpa.com.ng` (or your subdomain)
3. Select record type (A or CNAME)
4. Check if the value matches what Supabase provided

#### Check via Command Line:

**Windows (Command Prompt):**
```bash
nslookup yourhelpa.com.ng
```

**Mac/Linux (Terminal):**
```bash
dig yourhelpa.com.ng
# or
nslookup yourhelpa.com.ng
```

You should see the IP address or CNAME pointing to Supabase.

---

## Part 4: SSL Certificate Setup

Supabase automatically provisions an SSL certificate (HTTPS) for your custom domain using Let's Encrypt.

### Automatic SSL Process:

1. After DNS records are verified
2. Supabase automatically requests an SSL certificate
3. Certificate is issued within **5-15 minutes**
4. Your domain will be accessible via HTTPS

### Check SSL Status:

In Supabase Dashboard:
- Go to **Settings** → **Custom Domains**
- Look for "SSL Certificate" status
- Should show: ✅ **Active** or **Issued**

---

## Part 5: Update Your Application URLs

After your domain is connected, you need to update authentication URLs in Supabase.

### Update Site URL

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Update **Site URL** to: `https://yourhelpa.com.ng`
3. Add **Redirect URLs**:
   - `https://yourhelpa.com.ng/**`
   - `https://yourhelpa.com.ng/auth/callback`
4. Click **Save**

### Update Allowed Domains

1. Still in **Authentication** → **URL Configuration**
2. Under **Allowed Redirect URLs**, add:
   ```
   https://yourhelpa.com.ng
   https://yourhelpa.com.ng/**
   ```
3. Click **Save**

---

## Part 6: Test Your Domain

### Basic Functionality Tests

1. **Visit your domain**: https://yourhelpa.com.ng
   - ✅ Should load your homepage
   - ✅ Should show SSL padlock in browser

2. **Test Authentication**:
   - Try signing up with a new account
   - Try signing in with existing account
   - Check if email verification links work

3. **Test Navigation**:
   - Navigate to different pages (Services, Pricing, Blog, etc.)
   - Ensure all links work correctly

4. **Test WhatsApp Integration**:
   - Click WhatsApp button
   - Ensure it opens WhatsApp correctly

5. **Check Dark/Light Mode**:
   - Toggle dark/light mode
   - Verify styling looks correct

---

## Common DNS Record Configurations

### Configuration 1: Root Domain Only

**Goal**: `yourhelpa.com.ng` points to your app

```
Type: A
Name: @
Value: [Supabase IP]
TTL: 3600
```

**Result**:
- ✅ https://yourhelpa.com.ng → Your app
- ❌ https://www.yourhelpa.com.ng → Not configured

---

### Configuration 2: Root + WWW Subdomain (Recommended)

**Goal**: Both `yourhelpa.com.ng` and `www.yourhelpa.com.ng` work

**Step 1**: Add root domain
```
Type: A
Name: @
Value: [Supabase IP]
TTL: 3600
```

**Step 2**: Add WWW subdomain
```
Type: CNAME
Name: www
Value: yourhelpa.com.ng
TTL: 3600
```

**Result**:
- ✅ https://yourhelpa.com.ng → Your app
- ✅ https://www.yourhelpa.com.ng → Your app

---

### Configuration 3: Custom Subdomain

**Goal**: `app.yourhelpa.com.ng` points to your app

```
Type: CNAME
Name: app
Value: [Supabase CNAME target]
TTL: 3600
```

**Result**:
- ✅ https://app.yourhelpa.com.ng → Your app
- ❌ https://yourhelpa.com.ng → Not configured (unless you add separate A record)

---

## Troubleshooting

### Issue 1: DNS Not Propagating

**Symptoms**:
- Domain doesn't load after 24 hours
- DNS checker shows old/wrong values

**Solutions**:
1. Double-check DNS records in registrar
2. Ensure TTL is set (recommended: 3600)
3. Try flushing DNS cache:
   - **Windows**: `ipconfig /flushdns`
   - **Mac**: `sudo dscacheutil -flushcache`
   - **Linux**: `sudo systemd-resolve --flush-caches`
4. Wait up to 72 hours (rare cases)

---

### Issue 2: SSL Certificate Not Issued

**Symptoms**:
- Domain loads but shows "Not Secure"
- SSL status shows "Pending" in Supabase

**Solutions**:
1. Ensure DNS records are correctly configured
2. Wait 15-30 minutes after DNS verification
3. Check Supabase Dashboard for SSL status
4. If stuck after 1 hour, contact Supabase support

---

### Issue 3: Authentication Redirect Errors

**Symptoms**:
- "Invalid redirect URL" error after login
- Email verification links broken

**Solutions**:
1. Update **Site URL** in Supabase Auth settings
2. Add all redirect URLs (see Part 5)
3. Clear browser cache and cookies
4. Test in incognito/private mode

---

### Issue 4: WhatsApp Integration Not Working

**Symptoms**:
- WhatsApp button doesn't work on custom domain

**Solutions**:
1. WhatsApp integration is client-side and should work automatically
2. Check browser console for JavaScript errors
3. Ensure phone number format is correct in code
4. Test on different browsers/devices

---

### Issue 5: "Domain Already in Use"

**Symptoms**:
- Supabase shows error: "Domain is already associated with another project"

**Solutions**:
1. You may have added the domain to another Supabase project
2. Remove it from the other project first
3. Or use a subdomain instead (e.g., `app.yourhelpa.com.ng`)

---

## Advanced Configuration

### Add Multiple Subdomains

You can have different subdomains for different purposes:

| Subdomain | Purpose | DNS Record |
|-----------|---------|------------|
| `app.yourhelpa.com.ng` | Main app | CNAME → Supabase |
| `www.yourhelpa.com.ng` | Redirect to app | CNAME → yourhelpa.com.ng |
| `api.yourhelpa.com.ng` | API endpoint | CNAME → Supabase Functions |
| `blog.yourhelpa.com.ng` | External blog | A → Blog host IP |

---

### Email Configuration

If you want to use `info@yourhelpa.com.ng` or `support@yourhelpa.com.ng`:

**Add MX Records** (Mail Exchange):

Check with your email provider (e.g., Gmail, Outlook, Zoho Mail) for specific MX records.

**Example for Google Workspace**:
```
Type: MX
Name: @
Value: ASPMX.L.GOOGLE.COM
Priority: 1
TTL: 3600

Type: MX
Name: @
Value: ALT1.ASPMX.L.GOOGLE.COM
Priority: 5
TTL: 3600
```

---

## SEO Considerations

### After Domain Connection

1. **Update Google Search Console**:
   - Add `yourhelpa.com.ng` as a new property
   - Verify ownership via DNS TXT record

2. **Submit Sitemap**:
   - Create sitemap: `https://yourhelpa.com.ng/sitemap.xml`
   - Submit to Google Search Console

3. **Update Social Media Links**:
   - Facebook Business Page
   - Instagram bio
   - WhatsApp Business profile
   - Twitter/X profile

4. **Update Business Listings**:
   - Google My Business
   - Bing Places
   - Nigerian business directories

---

## Performance Optimization

### CDN and Caching

Supabase includes built-in CDN for global performance. No additional configuration needed!

### Performance Tips:

1. **Enable HTTPS** (automatic with custom domain)
2. **Optimize images** (already using ImageWithFallback component)
3. **Minimize CSS/JS** (automatic with Figma Make)
4. **Enable compression** (automatic with Supabase)

---

## Monitoring

### Check Domain Health

1. **Uptime Monitoring**:
   - Use services like UptimeRobot (free)
   - Monitor: `https://yourhelpa.com.ng`

2. **SSL Certificate Expiry**:
   - Supabase auto-renews (Let's Encrypt)
   - Certificate valid for 90 days
   - Auto-renewed at 60 days

3. **DNS Health**:
   - Use https://mxtoolbox.com/SuperTool.aspx
   - Check DNS, SSL, and blacklist status

---

## Quick Reference Card

### Your Domain Details
```
Domain: yourhelpa.com.ng
Purpose: YourHelpa daily living assistant platform
Hosting: Supabase (via Figma Make)
SSL: Automatic via Let's Encrypt
```

### Essential URLs After Setup
- **Website**: https://yourhelpa.com.ng
- **API**: https://[project-id].supabase.co/functions/v1/
- **Auth**: https://yourhelpa.com.ng/signin
- **Dashboard**: https://yourhelpa.com.ng/dashboard

### Support Contacts
- **Supabase Support**: https://supabase.com/support
- **Domain Registrar**: Check your registrar's support page
- **DNS Checker**: https://dnschecker.org
- **SSL Checker**: https://www.ssllabs.com/ssltest/

---

## Step-by-Step Checklist

Use this checklist to track your progress:

- [ ] **Step 1**: Access Supabase Custom Domains settings
- [ ] **Step 2**: Add `yourhelpa.com.ng` in Supabase
- [ ] **Step 3**: Note DNS records provided by Supabase
- [ ] **Step 4**: Login to domain registrar
- [ ] **Step 5**: Add DNS records (A or CNAME)
- [ ] **Step 6**: Save DNS changes
- [ ] **Step 7**: Wait for DNS propagation (1-24 hours)
- [ ] **Step 8**: Verify DNS using dnschecker.org
- [ ] **Step 9**: Check SSL certificate status in Supabase
- [ ] **Step 10**: Update Supabase Auth URLs
- [ ] **Step 11**: Test domain loads correctly
- [ ] **Step 12**: Test HTTPS (SSL padlock visible)
- [ ] **Step 13**: Test signup/signin
- [ ] **Step 14**: Test email verification
- [ ] **Step 15**: Test all page navigation
- [ ] **Step 16**: Test WhatsApp integration
- [ ] **Step 17**: Update social media links
- [ ] **Step 18**: Submit to Google Search Console
- [ ] **Step 19**: Set up uptime monitoring
- [ ] **Step 20**: Celebrate! 🎉

---

## Timeline

| Phase | Duration | What Happens |
|-------|----------|--------------|
| **Supabase Setup** | 5-10 minutes | Add domain in dashboard |
| **DNS Configuration** | 10-15 minutes | Add records at registrar |
| **DNS Propagation** | 1-24 hours | DNS updates worldwide |
| **SSL Issuance** | 5-15 minutes | After DNS verified |
| **Testing** | 15-30 minutes | Verify everything works |
| **Total** | ~2-26 hours | Most time is waiting for DNS |

---

## Nigerian Domain Registrar Resources

### Popular Registrars in Nigeria

1. **Web4Africa**
   - Website: https://www.web4africa.com
   - Support: support@web4africa.com
   - DNS Guide: https://www.web4africa.com/kb/

2. **Whogohost**
   - Website: https://www.whogohost.com
   - Support: https://www.whogohost.com/host/submitticket.php
   - DNS Guide: Check their knowledge base

3. **Qservers**
   - Website: https://www.qservers.net
   - Support: support@qservers.net
   - Phone: +234 1 342 1746

4. **HostGator Nigeria**
   - Website: https://www.hostgator.com.ng
   - Support: support@hostgator.com.ng

5. **DomainKing**
   - Website: https://www.domainking.ng
   - Focused on .ng domains

---

## Alternative: Cloudflare (Advanced Users)

For advanced caching and security, you can add Cloudflare in front of your domain:

### Benefits:
- ✅ Better DDoS protection
- ✅ Faster global performance
- ✅ Free tier available
- ✅ Advanced analytics

### Setup:
1. Create Cloudflare account
2. Add your domain to Cloudflare
3. Update nameservers at your registrar to Cloudflare's
4. Configure DNS in Cloudflare dashboard
5. Point to Supabase as origin server

**Note**: This is optional and adds complexity. Only do this if you need advanced features.

---

## FAQs

### Q: Can I use both `yourhelpa.com.ng` and `www.yourhelpa.com.ng`?
**A**: Yes! Add both as described in Configuration 2 above.

### Q: Will my old Supabase URL still work?
**A**: Yes, `https://[project-id].supabase.co` will continue to work alongside your custom domain.

### Q: Can I change my domain later?
**A**: Yes, but you'll need to update DNS records and Auth URLs again.

### Q: Do I need to update my WhatsApp webhook URL?
**A**: No, the webhook URL uses the Supabase domain (`[project-id].supabase.co`), not your custom domain.

### Q: Will this affect my existing users?
**A**: No, existing users can continue using the old Supabase URL or switch to the new domain. Both work simultaneously.

### Q: Do I need to update my app code?
**A**: No changes needed in your code. The domain change is external.

### Q: How much does a custom domain cost?
**A**: 
- Domain registration: ₦3,000 - ₦15,000/year (varies by registrar)
- Supabase custom domain: FREE (included in all plans)
- SSL certificate: FREE (auto-included)

### Q: Can I use a subdomain instead of root domain?
**A**: Yes! Many people use `app.yourhelpa.com.ng` for their app. This is often easier to set up.

---

## Next Steps After Domain Setup

1. **Update Marketing Materials**
   - Business cards
   - Flyers
   - Social media bios
   - Email signatures

2. **SEO Optimization**
   - Submit sitemap to Google
   - Update meta tags with new domain
   - Build backlinks to new domain

3. **Analytics Setup**
   - Google Analytics with new domain
   - Facebook Pixel
   - Track domain performance

4. **Monitor Performance**
   - Set up uptime monitoring
   - Track load times
   - Monitor SSL certificate

---

## Support

### Need Help?

1. **Supabase Support**: https://supabase.com/support
2. **Community**: https://github.com/supabase/supabase/discussions
3. **Discord**: https://discord.supabase.com

### Document Your Setup

Keep a record of:
- [ ] Registrar login details
- [ ] DNS records added
- [ ] Date domain was connected
- [ ] SSL certificate issuance date
- [ ] Any custom configurations

---

**🎉 Congratulations! Once complete, your YourHelpa platform will be live at https://yourhelpa.com.ng!**

**Questions? Issues? Check the troubleshooting section above or reach out to Supabase support.**
