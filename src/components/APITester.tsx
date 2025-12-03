import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Send, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

export function APITester() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("Hello from EatsApp!");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-bb3bbc22`;

  const sendTestMessage = async () => {
    if (!phoneNumber || !message) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${baseUrl}/send-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          to: phoneNumber.replace(/\D/g, ""), // Remove non-digits
          message: message,
          type: "text",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult(data);
      } else {
        setError(data.error || "Failed to send message");
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const testHealthCheck = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${baseUrl}/health`);
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Health check failed");
    } finally {
      setLoading(false);
    }
  };

  const testGetMenu = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${baseUrl}/menu?category=local`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to get menu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-24 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-accent text-white">API Testing</Badge>
          <h1 className="font-black dark:text-white">WhatsApp API Tester</h1>
          <p className="text-muted-foreground">
            Test your WhatsApp Business API integration
          </p>
        </div>

        {/* Quick Tests */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3>Quick Tests</h3>
            <div className="flex flex-wrap gap-3">
              <Button onClick={testHealthCheck} disabled={loading} variant="outline">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Test Health Check"}
              </Button>
              <Button onClick={testGetMenu} disabled={loading} variant="outline">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Test Get Menu"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Send Message Test */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3>Send Test Message</h3>
            <p className="text-sm text-muted-foreground">
              Send a WhatsApp message to a test number
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-2">
                  Phone Number (with country code, e.g., 2348012345678)
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="2348012345678"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                  rows={4}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <Button
                onClick={sendTestMessage}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Result Display */}
        {result && (
          <Card className="p-6 border-primary/20 bg-primary/5">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <h3 className="text-primary">Success</h3>
              </div>
              <pre className="bg-white p-4 rounded-lg text-xs overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card className="p-6 border-accent bg-accent">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-primary" />
                <h3 className="text-primary">Error</h3>
              </div>
              <p className="text-sm">{error}</p>
            </div>
          </Card>
        )}

        {/* API Info */}
        <Card className="p-6 bg-muted/30">
          <div className="space-y-3">
            <h3>API Information</h3>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Base URL:</span>
                <code className="bg-white px-2 py-1 rounded text-xs">{baseUrl}</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Project ID:</span>
                <code className="bg-white px-2 py-1 rounded text-xs">{projectId}</code>
              </div>
            </div>

            <div className="pt-3 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-2">Available Endpoints:</p>
              <ul className="space-y-1 text-xs font-mono">
                <li>POST /send-message</li>
                <li>GET /health</li>
                <li>GET /menu?category=local</li>
                <li>GET /cart/:userId</li>
                <li>POST /webhook/whatsapp</li>
                <li>GET /webhook/whatsapp (verification)</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Notes */}
        <Card className="p-6 border-accent/20">
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 text-accent">
              ⚠️ Important Notes
            </h4>
            <ul className="text-sm space-y-2 ml-4 list-disc">
              <li>Make sure all environment variables are configured</li>
              <li>In development mode, only test recipient numbers can receive messages</li>
              <li>Add test numbers in Facebook Developer Console &gt; WhatsApp &gt; API Setup</li>
              <li>Check Supabase Edge Function logs for detailed error messages</li>
              <li>Webhook must be verified before receiving messages</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
