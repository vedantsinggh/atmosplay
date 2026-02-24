interface RiskPrediction {
  performanceImpact: number;
  injuryProbability: number;
  disruptionProbability: number;
  overallRisk: number;
}

class RiskCalculator {
  getCategory(riskScore: number): 'Low' | 'Moderate' | 'High' {
    if (riskScore < 30) return 'Low';
    if (riskScore < 60) return 'Moderate';
    return 'High';
  }

  generateSuggestions(
    prediction: RiskPrediction,
    weatherData: any,
    sport: string
  ): string[] {
    const suggestions: string[] = [];

    // Performance-based suggestions
    if (prediction.performanceImpact > 50) {
      suggestions.push('Consider scheduling more frequent breaks due to expected performance impact');
    }

    // Weather-based suggestions
    if (weatherData.temperature > 35) {
      suggestions.push('Extreme heat detected - schedule hydration breaks every 15 minutes');
    }
    
    if (weatherData.windSpeed > 30) {
      suggestions.push('High winds may affect ball trajectory - adjust playing strategy');
    }
    
    if (weatherData.rainProbability > 50) {
      suggestions.push('High chance of rain - prepare covers and have indoor backup plan');
    }

    if (weatherData.aqi > 150) {
      suggestions.push('Poor air quality - consider limiting outdoor activity duration');
    }

    // Sport-specific suggestions
    switch (sport) {
      case 'Cricket':
        if (weatherData.humidity > 70) {
          suggestions.push('High humidity may aid swing bowling - adjust batting strategy');
        }
        break;
      case 'Football':
        if (weatherData.temperature < 10) {
          suggestions.push('Cold conditions - ensure proper warm-up to prevent muscle injuries');
        }
        break;
      case 'Tennis':
        if (weatherData.windSpeed > 20) {
          suggestions.push('Windy conditions - focus on lower, controlled shots');
        }
        break;
    }

    return suggestions.slice(0, 5); // Return top 5 suggestions
  }

  async findAlternativeDate(_city: string, _sport: string): Promise<{
    date: string;
    riskReduction: number;
  }> {
    // Simple algorithm to find a better date within the next 7 days
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // In production, this would analyze weather forecasts for multiple dates
    // and return the optimal date with lowest risk
    
    return {
      date: tomorrow.toISOString(),
      riskReduction: 25, // Mock risk reduction percentage
    };
  }

  calculateEnsembleRisk(predictions: RiskPrediction[]): number {
    if (predictions.length === 0) return 0;
    
    // Weighted average of multiple model predictions
    const weights = [0.4, 0.3, 0.2, 0.1]; // Decreasing weights for ensemble
    let weightedSum = 0;
    let totalWeight = 0;
    
    predictions.slice(0, weights.length).forEach((pred, index) => {
      weightedSum += pred.overallRisk * weights[index];
      totalWeight += weights[index];
    });
    
    return Math.round(weightedSum / totalWeight);
  }
}

export const riskCalculator = new RiskCalculator();