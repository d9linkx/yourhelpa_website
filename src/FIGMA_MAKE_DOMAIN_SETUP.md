# Connect yourhelpa.com.ng to Figma Make

## Overview

This guide shows you how to connect your custom domain `yourhelpa.com.ng` to your Figma Make project (YourHelpa app).

---

## Important: Figma Make Domain Connection

Figma Make applications are deployed on Supabase infrastructure, but the domain connection process is managed through the **Figma Make interface**, not the Supabase dashboard directly.

---

## Step-by-Step Guide

### Step 1: Access Your Figma Make Project

1. Open your Figma Make project in your browser
2. Look for **Settings**, **Publish**, or **Deploy** options (usually in the top-right or sidebar)
3. Find the **Domain** or **Custom Domain** section

---

### Step 2: Figma Make Domain Settings

Depending on your Figma Make version, you'll see one of these options:

#### Option A: Direct Domain Input
- Look for a field labeled **"Custom Domain"** or **"Production Domain"**
- Enter: `yourhelpa.com.ng`
- Click **"Save"** or **"Connect Domain"**

#### Option B: Deployment Settings
- Click **"Publish"** or **"Deploy"**
- Find **"Custom Domain Settings"**
- Enter your domain: `yourhelpa.com.ng`
- Follow the on-screen instructions

---

### Step 3: Get DNS Configuration

After entering your domain, Figma Make will provide DNS records. These typically look like:

**For Root Domain** (`yourhelpa.com.ng`):
```
Type: A
Name: @ or yourhelpa.com.ng
Value: [IP address provided by Figma Make]
TTL: 3600
```

**For WWW Subdomain** (`www.yourhelpa.com.ng`):
```
Type: CNAME
Name: www
Value: [CNAME target provided by Figma Make]
TTL: 3600
```

**Copy these values** - you'll need them in the next step.

---

### Step 4: Configure DNS at Your Domain Registrar

#### Common Nigerian Registrars:

<details>
<summary><strong>Web4Africa</strong> (Click to expand)</summary>

1. Go to https://clients.web4africa.com
2. Login with your credentials
3. Click **"Domains"** → **"My Domains"**
4. Click on `yourhelpa.com.ng`
5. Click **"Manage DNS"** or **"DNS Management"**
6. Click **"Add Record"** or **"Add New Record"**
7. Add the A record:
   - **Type**: A
   - **Name**: @ (or leave blank)
   - **Value**: [IP from Figma Make]
   - **TTL**: 3600
8. Add the CNAME record (for www):
   - **Type**: CNAME
   - **Name**: www
   - **Value**: [CNAME from Figma Make]
   - **TTL**: 3600
9. Click **"Save"** or **"Add Record"**
</details>

<details>
<summary><strong>Whogohost</strong> (Click to expand)</summary>

1. Go to https://www.whogohost.com/host/clientarea.php
2. Login with your credentials
3. Go to **"Domains"** → **"My Domains"**
4. Click on `yourhelpa.com.ng`
5. Click **"Manage Domain"**
6. Select **"DNS Management"** or **"Manage DNS"**
7. Add the A record:
   - **Type**: A
   - **Host**: @ (or leave blank)
   - **Points to**: [IP from Figma Make]
   - **TTL**: 3600
8. Add the CNAME record:
   - **Type**: CNAME
   - **Host**: www
   - **Points to**: [CNAME from Figma Make]
   - **TTL**: 3600
9. Click **"Add Record"** and then **"Save Changes"**
</details>

<details>
<summary><strong>Qservers</strong> (Click to expand)</summary>

1. Go to https://www.qservers.net/client/
2. Login to your account
3. Navigate to **"Domains"** → **"My Domains"**
4. Click on `yourhelpa.com.ng`
5. Click **"Manage"** → **"DNS Management"**
6. Add the A record:
   - **Type**: A
   - **Name**: @ (or blank)
   - **Address**: [IP from Figma Make]
   - **TTL**: 3600
7. Add the CNAME record:
   - **Type**: CNAME
   - **Name**: www
   - **Target**: [CNAME from Figma Make]
   - **TTL**: 3600
8. Click **"Save"** or **"Update"**
</details>

<details>
<summary><strong>HostGator Nigeria</strong> (Click to expand)</summary>

1. Go to https://portal.hostgator.com.ng
2. Login to your account
3. Go to **"Domains"** → **"DNS Management"**
4. Select `yourhelpa.com.ng`
5. Click **"Manage"** or **"Edit DNS"**
6. Add the A record:
   - **Type**: A Record
   - **Host**: @
   - **Points To**: [IP from Figma Make]
   - **TTL**: 3600
7. Add the CNAME record:
   - **Type**: CNAME
   - **Host**: www
   - **Points To**: [CNAME from Figma Make]
   - **TTL**: 3600
8. Click **"Add Record"** and **"Save"**
</details>

---

### Step 5: Verify DNS Configuration

After adding DNS records, verify they're working:

#### Online DNS Checker (Recommended):
1. Go to https://dnschecker.org
2. Enter `yourhelpa.com.ng`
3. Select **"A"** from the dropdown
4. Click **"Search"**
5. Check if the IP matches what Figma Make provided

For WWW subdomain:
1. Enter `www.yourhelpa.com.ng`
2. Select **"CNAME"**
3. Verify it matches Figma Make's value

#### Command Line Verification:

**Windows (Command Prompt/PowerShell):**
```bash
nslookup yourhelpa.com.ng
```

**Mac/Linux (Terminal):**
```bash
dig yourhelpa.com.ng
# or
nslookup yourhelpa.com.ng
```

You should see the IP address you configured.

---

### Step 6: Confirm in Figma Make

1. Return to Figma Make
2. Go back to **Domain Settings**
3. Click **"Verify Domain"** or **"Check DNS"**
4. Figma Make will verify the DNS records
5. Wait for confirmation (usually takes a few seconds to minutes)

---

### Step 7: SSL Certificate (HTTPS)

Figma Make automatically provisions an SSL certificate for your domain:

- **Provider**: Let's Encrypt (free)
- **Issuance time**: 5-15 minutes after DNS verification
- **Auto-renewal**: Yes (every 90 days)
- **Status check**: Look for "SSL Active" or a green padlock icon

---

### Step 8: Update Authentication URLs

After your domain is connected, update your Supabase authentication settings:

1. **Find your Supabase Project ID**:
   - Check `/utils/supabase/info.tsx`
   - Or look at your current URL format: `https://[PROJECT_ID].supabase.co`

2. **Update Supabase Auth Settings**:
   - Go to https://supabase.com/dashboard
   - Select your YourHelpa project
   - Navigate to **Authentication** → **URL Configuration**
   - Update **Site URL** to: `https://yourhelpa.com.ng`
   - Add to **Redirect URLs**:
     ```
     https://yourhelpa.com.ng
     https://yourhelpa.com.ng/**
     https://yourhelpa.com.ng/auth/callback
     ```
   - Click **"Save"**

---

## DNS Configuration Reference

### Complete DNS Setup (Recommended)

For both root domain and www subdomain to work:

| Type | Name/Host | Value/Target | TTL | Purpose |
|------|-----------|--------------|-----|---------|
| A | @ | [Figma Make IP] | 3600 | Root domain |
| CNAME | www | yourhelpa.com.ng | 3600 | WWW subdomain |

### Alternative: Subdomain Only

If you prefer using a subdomain like `app.yourhelpa.com.ng`:

| Type | Name/Host | Value/Target | TTL |
|------|-----------|--------------|-----|
| CNAME | app | [Figma Make CNAME] | 3600 |

---

## Timeline Expectations

| Phase | Duration | Status |
|-------|----------|--------|
| DNS Record Addition | 5-10 min | Active task |
| DNS Propagation | 1-24 hours | Waiting (usually 1-4 hrs) |
| Figma Make Verification | 1-5 min | Automatic |
| SSL Certificate Issuance | 5-15 min | Automatic |
| Full Deployment | ~2-26 hours | Total time |

**Most of the time is waiting for DNS propagation** - this is normal!

---

## Testing Checklist

After setup is complete, test these:

### Basic Functionality
- [ ] Visit https://yourhelpa.com.ng - loads homepage
- [ ] HTTPS works (green padlock in browser)
- [ ] WWW version works: https://www.yourhelpa.com.ng
- [ ] No certificate warnings

### Navigation
- [ ] All pages load correctly
- [ ] Internal links work
- [ ] Images display properly
- [ ] Dark/light mode works

### Authentication
- [ ] Sign up with new account works
- [ ] Sign in with existing account works
- [ ] Email verification links work
- [ ] Password reset links work
- [ ] Logout works

### Features
- [ ] WhatsApp button works
- [ ] Service categories load
- [ ] Blog posts display
- [ ] Forms submit correctly
- [ ] Dashboard accessible (if logged in)

---

## Troubleshooting

### Issue 1: "Domain Not Found" After 24 Hours

**Possible Causes:**
- DNS records not saved properly
- Incorrect DNS values
- Nameserver issues

**Solutions:**
1. Double-check DNS records in your registrar
2. Ensure you clicked "Save" after adding records
3. Verify the IP/CNAME values match Figma Make exactly
4. Try different DNS checker tools
5. Contact your registrar's support

---

### Issue 2: "SSL Certificate Pending"

**Possible Causes:**
- DNS not fully propagated
- Verification not complete

**Solutions:**
1. Wait 15-30 minutes after DNS verification
2. Check DNS is resolving correctly
3. Clear browser cache
4. Try accessing in incognito/private mode
5. If stuck after 1 hour, check Figma Make status

---

### Issue 3: "This site can't be reached"

**Possible Causes:**
- DNS not propagated yet
- Wrong IP address in A record
- Browser DNS cache

**Solutions:**
1. Wait longer (up to 24 hours)
2. Flush DNS cache:
   - **Windows**: `ipconfig /flushdns`
   - **Mac**: `sudo killall -HUP mDNSResponder`
   - **Linux**: `sudo systemd-resolve --flush-caches`
3. Try on different network (mobile data)
4. Use incognito/private browsing

---

### Issue 4: Domain Works But Authentication Fails

**Symptoms:**
- "Invalid redirect URL" errors
- Can't sign in/sign up
- Email links broken

**Solutions:**
1. Update Supabase Auth URLs (see Step 8)
2. Add all redirect URLs:
   - `https://yourhelpa.com.ng`
   - `https://yourhelpa.com.ng/**`
   - `https://www.yourhelpa.com.ng/**`
3. Clear cookies and site data
4. Test in incognito mode

---

### Issue 5: Mixed Content Warnings

**Symptoms:**
- Some resources load over HTTP
- Broken padlock icon
- Console errors about mixed content

**Solutions:**
1. All resources should use HTTPS
2. Check for hardcoded HTTP links in code
3. Update any external resource URLs to HTTPS
4. Figma Make should handle this automatically

---

## Alternative: If Figma Make Doesn't Have Domain Settings

If you don't see domain settings in Figma Make:

### Check These Locations:
1. **Top navigation bar** - Look for Settings icon ⚙️
2. **Project menu** - Three dots (...) or hamburger menu
3. **Deploy/Publish section** - Usually top-right
4. **Share menu** - May include domain options

### Contact Figma Make Support:
If you can't find domain settings:
1. Check Figma Make documentation
2. Contact Figma support
3. Check if your plan includes custom domains

### Manual Supabase Setup (Fallback):
If Figma Make doesn't support custom domains directly:

1. Note your Supabase project ID from the current URL
2. Go to https://supabase.com/dashboard
3. Find your project
4. Follow the standard Supabase custom domain setup
5. See `/CUSTOM_DOMAIN_SETUP.md` for detailed instructions

---

## Post-Setup Tasks

After your domain is connected:

### 1. Update Marketing Materials
- [ ] Update business cards
- [ ] Update social media bios:
  - Facebook: https://facebook.com/yourhelpa
  - Instagram: @yourhelpa
  - Twitter/X: @yourhelpa
- [ ] Update WhatsApp Business profile
- [ ] Update email signatures
- [ ] Update printed materials

### 2. SEO Setup
- [ ] Submit to Google Search Console
- [ ] Create and submit sitemap
- [ ] Update Google My Business
- [ ] Update business directories
- [ ] Set up Google Analytics (if not already done)

### 3. Monitoring
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Monitor SSL certificate expiry (auto-renews)
- [ ] Track site performance
- [ ] Monitor error logs

### 4. Share the News!
- [ ] Announce on social media
- [ ] Email existing users (if any)
- [ ] Update WhatsApp status
- [ ] Tell your network

---

## Quick Command Reference

### Check DNS Resolution
```bash
# Windows
nslookup yourhelpa.com.ng
nslookup www.yourhelpa.com.ng

# Mac/Linux  
dig yourhelpa.com.ng
dig www.yourhelpa.com.ng
```

### Flush DNS Cache
```bash
# Windows
ipconfig /flushdns

# Mac
sudo killall -HUP mDNSResponder
sudo dscacheutil -flushcache

# Linux
sudo systemd-resolve --flush-caches
```

### Test SSL Certificate
```bash
# Using curl
curl -I https://yourhelpa.com.ng

# Check certificate details
openssl s_client -connect yourhelpa.com.ng:443
```

---

## Important Reminders

### ✅ DO:
- Keep DNS records simple (one A record for root)
- Use both yourhelpa.com.ng and www.yourhelpa.com.ng
- Wait full 24 hours before panicking
- Test on multiple devices/networks
- Keep registrar login credentials safe

### ❌ DON'T:
- Don't delete old DNS records until new ones work
- Don't add multiple A records for same domain
- Don't use very low TTL values (< 300)
- Don't forget to update Auth URLs in Supabase
- Don't share DNS changes publicly until tested

---

## Support Resources

### Figma Make Support
- Check in-app help/documentation
- Figma Community forums
- Figma Support: https://help.figma.com

### Domain & DNS Help
- DNSChecker: https://dnschecker.org
- SSL Checker: https://www.ssllabs.com/ssltest/
- WhatsMyDNS: https://www.whatsmydns.net

### Nigerian Registrars Support
- **Web4Africa**: support@web4africa.com
- **Whogohost**: Submit ticket via client portal
- **Qservers**: support@qservers.net
- **HostGator NG**: support@hostgator.com.ng

---

## Success Indicators

You'll know everything is working when:

✅ **Domain Access**
- `https://yourhelpa.com.ng` loads your app
- `https://www.yourhelpa.com.ng` loads your app
- Green padlock (SSL) appears in browser
- No certificate warnings

✅ **Functionality**
- Can sign up and sign in
- Email verification works
- All pages navigate correctly
- WhatsApp integration works
- Forms submit successfully

✅ **Performance**
- Page loads in under 3 seconds
- No console errors
- All images display
- Styles load correctly

---

## Frequently Asked Questions

**Q: How long does DNS propagation take?**
A: Usually 1-4 hours, but can take up to 24-48 hours in rare cases.

**Q: Will my old Figma Make URL still work?**
A: Yes! Both URLs will work - your new custom domain AND the original Figma Make/Supabase URL.

**Q: Can I change the domain later?**
A: Yes, but you'll need to update DNS records and authentication URLs again.

**Q: Do I need to update my app code?**
A: No! The domain change is external - no code changes needed.

**Q: Is SSL/HTTPS automatic?**
A: Yes! Figma Make automatically provisions free SSL certificates via Let's Encrypt.

**Q: What if my plan doesn't support custom domains?**
A: Contact Figma Make support to check your plan features or upgrade if needed.

**Q: Can I use a subdomain instead?**
A: Yes! You can use `app.yourhelpa.com.ng` or any subdomain you prefer.

**Q: Will this affect my WhatsApp integration?**
A: No, WhatsApp integration will continue working. The webhook URL uses your Supabase project domain, not the custom domain.

---

## Final Checklist

Before considering setup complete:

- [ ] DNS records added at registrar
- [ ] DNS propagation verified (dnschecker.org)
- [ ] Domain verified in Figma Make
- [ ] SSL certificate active (HTTPS works)
- [ ] Supabase Auth URLs updated
- [ ] Site loads on custom domain
- [ ] WWW subdomain works (if configured)
- [ ] Authentication works (sign up/in)
- [ ] Email verification tested
- [ ] All features tested and working
- [ ] No console errors
- [ ] Mobile responsive check
- [ ] Different browsers tested
- [ ] Social media links updated
- [ ] Monitoring set up

---

## 🎉 Congratulations!

Once complete, your YourHelpa platform will be live at:

**🌐 https://yourhelpa.com.ng**

Your Nigerian users will now have a professional, memorable domain to access your WhatsApp-based daily living assistant platform!

---

**Need help? Check the troubleshooting section or reach out to Figma Make support!**
