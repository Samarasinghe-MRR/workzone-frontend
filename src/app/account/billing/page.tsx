import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Plus } from "lucide-react";

export default function BillingPage() {
  const paymentMethods = [
    {
      id: 1,
      type: "Visa",
      last4: "4242",
      expiry: "12/25",
      isDefault: true,
    },
    {
      id: 2,
      type: "Mastercard",
      last4: "5555",
      expiry: "10/26",
      isDefault: false,
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-2xl font-bold">Billing Info</CardTitle>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
            <Plus className="h-4 w-4" />
            Add Payment Method
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Payment Methods</h3>

          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {method.type} •••• {method.last4}
                      </span>
                      {method.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Expires {method.expiry}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Billing History</h3>
          <p className="text-muted-foreground">
            Your recent billing history and invoices will appear here.
          </p>
          <Button variant="outline">View All Invoices</Button>
        </div>
      </CardContent>
    </Card>
  );
}
