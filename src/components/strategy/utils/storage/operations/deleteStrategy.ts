
/**
 * Deletes a strategy by ID
 */
export const deleteStrategy = (strategyId: string) => {
  try {
    // Remove strategy data
    localStorage.removeItem(`strategy_${strategyId}`);
    localStorage.removeItem(`strategy_${strategyId}_created`);
    
    // Update strategies list
    const savedStrategiesList = localStorage.getItem('strategies');
    if (savedStrategiesList) {
      const strategies = JSON.parse(savedStrategiesList);
      const updatedStrategies = strategies.filter((s: any) => s.id !== strategyId);
      localStorage.setItem('strategies', JSON.stringify(updatedStrategies));
      console.log(`Deleted strategy ${strategyId}, updated list has ${updatedStrategies.length} strategies`);
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to delete strategy ${strategyId}:`, error);
    return false;
  }
};
