import { useState } from "react";
import { zhCN } from "react-day-picker/locale";
import { CalendarIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { dateToIsoString } from "../utils/date_format";

interface DateSelectProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
}

/**
 * shadcn 风格日期选择器：Popover + Calendar（含年月下拉）
 */
export default function DateSelect({
  value,
  onChange,
  placeholder = "选择日期",
}: DateSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative w-full">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "w-full justify-start gap-1.5 px-2 font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            <span className="truncate">
              {value ? dateToIsoString(value) : placeholder}
            </span>
          </Button>
        </PopoverTrigger>
        {value && (
          <button
            type="button"
            aria-label="清除日期"
            className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-destructive"
            onClick={() => onChange(null)}
          >
            <XIcon className="size-3.5" />
          </button>
        )}
      </div>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          locale={zhCN}
          weekStartsOn={1}
          captionLayout="dropdown"
          startMonth={new Date(2020, 0)}
          endMonth={new Date(2035, 11)}
          selected={value ?? undefined}
          defaultMonth={value ?? undefined}
          onSelect={(d) => {
            onChange(d ?? null);
            setOpen(false);
          }}
        />
        <div className="flex justify-center border-t p-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              onChange(new Date());
              setOpen(false);
            }}
          >
            今天
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
