import { Check, X } from "lucide-react";

interface OrderTimelineProps {
  status: string;
}

const STEPS = [
  { key: "paid", label: "Ödendi" },
  { key: "preparing", label: "Hazırlanıyor" },
  { key: "shipped", label: "Kargoda" },
  { key: "delivered", label: "Teslim edildi" },
];

const STEP_ORDER: Record<string, number> = {
  pending: -1,
  paid: 0,
  preparing: 1,
  shipped: 2,
  delivered: 3,
};

const OrderTimeline = ({ status }: OrderTimelineProps) => {
  if (status === "failed" || status === "cancelled") {
    return (
      <div className="flex items-center gap-2 py-2">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-destructive/15 text-destructive">
          <X className="w-3.5 h-3.5" />
        </span>
        <span className="text-xs uppercase tracking-widest font-bold text-destructive">
          {status === "failed" ? "Ödeme başarısız" : "Sipariş iptal edildi"}
        </span>
      </div>
    );
  }

  const currentIndex = STEP_ORDER[status] ?? -1;

  return (
    <div className="flex items-start sm:items-center gap-0 py-2 overflow-x-auto">
      {STEPS.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isActive = isCompleted || isCurrent;

        return (
          <div key={step.key} className="flex items-center flex-1 min-w-[90px] last:flex-none last:min-w-0">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors ${
                  isActive
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-card border-border text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : <span className="text-[10px] font-bold">{i + 1}</span>}
              </span>
              <span
                className={`text-[10px] uppercase tracking-widest font-bold whitespace-nowrap ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                className={`flex-1 h-0.5 mx-1 sm:mx-2 mt-[-18px] sm:mt-0 ${
                  i < currentIndex ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
