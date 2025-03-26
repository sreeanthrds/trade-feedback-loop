
import React from 'react';
import OrderDetailsSection from '../OrderDetailsSection';
import { NodeData } from '../types';

type ActionType = NodeData['actionType'];
type PositionType = NodeData['positionType'];
type OrderType = NodeData['orderType'];
type ProductType = NodeData['productType'];

interface OrderDetailsPanelProps {
  actionType?: ActionType;
  positionType?: PositionType;
  orderType?: OrderType;
  limitPrice?: number;
  lots?: number;
  productType?: ProductType;
  onPositionTypeChange: (value: string) => void;
  onOrderTypeChange: (value: string) => void;
  onLimitPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLotsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProductTypeChange: (value: string) => void;
}

const OrderDetailsPanel: React.FC<OrderDetailsPanelProps> = ({
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
      <h3 className="text-sm font-medium">Order Details</h3>
      <OrderDetailsSection 
        actionType={actionType}
        positionType={positionType}
        orderType={orderType}
        limitPrice={limitPrice}
        lots={lots}
        productType={productType}
        onPositionTypeChange={onPositionTypeChange}
        onOrderTypeChange={onOrderTypeChange}
        onLimitPriceChange={onLimitPriceChange}
        onLotsChange={onLotsChange}
        onProductTypeChange={onProductTypeChange}
      />
    </div>
  );
};

export default OrderDetailsPanel;
