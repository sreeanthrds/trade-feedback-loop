
/**
 * Gets list of all saved strategies
 */
export const getStrategiesList = () => {
  try {
    const savedStrategies = localStorage.getItem('strategies');
    const strategies = savedStrategies ? JSON.parse(savedStrategies) : [];
    console.log(`Retrieved ${strategies.length} strategies from localStorage`);
    return strategies;
  } catch (error) {
    console.error('Failed to load strategies list:', error);
    return [];
  }
};
