
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderDetailsSectionProps {
  actionType?: 'entry' | 'exit' | 'alert';
  positionType?: 'buy' | 'sell';
  orderType?: 'market' | 'limit';
  limitPrice?: number;
  lots?: number;
  productType?: 'intraday' | 'carryForward';
  onPositionTypeChange: (value: string) => void;
  onOrderTypeChange: (value: string) => void;
  onLimitPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLotsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProductTypeChange: (value: string) => void;
}

const OrderDetailsSection: React.FC<OrderDetailsSectionProps> = ({
  actionType,
  positionType,
  orderType,
  limitPrice,
  lots,
  productType,
  onPositionTypeChange,
  onOrderTypeChange,
  onLimitPriceChange,
  onLotsChange,
  onProductTypeChange
}) => {
  return (
    <div className="space-y-4">
      {actionType === 'entry' && (
        <div className="space-y-2">
          <Label>Position Type</Label>
          <RadioGroup 
            value={positionType || 'buy'}
            onValueChange={onPositionTypeChange}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="buy" id="buy" />
              <Label htmlFor="buy" className="cursor-pointer">Buy</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sell" id="sell" />
              <Label htmlFor="sell" className="cursor-pointer">Sell</Label>
            </div>
          </RadioGroup>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="order-type">Order Type</Label>
        <Select
          value={orderType || 'market'}
          onValueChange={onOrderTypeChange}
        >
          <SelectTrigger id="order-type">
            <SelectValue placeholder="Select order type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="market">Market</SelectItem>
            <SelectItem value="limit">Limit</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {orderType === 'limit' && (
        <div className="space-y-2">
          <Label htmlFor="limit-price">Limit Price</Label>
          <Input
            id="limit-price"
            type="number"
            value={limitPrice || ''}
            onChange={onLimitPriceChange}
            placeholder="Enter limit price"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="lots">Quantity (Lots)</Label>
        <Input
          id="lots"
          type="number"
          min="1"
          value={lots || 1}
          onChange={onLotsChange}
          placeholder="Number of lots"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="product-type">Product Type</Label>
        <Select
          value={productType || 'intraday'}
          onValueChange={onProductTypeChange}
        >
          <SelectTrigger id="product-type">
            <SelectValue placeholder="Select product type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="intraday">Intraday (MIS)</SelectItem>
            <SelectItem value="carryForward">Carry Forward (CNC)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default OrderDetailsSection;
