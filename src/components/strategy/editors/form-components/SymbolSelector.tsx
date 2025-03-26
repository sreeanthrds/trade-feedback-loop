
import React, { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useIsMobile } from '@/hooks/use-mobile';

// Dummy lists for different categories
const STOCKS_LIST = [
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
];

const INDICES_LIST = [
  { value: "NIFTY", label: "Nifty 50" },
  { value: "BANKNIFTY", label: "Bank Nifty" },
  { value: "FINNIFTY", label: "Financial Services Nifty" },
  { value: "MIDCPNIFTY", label: "Midcap Nifty" },
];

const INDEX_FUTURES_LIST = [
  { value: "NIFTY-FUT", label: "Nifty 50 Futures" },
  { value: "BANKNIFTY-FUT", label: "Bank Nifty Futures" },
  { value: "FINNIFTY-FUT", label: "Financial Services Nifty Futures" },
  { value: "MIDCPNIFTY-FUT", label: "Midcap Nifty Futures" },
];

// F&O Traded Stocks (subset of stocks for this example)
const FNO_STOCKS_LIST = STOCKS_LIST.slice(0, 8);

interface SymbolSelectorProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  instrumentType?: 'stock' | 'futures' | 'options';
  underlyingType?: 'index' | 'indexFuture' | 'stock';
}

const SymbolSelector: React.FC<SymbolSelectorProps> = ({
  value,
  onChange,
  id = "symbol-selector",
  placeholder = "Select symbol",
  disabled = false,
  instrumentType = 'stock',
  underlyingType,
}) => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Determine which list to use based on instrument type and underlying type
  const symbolList = useMemo(() => {
    switch (instrumentType) {
      case 'stock':
        return STOCKS_LIST;
      case 'futures':
        return INDEX_FUTURES_LIST;
      case 'options':
        switch (underlyingType) {
          case 'index':
            return INDICES_LIST;
          case 'indexFuture':
            return INDEX_FUTURES_LIST;
          case 'stock':
            return FNO_STOCKS_LIST;
          default:
            return [];
        }
      default:
        return STOCKS_LIST;
    }
  }, [instrumentType, underlyingType]);
  
  // Find the selected symbol object based on the value
  const selectedSymbol = symbolList.find(symbol => symbol.value === value);
  
  // Determine if the dropdown should be disabled
  const isDropdownDisabled = disabled || (instrumentType === 'options' && !underlyingType);
  
  // Handle item selection
  const handleSelectItem = (currentValue: string) => {
    onChange(currentValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9"
          disabled={isDropdownDisabled}
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
          <CommandList className={isMobile ? "max-h-[40vh]" : "max-h-[300px]"}>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading={getGroupHeading(instrumentType, underlyingType)}>
              {symbolList.map((symbol) => (
                <CommandItem
                  key={symbol.value}
                  value={symbol.value}
                  onSelect={handleSelectItem}
                  className="flex items-center"
                  data-mobile-selectable={isMobile ? "true" : undefined}
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

// Helper function to get appropriate heading for the symbols group
function getGroupHeading(
  instrumentType?: 'stock' | 'futures' | 'options',
  underlyingType?: 'index' | 'indexFuture' | 'stock'
): string {
  switch (instrumentType) {
    case 'stock':
      return 'Stocks';
    case 'futures':
      return 'Index Futures';
    case 'options':
      switch (underlyingType) {
        case 'index':
          return 'Indices';
        case 'indexFuture':
          return 'Index Futures';
        case 'stock':
          return 'F&O Stocks';
        default:
          return 'Symbols';
      }
    default:
      return 'Symbols';
  }
}

export default SymbolSelector;
