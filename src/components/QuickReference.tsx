import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  MessageCircle, 
  ShoppingCart, 
  Brain, 
  Calendar,
  Code,
  CheckCircle2
} from "lucide-react";

export function QuickReference() {
  const flows = [
    {
      icon: ShoppingCart,
      title: "Food Ordering",
      color: "text-primary",
      bgColor: "bg-primary/5",
      commands: ["order", "cart", "checkout"],
      steps: [
        "User sends 'order'",
        "Bot shows categories",
        "User selects category",
        "Bot shows menu items",
        "User adds items to cart",
        "User sends 'checkout'",
        "Order confirmed"
      ],
      dataStored: ["cart:{userId}", "order:{orderId}", "user_order:{userId}:{orderId}"]
    },
    {
      icon: Brain,
      title: "AI Consultation",
      color: "text-accent",
      bgColor: "bg-accent",
      commands: ["consult", "Any question"],
      steps: [
        "User sends 'consult'",
        "Bot shows consultation types",
        "User selects 'AI Consult'",
        "User asks questions",
        "Bot responds with AI advice",
        "Conversation continues"
      ],
      dataStored: ["consultation:{userId}", "messages history"]
    },
    {
      icon: Calendar,
      title: "Event Catering",
      color: "text-primary",
      bgColor: "bg-primary/5",
      commands: ["event"],
      steps: [
        "User sends 'event'",
        "Bot asks event type",
        "User provides type",
        "Bot asks guest count",
        "User provides count",
        "Bot shows packages",
        "User provides date",
        "Quote generated"
      ],
      dataStored: ["event:{eventId}", "user_event:{userId}:{eventId}"]
    }
  ];

  return (
    <div className="min-h-screen bg-white py-24 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-primary text-white">Developer Reference</Badge>
          <h1 className="font-black dark:text-white">WhatsApp Flows Quick Reference</h1>
          <p className="text-muted-foreground">
            Technical overview of all conversation flows
          </p>
        </div>

        {/* Architecture Diagram */}
        <Card className="p-8 bg-gradient-to-br from-secondary/20 to-white">
          <h2 className="mb-6 font-bold dark:text-white">System Architecture</h2>
          <div className="space-y-4 font-mono text-sm">
            <div className="flex items-center gap-4">
              <div className="w-32 text-right text-muted-foreground">User</div>
              <div className="flex-1 border-t-2 border-dashed border-primary"></div>
              <div className="w-48 bg-primary/10 p-3 rounded">WhatsApp</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32"></div>
              <div className="text-primary">↓</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 text-right text-muted-foreground">Meta</div>
              <div className="flex-1 border-t-2 border-dashed border-primary"></div>
              <div className="w-48 bg-primary/10 p-3 rounded">Cloud API v21</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32"></div>
              <div className="text-primary">↓</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 text-right text-muted-foreground">Webhook</div>
              <div className="flex-1 border-t-2 border-dashed border-accent"></div>
              <div className="w-48 bg-accent p-3 rounded text-primary">Edge Function</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32"></div>
              <div className="text-accent">↓</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 text-right text-muted-foreground">Services</div>
              <div className="flex-1 border-t-2 border-dashed border-accent"></div>
              <div className="w-48 bg-accent p-3 rounded space-y-1 text-primary">
                <div>• Order Service</div>
                <div>• Consultation Service</div>
                <div>• Event Service</div>
                <div>• WhatsApp Service</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32"></div>
              <div className="text-accent">↓</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 text-right text-muted-foreground">Storage</div>
              <div className="flex-1 border-t-2 border-dashed border-primary"></div>
              <div className="w-48 bg-primary/10 p-3 rounded">KV Store</div>
            </div>
          </div>
        </Card>

        {/* Conversation Flows */}
        <div className="space-y-6">
          <h2 className="font-bold dark:text-white">Conversation Flows</h2>
          <div className="grid gap-6">
            {flows.map((flow, index) => (
              <Card key={index} className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${flow.bgColor} rounded-lg flex items-center justify-center`}>
                        <flow.icon className={`w-6 h-6 ${flow.color}`} />
                      </div>
                      <div>
                        <h3>{flow.title}</h3>
                        <div className="flex gap-2 mt-2">
                          {flow.commands.map((cmd, i) => (
                            <Badge key={i} variant="outline" className="font-mono text-xs">
                              {cmd}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-sm">Flow Steps</h4>
                      <div className="space-y-2">
                        {flow.steps.map((step, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                              {i + 1}
                            </div>
                            <p className="text-sm text-muted-foreground">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm">Data Storage Keys</h4>
                      <div className="space-y-2">
                        {flow.dataStored.map((key, i) => (
                          <div key={i} className="bg-muted/30 p-3 rounded font-mono text-xs">
                            {key}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Service Functions */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Code className="w-6 h-6 text-primary" />
              <h2 className="font-bold dark:text-white">Service Functions</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* WhatsApp Service */}
              <div className="space-y-3">
                <h3 className="text-sm">WhatsAppService</h3>
                <div className="space-y-2 text-sm font-mono">
                  <div className="bg-muted/30 p-2 rounded">sendText(to, message)</div>
                  <div className="bg-muted/30 p-2 rounded">sendButtons(to, body, buttons)</div>
                  <div className="bg-muted/30 p-2 rounded">sendList(to, body, sections)</div>
                  <div className="bg-muted/30 p-2 rounded">sendImage(to, imageUrl)</div>
                  <div className="bg-muted/30 p-2 rounded">sendReaction(to, msgId, emoji)</div>
                  <div className="bg-muted/30 p-2 rounded">markAsRead(messageId)</div>
                </div>
              </div>

              {/* Order Service */}
              <div className="space-y-3">
                <h3 className="text-sm">OrderService</h3>
                <div className="space-y-2 text-sm font-mono">
                  <div className="bg-muted/30 p-2 rounded">getMenuByCategory(category)</div>
                  <div className="bg-muted/30 p-2 rounded">getCart(userId)</div>
                  <div className="bg-muted/30 p-2 rounded">addToCart(userId, item)</div>
                  <div className="bg-muted/30 p-2 rounded">createOrder(userId, ...)</div>
                  <div className="bg-muted/30 p-2 rounded">getOrder(orderId)</div>
                  <div className="bg-muted/30 p-2 rounded">updateOrderStatus(orderId)</div>
                </div>
              </div>

              {/* Consultation Service */}
              <div className="space-y-3">
                <h3 className="text-sm">ConsultationService</h3>
                <div className="space-y-2 text-sm font-mono">
                  <div className="bg-muted/30 p-2 rounded">getAIResponse(userId, msg)</div>
                  <div className="bg-muted/30 p-2 rounded">addMessage(userId, role, msg)</div>
                  <div className="bg-muted/30 p-2 rounded">createBooking(...)</div>
                  <div className="bg-muted/30 p-2 rounded">getBooking(bookingId)</div>
                  <div className="bg-muted/30 p-2 rounded">getQuickTips(category)</div>
                </div>
              </div>

              {/* Event Service */}
              <div className="space-y-3">
                <h3 className="text-sm">EventService</h3>
                <div className="space-y-2 text-sm font-mono">
                  <div className="bg-muted/30 p-2 rounded">createEventRequest(...)</div>
                  <div className="bg-muted/30 p-2 rounded">getEventRequest(eventId)</div>
                  <div className="bg-muted/30 p-2 rounded">calculateEstimate(guests)</div>
                  <div className="bg-muted/30 p-2 rounded">getPackageRecommendation()</div>
                  <div className="bg-muted/30 p-2 rounded">formatPackageComparison()</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Environment Variables */}
        <Card className="p-6 border-accent/20">
          <div className="space-y-4">
            <h2 className="font-bold dark:text-white">Environment Variables</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <code className="text-sm">WHATSAPP_ACCESS_TOKEN</code>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  From Facebook Developer Console → WhatsApp → API Setup
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <code className="text-sm">WHATSAPP_PHONE_NUMBER_ID</code>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Phone Number ID (not the actual phone number)
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <code className="text-sm">WHATSAPP_VERIFY_TOKEN</code>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Your custom secure token for webhook verification
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <code className="text-sm">OPENAI_API_KEY</code>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  From platform.openai.com for AI consultations
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* File Structure */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="font-bold dark:text-white">Project Structure</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2 font-mono text-xs">
                <div className="font-bold mb-2">Backend</div>
                <div>📁 /supabase/functions/server/</div>
                <div className="ml-4">📄 index.tsx (main server)</div>
                <div className="ml-4">📄 whatsapp-service.tsx</div>
                <div className="ml-4">📄 order-service.tsx</div>
                <div className="ml-4">📄 consultation-service.tsx</div>
                <div className="ml-4">📄 event-service.tsx</div>
                <div className="ml-4">🔒 kv_store.tsx (protected)</div>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="font-bold mb-2">Frontend</div>
                <div>📁 /components/</div>
                <div className="ml-4">📄 WhatsAppSetupGuide.tsx</div>
                <div className="ml-4">📄 APITester.tsx</div>
                <div className="ml-4">📄 QuickReference.tsx</div>
                <div className="ml-4">📄 FloatingWhatsAppButton.tsx</div>
                <div className="ml-4">...</div>
                <div>📁 /</div>
                <div className="ml-4">📄 WHATSAPP_API_README.md</div>
                <div className="ml-4">📄 IMPLEMENTATION_SUMMARY.md</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Commands */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/20">
          <div className="space-y-4">
            <h2 className="font-bold dark:text-white">User Commands Reference</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm">Main Menu</h4>
                <div className="space-y-1 text-sm font-mono">
                  <div className="bg-white p-2 rounded">menu</div>
                  <div className="bg-white p-2 rounded">start</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm">Ordering</h4>
                <div className="space-y-1 text-sm font-mono">
                  <div className="bg-white p-2 rounded">order</div>
                  <div className="bg-white p-2 rounded">cart</div>
                  <div className="bg-white p-2 rounded">checkout</div>
                  <div className="bg-white p-2 rounded">orders</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm">Services</h4>
                <div className="space-y-1 text-sm font-mono">
                  <div className="bg-white p-2 rounded">consult</div>
                  <div className="bg-white p-2 rounded">event</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
