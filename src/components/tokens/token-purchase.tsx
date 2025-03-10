
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { payment } from "@/lib/api";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

interface TokenPurchaseProps {
  onSuccess?: () => void;
}

const TokenPurchase = ({ onSuccess }: TokenPurchaseProps) => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubscribe = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const updatedUser = await payment.subscribe();
      updateUser(updatedUser);
      setShowSuccess(true);
      
      toast({
        title: "Subscription successful!",
        description: "You've received 100 tokens",
      });
      
      setTimeout(() => {
        setShowSuccess(false);
        if (onSuccess) onSuccess();
      }, 3000);
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment failed",
        description: "There was a problem processing your payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Get More Tokens</CardTitle>
        <CardDescription>
          Subscribe to receive 100 tokens monthly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4">
          <div className="text-center">
            <div className="text-4xl font-bold">100</div>
            <div className="text-sm text-muted-foreground">tokens per month</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Generate missions</span>
            <span className="text-sm">✓</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Track your progress</span>
            <span className="text-sm">✓</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Build daily streaks</span>
            <span className="text-sm">✓</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full text-center p-2 bg-green-50 text-green-600 rounded-md"
            >
              <p className="font-medium">Payment successful!</p>
              <p className="text-sm">You received 100 tokens</p>
            </motion.div>
          ) : (
            <Button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Subscribe for $9.99/month"
              )}
            </Button>
          )}
        </AnimatePresence>
      </CardFooter>
    </Card>
  );
};

export default TokenPurchase;
