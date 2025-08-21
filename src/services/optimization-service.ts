interface ResourceData {
  id: string;
  name: string;
  type: string;
  quantity: number;
  unitCost: number;
  utilization?: number;
  quality?: number;
  cropType?: string;
  seasonality?: number;
}

interface OptimizationResult {
  resources: OptimizedResource[];
  totalSaving: number;
  recommendations: string[];
  efficiency: number;
  riskAssessment: RiskAssessment;
}

interface OptimizedResource extends ResourceData {
  optimizedQuantity: number;
  efficiency: number;
  costSaving: number;
  recommendation: string;
  confidenceLevel: number;
}

interface RiskAssessment {
  overallRisk: number;
  riskFactors: string[];
  mitigationStrategies: string[];
}

export class OptimizationService {
  private static instance: OptimizationService;

  private constructor() {}

  static getInstance(): OptimizationService {
    if (!OptimizationService.instance) {
      OptimizationService.instance = new OptimizationService();
    }
    return OptimizationService.instance;
  }

  async optimizeResourceAllocation(resources: ResourceData[]): Promise<OptimizationResult> {
    try {
      console.log('Running advanced resource optimization algorithms...');
      
      const optimizedResources = await Promise.all(
        resources.map(resource => this.optimizeIndividualResource(resource))
      );

      const totalOriginalCost = resources.reduce((sum, r) => sum + (r.quantity * r.unitCost), 0);
      const totalOptimizedCost = optimizedResources.reduce((sum, r) => sum + (r.optimizedQuantity * r.unitCost), 0);
      const totalSaving = (totalOriginalCost - totalOptimizedCost) / totalOriginalCost;

      const efficiency = this.calculateOverallEfficiency(optimizedResources);
      const recommendations = this.generateSystemRecommendations(optimizedResources);
      const riskAssessment = this.assessOptimizationRisk(optimizedResources);

      return {
        resources: optimizedResources,
        totalSaving,
        recommendations,
        efficiency,
        riskAssessment
      };
    } catch (error) {
      console.error('Resource optimization failed:', error);
      throw error;
    }
  }

  private async optimizeIndividualResource(resource: ResourceData): Promise<OptimizedResource> {
    // Multi-factor optimization algorithm
    const efficiency = this.calculateResourceEfficiency(resource);
    const seasonalFactor = this.getSeasonalOptimizationFactor(resource.type);
    const cropCompatibility = this.getCropCompatibilityScore(resource.type, resource.cropType);
    const marketFactor = await this.getMarketPricingFactor(resource.type);
    
    // Advanced optimization using weighted factors
    const optimizationMultiplier = this.calculateOptimizationMultiplier(
      efficiency, seasonalFactor, cropCompatibility, marketFactor
    );
    
    const optimizedQuantity = Math.max(
      resource.quantity * optimizationMultiplier,
      resource.quantity * 0.3 // Minimum 30% of original
    );
    
    const costSaving = (resource.quantity - optimizedQuantity) * resource.unitCost;
    const confidenceLevel = this.calculateConfidenceLevel(efficiency, seasonalFactor, cropCompatibility);

    return {
      ...resource,
      optimizedQuantity,
      efficiency,
      costSaving,
      recommendation: this.generateResourceRecommendation(resource, efficiency, optimizationMultiplier),
      confidenceLevel
    };
  }

  private calculateResourceEfficiency(resource: ResourceData): number {
    const utilizationScore = Math.min(resource.utilization || 0.8, 1.0);
    const qualityScore = (resource.quality || 0.8) / 1.0;
    const costEfficiencyScore = this.calculateCostEfficiency(resource);
    const applicationEfficiencyScore = this.getApplicationEfficiency(resource.type);
    
    return (
      utilizationScore * 0.25 +
      qualityScore * 0.25 +
      costEfficiencyScore * 0.25 +
      applicationEfficiencyScore * 0.25
    );
  }

  private calculateCostEfficiency(resource: ResourceData): number {
    // Cost efficiency based on market benchmarks
    const marketBenchmarks: { [key: string]: number } = {
      'fertilizer': 50, // KES per kg
      'pesticide': 200, // KES per liter
      'seeds': 100,     // KES per kg
      'water': 5,       // KES per cubic meter
      'fuel': 150,      // KES per liter
      'labor': 500      // KES per day
    };
    
    const benchmark = marketBenchmarks[resource.type.toLowerCase()] || resource.unitCost;
    return Math.max(0, Math.min(1, benchmark / resource.unitCost));
  }

  private getApplicationEfficiency(resourceType: string): number {
    // Application efficiency based on resource type
    const efficiencyMap: { [key: string]: number } = {
      'fertilizer': 0.75,
      'pesticide': 0.80,
      'seeds': 0.90,
      'water': 0.70,
      'fuel': 0.85,
      'labor': 0.85
    };
    
    return efficiencyMap[resourceType.toLowerCase()] || 0.75;
  }

  private getSeasonalOptimizationFactor(resourceType: string): number {
    const currentMonth = new Date().getMonth();
    const seasonalFactors: { [key: string]: number[] } = {
      'fertilizer': [0.9, 0.9, 1.0, 1.0, 0.8, 0.7, 0.7, 0.8, 0.9, 1.0, 0.9, 0.9],
      'pesticide': [0.8, 0.8, 0.9, 1.0, 1.0, 0.9, 0.8, 0.8, 0.9, 0.9, 0.8, 0.8],
      'water': [0.7, 0.7, 0.8, 0.9, 1.0, 1.0, 1.0, 1.0, 0.9, 0.8, 0.7, 0.7],
      'seeds': [1.0, 0.9, 1.0, 0.9, 0.8, 0.7, 0.7, 0.8, 0.9, 1.0, 1.0, 1.0],
      'fuel': [0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9],
      'labor': [0.8, 0.8, 1.0, 1.0, 0.9, 0.8, 0.8, 0.8, 0.9, 1.0, 0.9, 0.8]
    };
    
    const factors = seasonalFactors[resourceType.toLowerCase()];
    return factors ? factors[currentMonth] : 0.85;
  }

  private getCropCompatibilityScore(resourceType: string, cropType?: string): number {
    if (!cropType) return 0.8;
    
    const compatibility: { [key: string]: { [key: string]: number } } = {
      'fertilizer': {
        'maize': 0.95, 'beans': 0.85, 'tomatoes': 0.90, 'potatoes': 0.88,
        'cabbage': 0.85, 'onions': 0.82, 'carrots': 0.80, 'default': 0.80
      },
      'pesticide': {
        'maize': 0.85, 'beans': 0.90, 'tomatoes': 0.95, 'potatoes': 0.92,
        'cabbage': 0.88, 'onions': 0.85, 'carrots': 0.83, 'default': 0.80
      },
      'water': {
        'maize': 0.80, 'beans': 0.75, 'tomatoes': 0.95, 'potatoes': 0.90,
        'cabbage': 0.85, 'onions': 0.80, 'carrots': 0.85, 'default': 0.80
      },
      'seeds': {
        'maize': 0.95, 'beans': 0.95, 'tomatoes': 0.90, 'potatoes': 0.90,
        'cabbage': 0.85, 'onions': 0.85, 'carrots': 0.85, 'default': 0.85
      }
    };
    
    const resourceCompatibility = compatibility[resourceType.toLowerCase()];
    if (!resourceCompatibility) return 0.80;
    
    return resourceCompatibility[cropType.toLowerCase()] || resourceCompatibility['default'];
  }

  private async getMarketPricingFactor(resourceType: string): Promise<number> {
    // Simulate market pricing analysis
    const marketVolatility: { [key: string]: number } = {
      'fertilizer': 0.15, // 15% volatility
      'pesticide': 0.10,
      'seeds': 0.08,
      'water': 0.05,
      'fuel': 0.20,
      'labor': 0.12
    };
    
    const volatility = marketVolatility[resourceType.toLowerCase()] || 0.10;
    const marketTrend = (Math.random() - 0.5) * volatility * 2;
    
    return Math.max(0.7, Math.min(1.3, 1 + marketTrend));
  }

  private calculateOptimizationMultiplier(
    efficiency: number,
    seasonalFactor: number,
    cropCompatibility: number,
    marketFactor: number
  ): number {
    const baseMultiplier = 0.6 + (efficiency * 0.4); // Base range: 0.6 - 1.0
    const seasonalAdjustment = seasonalFactor * 0.2; // ±20% seasonal adjustment
    const compatibilityAdjustment = (cropCompatibility - 0.8) * 0.5; // Compatibility bonus/penalty
    const marketAdjustment = (marketFactor - 1.0) * 0.3; // Market price adjustment
    
    return Math.max(0.3, Math.min(1.2, 
      baseMultiplier + seasonalAdjustment + compatibilityAdjustment + marketAdjustment
    ));
  }

  private calculateConfidenceLevel(
    efficiency: number,
    seasonalFactor: number,
    cropCompatibility: number
  ): number {
    const efficiencyConfidence = efficiency > 0.8 ? 0.9 : efficiency > 0.6 ? 0.7 : 0.5;
    const seasonalConfidence = Math.abs(seasonalFactor - 0.85) < 0.1 ? 0.9 : 0.7;
    const compatibilityConfidence = cropCompatibility > 0.85 ? 0.9 : 0.7;
    
    return (efficiencyConfidence + seasonalConfidence + compatibilityConfidence) / 3;
  }

  private generateResourceRecommendation(
    resource: ResourceData,
    efficiency: number,
    optimizationMultiplier: number
  ): string {
    if (efficiency > 0.85 && optimizationMultiplier > 0.9) {
      return `Excellent utilization of ${resource.name}. Current usage is optimal.`;
    } else if (efficiency > 0.7) {
      return `Good utilization of ${resource.name}. Minor optimization possible.`;
    } else if (optimizationMultiplier < 0.7) {
      return `Significant optimization potential for ${resource.name}. Consider reducing usage by ${Math.round((1 - optimizationMultiplier) * 100)}%.`;
    } else {
      return `Review ${resource.name} application methods and timing for better efficiency.`;
    }
  }

  private calculateOverallEfficiency(resources: OptimizedResource[]): number {
    if (resources.length === 0) return 0;
    
    const weightedEfficiency = resources.reduce((sum, resource) => {
      const weight = resource.quantity * resource.unitCost;
      return sum + (resource.efficiency * weight);
    }, 0);
    
    const totalWeight = resources.reduce((sum, resource) => 
      sum + (resource.quantity * resource.unitCost), 0
    );
    
    return totalWeight > 0 ? weightedEfficiency / totalWeight : 0;
  }

  private generateSystemRecommendations(resources: OptimizedResource[]): string[] {
    const recommendations = [];
    
    const lowEfficiencyResources = resources.filter(r => r.efficiency < 0.6);
    const highSavingResources = resources.filter(r => r.costSaving > 1000);
    const lowConfidenceResources = resources.filter(r => r.confidenceLevel < 0.6);
    
    if (lowEfficiencyResources.length > 0) {
      recommendations.push(
        `Priority optimization needed for: ${lowEfficiencyResources.map(r => r.name).join(', ')}`
      );
    }
    
    if (highSavingResources.length > 0) {
      recommendations.push(
        `High cost-saving potential (>KES 1,000) in: ${highSavingResources.map(r => r.name).join(', ')}`
      );
    }
    
    if (lowConfidenceResources.length > 0) {
      recommendations.push(
        `Collect more data for better optimization of: ${lowConfidenceResources.map(r => r.name).join(', ')}`
      );
    }
    
    recommendations.push('Implement precision agriculture techniques for better resource management');
    recommendations.push('Consider soil testing for targeted fertilizer application');
    recommendations.push('Monitor weather patterns for optimal resource timing');
    
    return recommendations;
  }

  private assessOptimizationRisk(resources: OptimizedResource[]): RiskAssessment {
    const risks = [];
    const mitigations = [];
    let overallRisk = 0;
    
    const highOptimizationResources = resources.filter(r => 
      (r.quantity - r.optimizedQuantity) / r.quantity > 0.4
    );
    
    if (highOptimizationResources.length > 0) {
      risks.push('Aggressive optimization may impact yield');
      mitigations.push('Implement gradual optimization over multiple seasons');
      overallRisk += 0.3;
    }
    
    const lowConfidenceOptimizations = resources.filter(r => r.confidenceLevel < 0.6);
    if (lowConfidenceOptimizations.length > 0) {
      risks.push('Low confidence in some optimization recommendations');
      mitigations.push('Collect additional field data before implementing changes');
      overallRisk += 0.2;
    }
    
    const criticalResources = resources.filter(r => 
      ['water', 'seeds', 'fertilizer'].includes(r.type.toLowerCase())
    );
    if (criticalResources.some(r => (r.quantity - r.optimizedQuantity) / r.quantity > 0.3)) {
      risks.push('Optimization of critical resources may affect crop survival');
      mitigations.push('Maintain safety margins for critical resources');
      overallRisk += 0.4;
    }
    
    return {
      overallRisk: Math.min(1.0, overallRisk),
      riskFactors: risks,
      mitigationStrategies: mitigations
    };
  }
}
