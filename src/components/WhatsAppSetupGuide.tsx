import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle2, ExternalLink, Copy, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface WhatsAppSetupGuideProps {
  onNavigate?: (page: string) => void;
}

export function WhatsAppSetupGuide({ onNavigate }: WhatsAppSetupGuideProps = {}) {
  const [copied, setCopied] = useState<string | null>(null);

  const webhookUrl = `https://${window.location.hostname.includes('supabase') ? window.location.hostname.split('.')[0] : 'YOUR_PROJECT_ID'}.supabase.co/functions/v1/make-server-bb3bbc22/webhook/whatsapp`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white py-24 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-primary text-white">Setup Guide</Badge>
          <h1 className="font-black dark:text-white">WhatsApp Business API Integration</h1>
          <p className="text-muted-foreground">
            Follow these steps to connect your EatsApp platform with WhatsApp Business API
          </p>
        </div>

        {/* Alert */}
        <Card className="p-6 border-accent bg-accent">
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="text-primary">Important: Production Use Notice</h3>
              <p className="text-sm">
                This is a prototype implementation. Before going live with real customer data:
              </p>
              <ul className="text-sm space-y-1 ml-4 list-disc">
                <li>Ensure compliance with data protection regulations (GDPR, NDPR)</li>
                <li>Implement proper security measures for PII handling</li>
                <li>Set up proper error handling and logging</li>
                <li>Test thoroughly with test phone numbers</li>
                <li>Review WhatsApp Business Platform policies</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Step 1 */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                1
              </div>
              <div className="flex-1 space-y-3">
                <h3>Create Facebook Developer App</h3>
                <p className="text-muted-foreground">
                  You need a Facebook Developer account and a WhatsApp Business App
                </p>
                <ol className="space-y-2 text-sm ml-4 list-decimal">
                  <li>Go to <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">developers.facebook.com <ExternalLink className="w-3 h-3" /></a></li>
                  <li>Create a new app and select &quot;Business&quot; type</li>
                  <li>Add &quot;WhatsApp&quot; product to your app</li>
                  <li>Complete the setup wizard</li>
                </ol>
              </div>
            </div>
          </div>
        </Card>

        {/* Step 2 */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                2
              </div>
              <div className="flex-1 space-y-3">
                <h3>Get Your API Credentials</h3>
                <p className="text-muted-foreground">
                  Collect the required credentials from your WhatsApp Business App
                </p>
                <div className="space-y-3">
                  <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                    <p className="text-sm font-medium">Required Credentials:</p>
                    <ul className="text-sm space-y-1">
                      <li><strong>Access Token:</strong> From WhatsApp &gt; API Setup &gt; Temporary Access Token (later use permanent token)</li>
                      <li><strong>Phone Number ID:</strong> From WhatsApp &gt; API Setup &gt; Phone Number ID</li>
                      <li><strong>Verify Token:</strong> Create your own secure string (e.g., &quot;eatsapp-verify-2024-secure&quot;)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Step 3 */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                3
              </div>
              <div className="flex-1 space-y-3">
                <h3>Configure Environment Variables</h3>
                <p className="text-muted-foreground">
                  The system has already prompted you to add these secrets. Verify they're set:
                </p>
                <div className="space-y-3">
                  <div className="bg-muted/30 p-4 rounded-lg space-y-2 font-mono text-sm">
                    <div>✅ WHATSAPP_ACCESS_TOKEN</div>
                    <div>✅ WHATSAPP_PHONE_NUMBER_ID</div>
                    <div>✅ WHATSAPP_VERIFY_TOKEN</div>
                    <div>✅ OPENAI_API_KEY (for AI consultations)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Step 4 */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                4
              </div>
              <div className="flex-1 space-y-3">
                <h3>Setup Webhook</h3>
                <p className="text-muted-foreground">
                  Configure your webhook in the Facebook Developer Console
                </p>
                <ol className="space-y-2 text-sm ml-4 list-decimal">
                  <li>Go to WhatsApp &gt; Configuration in your Facebook App</li>
                  <li>Click &quot;Edit&quot; next to Webhook</li>
                  <li>Enter the Callback URL below:</li>
                </ol>
                <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-xs break-all flex-1">{webhookUrl}</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(webhookUrl, 'webhook')}
                    >
                      {copied === 'webhook' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <ol start={4} className="space-y-2 text-sm ml-4 list-decimal">
                  <li>Enter your Verify Token (the same one you set in environment variables)</li>
                  <li>Click &quot;Verify and Save&quot;</li>
                  <li>Subscribe to webhook fields: <code className="bg-muted px-2 py-0.5 rounded text-xs">messages</code></li>
                </ol>
              </div>
            </div>
          </div>
        </Card>

        {/* Step 5 */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                5
              </div>
              <div className="flex-1 space-y-3">
                <h3>Test Your Integration</h3>
                <p className="text-muted-foreground">
                  Send a test message to verify everything works
                </p>
                <ol className="space-y-2 text-sm ml-4 list-decimal">
                  <li>In Facebook Developer Console, go to WhatsApp &gt; API Setup</li>
                  <li>Use the &quot;Send Message&quot; test tool with your test number</li>
                  <li>Send &quot;menu&quot; or &quot;start&quot; to your WhatsApp number</li>
                  <li>You should receive the EatsApp main menu</li>
                </ol>
              </div>
            </div>
          </div>
        </Card>

        {/* Features Overview */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/20">
          <div className="space-y-4">
            <h3>✨ What's Included</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Food Ordering
                </h4>
                <p className="text-xs text-muted-foreground ml-6">
                  Browse menu by category, add items to cart, checkout, track orders
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  AI Consultation
                </h4>
                <p className="text-xs text-muted-foreground ml-6">
                  Get instant food advice powered by OpenAI GPT-4
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Nutritionist Booking
                </h4>
                <p className="text-xs text-muted-foreground ml-6">
                  Book consultations with certified nutritionists
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Event Catering
                </h4>
                <p className="text-xs text-muted-foreground ml-6">
                  Request quotes and book catering for events
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Interactive Buttons
                </h4>
                <p className="text-xs text-muted-foreground ml-6">
                  Rich WhatsApp buttons and list messages
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  State Management
                </h4>
                <p className="text-xs text-muted-foreground ml-6">
                  Conversational flows with context awareness
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Resources */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3>📚 Helpful Resources</h3>
            <div className="space-y-2 text-sm">
              <a
                href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                WhatsApp Cloud API Documentation
              </a>
              <a
                href="https://developers.facebook.com/docs/whatsapp/business-management-api"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                WhatsApp Business Management API
              </a>
              <a
                href="https://developers.facebook.com/docs/whatsapp/on-premises/webhooks"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                Webhooks Configuration Guide
              </a>
              <a
                href="https://business.whatsapp.com/policy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                WhatsApp Business Policy
              </a>
            </div>
          </div>
        </Card>

        {/* API Tester Link */}
        <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3>🧪 API Testing Tool</h3>
                <p className="text-sm text-muted-foreground">
                  Use our built-in API tester to verify your integration
                </p>
              </div>
              <Button
                onClick={() => onNavigate?.('api-tester')}
                className="bg-accent hover:bg-accent text-primary"
              >
                Open Tester
              </Button>
            </div>
          </div>
        </Card>

        {/* Test Commands */}
        <Card className="p-6 border-primary/20">
          <div className="space-y-4">
            <h3>🧪 Test Commands</h3>
            <p className="text-sm text-muted-foreground">
              Try these commands in WhatsApp to test different flows:
            </p>
            <div className="grid gap-2 font-mono text-sm">
              <div className="bg-muted/30 p-3 rounded">
                <strong>menu</strong> or <strong>start</strong> - Show main menu
              </div>
              <div className="bg-muted/30 p-3 rounded">
                <strong>order</strong> - Browse food menu and order
              </div>
              <div className="bg-muted/30 p-3 rounded">
                <strong>cart</strong> - View your shopping cart
              </div>
              <div className="bg-muted/30 p-3 rounded">
                <strong>consult</strong> - Access food consultations
              </div>
              <div className="bg-muted/30 p-3 rounded">
                <strong>event</strong> - Plan an event and get catering quotes
              </div>
              <div className="bg-muted/30 p-3 rounded">
                Any question - AI will respond with food/diet advice
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
