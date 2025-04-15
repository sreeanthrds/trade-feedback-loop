
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Transaction } from '@/components/strategy/backtesting/types';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  const [sortField, setSortField] = useState<keyof Transaction>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<'all' | 'entry' | 'exit'>('all');
  
  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };
  
  const getExitReasonBadge = (reason?: string) => {
    if (!reason) return null;
    
    const colors: Record<string, string> = {
      take_profit: 'bg-green-900/40 text-green-300 border-green-700',
      stop_loss: 'bg-red-900/40 text-red-300 border-red-700',
      trailing_stop: 'bg-blue-900/40 text-blue-300 border-blue-700',
      manual: 'bg-yellow-900/40 text-yellow-300 border-yellow-700',
      strategy_end: 'bg-gray-700/40 text-gray-300 border-gray-600'
    };
    
    const labels: Record<string, string> = {
      take_profit: 'Take Profit',
      stop_loss: 'Stop Loss',
      trailing_stop: 'Trailing Stop',
      manual: 'Manual Exit',
      strategy_end: 'Strategy End'
    };
    
    return (
      <Badge variant="outline" className={colors[reason]}>
        {labels[reason] || reason}
      </Badge>
    );
  };
  
  // Apply sorting and filtering
  const filteredTransactions = transactions
    .filter(t => filter === 'all' || t.type === filter)
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
  
  const SortIcon = ({ field }: { field: keyof Transaction }) => (
    <>
      {sortField === field && (
        sortDirection === 'asc' ? (
          <ChevronUp className="ml-1 h-4 w-4 inline text-gray-400" />
        ) : (
          <ChevronDown className="ml-1 h-4 w-4 inline text-gray-400" />
        )
      )}
    </>
  );
  
  return (
    <Card className="border-[#2A2F3C] bg-[#161923]/60 backdrop-blur-sm">
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Transaction History</h3>
          <div className="flex gap-2">
            <Badge 
              variant={filter === 'all' ? 'default' : 'outline'} 
              className={`cursor-pointer ${filter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : 'border-[#2A2F3C] text-gray-400 hover:bg-[#1C202C]/60'}`}
              onClick={() => setFilter('all')}
            >
              All
            </Badge>
            <Badge 
              variant={filter === 'entry' ? 'default' : 'outline'} 
              className={`cursor-pointer ${filter === 'entry' ? 'bg-blue-600 hover:bg-blue-700' : 'border-[#2A2F3C] text-gray-400 hover:bg-[#1C202C]/60'}`}
              onClick={() => setFilter('entry')}
            >
              Entries
            </Badge>
            <Badge 
              variant={filter === 'exit' ? 'default' : 'outline'} 
              className={`cursor-pointer ${filter === 'exit' ? 'bg-blue-600 hover:bg-blue-700' : 'border-[#2A2F3C] text-gray-400 hover:bg-[#1C202C]/60'}`}
              onClick={() => setFilter('exit')}
            >
              Exits
            </Badge>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="relative overflow-x-auto rounded-md border border-[#2A2F3C]">
          <Table>
            <TableHeader className="bg-[#1C202C]/60">
              <TableRow className="border-[#2A2F3C] hover:bg-[#20242F]/80">
                <TableHead 
                  className="cursor-pointer text-gray-400"
                  onClick={() => handleSort('timestamp')}
                >
                  Date <SortIcon field="timestamp" />
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-gray-400"
                  onClick={() => handleSort('type')}
                >
                  Type <SortIcon field="type" />
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-gray-400"
                  onClick={() => handleSort('symbol')}
                >
                  Symbol <SortIcon field="symbol" />
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-gray-400"
                  onClick={() => handleSort('side')}
                >
                  Side <SortIcon field="side" />
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-gray-400"
                  onClick={() => handleSort('price')}
                >
                  Price <SortIcon field="price" />
                </TableHead>
                <TableHead className="text-gray-400">Quantity</TableHead>
                <TableHead className="text-gray-400">Total</TableHead>
                <TableHead 
                  className="cursor-pointer text-gray-400"
                  onClick={() => handleSort('pnl')}
                >
                  P/L <SortIcon field="pnl" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="border-[#2A2F3C] hover:bg-[#20242F]/80">
                  <TableCell className="text-gray-300">
                    {format(new Date(transaction.timestamp), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.type === 'entry' ? 'secondary' : 'default'} className={transaction.type === 'entry' ? 'bg-indigo-900/40 text-indigo-300 border-indigo-700' : 'bg-blue-900/40 text-blue-300 border-blue-700'}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">{transaction.symbol}</TableCell>
                  <TableCell>
                    <span className={transaction.side === 'buy' ? 'text-green-500' : 'text-red-500'}>
                      {transaction.side.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-300">{formatCurrency(transaction.price)}</TableCell>
                  <TableCell className="text-gray-300">{transaction.quantity}</TableCell>
                  <TableCell className="text-gray-300">{formatCurrency(transaction.amount)}</TableCell>
                  <TableCell>
                    {transaction.type === 'exit' ? (
                      <div className="space-y-1">
                        <div className={transaction.pnl && transaction.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                          {transaction.pnl !== undefined ? formatCurrency(transaction.pnl) : '-'}
                          {transaction.pnlPercentage !== undefined && 
                            ` (${transaction.pnlPercentage >= 0 ? '+' : ''}${transaction.pnlPercentage.toFixed(2)}%)`
                          }
                        </div>
                        {transaction.exitReason && (
                          <div>{getExitReasonBadge(transaction.exitReason)}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredTransactions.length === 0 && (
                <TableRow className="border-[#2A2F3C]">
                  <TableCell colSpan={8} className="text-center py-6 text-gray-400">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default TransactionsTable;
