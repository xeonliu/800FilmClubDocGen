import { generateTimeOptions } from "../utils/date_format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

const TIME_OPTIONS = generateTimeOptions();

/**
 * 以15分钟为单位的时间下拉选择器（shadcn Select）
 */
export default function TimeSelect({ value, onChange, id }: TimeSelectProps) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger id={id} size="sm" className="w-full">
        <SelectValue placeholder="--:--" />
      </SelectTrigger>
      <SelectContent className="max-h-64">
        {TIME_OPTIONS.map((t) => (
          <SelectItem key={t} value={t}>
            {t}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
