
/**
 * Utility to compose multiple HOCs into a single HOC
 */
export const composeHOC = (...hocs: any[]) => {
  return (BaseComponent: React.ComponentType<any>) => {
    return hocs.reduceRight(
      (enhanced, hoc) => hoc(enhanced),
      BaseComponent
    );
  };
};

export default composeHOC;
