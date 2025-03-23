
import React, { useState } from 'react';
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

// Dummy list of symbols - in a real app this would come from an API
const SYMBOL_LIST = [
  { value: "RELIANCE", label: "Reliance Industries" },
  { value: "TCS", label: "Tata Consultancy Services" },
  { value: "INFY", label: "Infosys" },
  { value: "HDFC", label: "HDFC Bank" },
  { value: "ICICI", label: "ICICI Bank" },
  { value: "SBIN", label: "State Bank of India" },
  { value: "WIPRO", label: "Wipro Ltd" },
  { value: "HCLTECH", label: "HCL Technologies" },
  { value: "ITC", label: "ITC Ltd" },
  { value: "BHARTIARTL", label: "Bharti Airtel" },
  { value: "NTPC", label: "NTPC Ltd" },
  { value: "ONGC", label: "Oil & Natural Gas" },
  { value: "SUNPHARMA", label: "Sun Pharmaceutical" },
  { value: "ASIANPAINT", label: "Asian Paints" },
  { value: "MARUTI", label: "Maruti Suzuki" },
  { value: "TATASTEEL", label: "Tata Steel" },
  { value: "KOTAKBANK", label: "Kotak Mahindra Bank" },
  { value: "AXISBANK", label: "Axis Bank" },
  { value: "ULTRACEMCO", label: "UltraTech Cement" },
  { value: "TITAN", label: "Titan Company" },
  { value: "TATAMOTORS", label: "Tata Motors" },
  { value: "ADANIPORTS", label: "Adani Ports" },
  { value: "BAJFINANCE", label: "Bajaj Finance" },
  { value: "HINDALCO", label: "Hindalco Industries" },
  { value: "JSWSTEEL", label: "JSW Steel" },
];

interface SymbolSelectorProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
}

const SymbolSelector: React.FC<SymbolSelectorProps> = ({
  value,
  onChange,
  id = "symbol-selector",
  placeholder = "Select symbol",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  
  // Find the selected symbol object based on the value
  const selectedSymbol = SYMBOL_LIST.find(symbol => symbol.value === value);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9"
          disabled={disabled}
          id={id}
        >
          {selectedSymbol ? selectedSymbol.value : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput placeholder="Search symbol..." className="h-9"/>
          </div>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Symbols">
              {SYMBOL_LIST.map((symbol) => (
                <CommandItem
                  key={symbol.value}
                  value={symbol.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                  className="flex items-center"
                >
                  <span>{symbol.value}</span>
                  <span className="ml-2 text-muted-foreground text-xs">
                    - {symbol.label}
                  </span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === symbol.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SymbolSelector;
