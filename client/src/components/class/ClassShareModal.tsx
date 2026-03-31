"use client";

import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, QrCode, Key, Hash } from "lucide-react";
import { toast } from "sonner";

interface ClassShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className: string;
  joinCode: string;
  joinPassword: string;
}

export default function ClassShareModal({
  open,
  onOpenChange,
  className,
  joinCode,
  joinPassword,
}: ClassShareModalProps) {
  const joinUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/student/classes?joinCode=${encodeURIComponent(joinCode)}`;

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} көшірілді`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0">
        <div className="bg-linear-to-br from-primary to-primary/80 px-6 pt-6 pb-8 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="text-primary-foreground text-center text-2xl font-bold">
              {className}
            </DialogTitle>
          </DialogHeader>
          <p className="text-center text-primary-foreground/80 text-sm mt-1">
            Қосылу үшін QR кодын сканерлеңіз немесе деректерді енгізіңіз
          </p>
        </div>

        <div className="px-6 pb-6 -mt-4">
          <div className="bg-card rounded-xl shadow-lg border p-6 space-y-6">
            {/* QR Code */}
            <div className="flex flex-col items-center gap-3">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <QRCodeSVG
                  value={joinUrl}
                  size={180}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <QrCode className="h-3.5 w-3.5" />
                Қосылу бетін ашу үшін сканерлеңіз
              </p>
            </div>

            <div className="h-px bg-border" />

            {/* Join Code */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Hash className="h-4 w-4" />
                  Қосылу коды
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => copyToClipboard(joinCode, "Қосылу коды")}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Көшіру
                </Button>
              </div>
              <div className="bg-muted rounded-lg px-4 py-3 text-center">
                <span className="text-3xl font-mono font-bold tracking-widest select-all">
                  {joinCode}
                </span>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Key className="h-4 w-4" />
                  Құпия сөз
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => copyToClipboard(joinPassword, "Құпия сөз")}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Көшіру
                </Button>
              </div>
              <div className="bg-muted rounded-lg px-4 py-3 text-center">
                <span className="text-3xl font-mono font-bold tracking-widest select-all">
                  {joinPassword}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
