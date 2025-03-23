
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InstrumentSymbol } from './types';

interface SymbolSelectorProps {
  value: string | undefined;
  symbols: InstrumentSymbol[];
  onChange: (symbol: string) => void;
}

const SymbolSelector: React.FC<SymbolSelectorProps> = ({
  value,
  symbols,
  onChange
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Filter symbols based on search input
  const filteredSymbols = symbols.filter(
    item => 
      item.symbol.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSymbolSelect = (symbol: string) => {
    onChange(symbol);
    setOpen(false);
  };

  const selectedSymbol = symbols.find(item => item.symbol === value);

  return (
    <div>
      <Label htmlFor="symbol-select" className="text-sm font-medium">Symbol</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id="symbol-select"
            aria-expanded={open}
            className={cn(
              "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1",
              !value && "text-muted-foreground"
            )}
          >
            {value ? 
              selectedSymbol?.symbol || value :
              "Search for a symbol..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search for a symbol..." 
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandEmpty>No symbol found.</CommandEmpty>
            {filteredSymbols && filteredSymbols.length > 0 ? (
              <CommandGroup>
                {filteredSymbols.map((item) => (
                  <CommandItem
                    key={item.symbol}
                    value={item.symbol}
                    onSelect={() => handleSymbolSelect(item.symbol)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.symbol ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="font-medium">{item.symbol}</span>
                    <span className="ml-2 text-muted-foreground text-xs">{item.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <div className="py-6 text-center text-sm">No items to display</div>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SymbolSelector;
