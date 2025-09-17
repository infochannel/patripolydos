import { useState } from "react";
import { Calendar, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, subMonths, startOfMonth, endOfMonth, isAfter, isBefore } from "date-fns";
import { es } from "date-fns/locale";

interface DateFilterProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  customDate?: Date;
  onCustomDateChange?: (date: Date) => void;
}

export function DateFilter({ selectedPeriod, onPeriodChange, customDate, onCustomDateChange }: DateFilterProps) {
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  const periods = [
    { value: "current", label: "Mes Actual", date: new Date() },
    { value: "last-1", label: "Mes Anterior", date: subMonths(new Date(), 1) },
    { value: "last-2", label: "Hace 2 Meses", date: subMonths(new Date(), 2) },
    { value: "last-3", label: "Hace 3 Meses", date: subMonths(new Date(), 3) },
    { value: "last-6", label: "Hace 6 Meses", date: subMonths(new Date(), 6) },
    { value: "custom", label: "Fecha Personalizada", date: customDate || new Date() }
  ];

  const getCurrentPeriodLabel = () => {
    if (selectedPeriod === "custom" && customDate) {
      return `${format(customDate, "MMMM yyyy", { locale: es })}`;
    }
    const period = periods.find(p => p.value === selectedPeriod);
    return period ? period.label : "Mes Actual";
  };

  const getCurrentDateDisplay = () => {
    let targetDate = new Date();
    
    if (selectedPeriod === "custom" && customDate) {
      targetDate = customDate;
    } else {
      const period = periods.find(p => p.value === selectedPeriod);
      if (period) targetDate = period.date;
    }

    return format(targetDate, "MMMM yyyy", { locale: es });
  };

  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    // Generate last 24 months
    for (let i = 0; i < 24; i++) {
      const date = subMonths(currentDate, i);
      options.push({
        value: date.toISOString().slice(0, 7), // YYYY-MM format
        label: format(date, "MMMM yyyy", { locale: es }),
        date: date
      });
    }
    
    return options;
  };

  const handleCustomMonthSelect = (monthValue: string) => {
    const [year, month] = monthValue.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    onCustomDateChange?.(date);
    onPeriodChange("custom");
    setIsCustomOpen(false);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-primary">Período de Datos</h3>
              <p className="text-sm text-muted-foreground">
                Mostrando datos de: <span className="font-medium">{getCurrentDateDisplay()}</span>
              </p>
            </div>
          </div>

          <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                {getCurrentPeriodLabel()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Períodos Rápidos</h4>
                  <div className="grid gap-1">
                    {periods.slice(0, -1).map((period) => (
                      <Button
                        key={period.value}
                        variant="ghost"
                        size="sm"
                        className="justify-start h-auto py-2"
                        onClick={() => {
                          onPeriodChange(period.value);
                          setIsCustomOpen(false);
                        }}
                      >
                        <div className="text-left">
                          <div className="font-medium">{period.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(period.date, "MMMM yyyy", { locale: es })}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <h4 className="font-medium text-sm">Seleccionar Mes</h4>
                  <Select onValueChange={handleCustomMonthSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un mes" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {generateMonthOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}