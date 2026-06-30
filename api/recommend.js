const cars = [
  {
    id: 1,
    name: 'Tata Tiago',
    variant: 'XT',
    price: 610000,
    size: 'compact',
    bestFor: 'city',
    safety: 4.1,
    mileage: '20 km/l',
    review: 'Great value for first-time buyers.',
    image: '🚗'
  },
  {
    id: 2,
    name: 'Maruti Swift',
    variant: 'VXI',
    price: 680000,
    size: 'compact',
    bestFor: 'mixed',
    safety: 4.0,
    mileage: '22 km/l',
    review: 'Reliable and easy to live with.',
    image: '🚘'
  },
  {
    id: 3,
    name: 'Hyundai Grand i10 Nios',
    variant: 'Sportz',
    price: 720000,
    size: 'compact',
    bestFor: 'city',
    safety: 4.2,
    mileage: '21 km/l',
    review: 'Snug cabin and strong feature set.',
    image: '🚙'
  },
  {
    id: 4,
    name: 'Honda City',
    variant: 'V',
    price: 1380000,
    size: 'midsize',
    bestFor: 'mixed',
    safety: 4.5,
    mileage: '17 km/l',
    review: 'Comfortable for highway commutes.',
    image: '🚗'
  },
  {
    id: 5,
    name: 'Toyota Hyryder',
    variant: 'G',
    price: 1580000,
    size: 'suv',
    bestFor: 'mixed',
    safety: 4.6,
    mileage: '20 km/l',
    review: 'A strong family SUV with excellent resale.',
    image: '🚐'
  },
  {
    id: 6,
    name: 'Kia Sonet',
    variant: 'HTX',
    price: 1190000,
    size: 'suv',
    bestFor: 'city',
    safety: 4.2,
    mileage: '18 km/l',
    review: 'Compact footprint with SUV attitude.',
    image: '🚙'
  },
  {
    id: 7,
    name: 'Mahindra XUV700',
    variant: 'MX',
    price: 1680000,
    size: 'suv',
    bestFor: 'highway',
    safety: 4.7,
    mileage: '16 km/l',
    review: 'Loaded with space and confidence.',
    image: '🚐'
  },
  {
    id: 8,
    name: 'Tata Nexon EV',
    variant: 'Fearless',
    price: 1490000,
    size: 'suv',
    bestFor: 'city',
    safety: 4.4,
    mileage: '300 km/charge',
    review: 'Smart pick for low running costs.',
    image: '⚡'
  }
];

function getBudgetRange(level) {
  switch (level) {
    case 'tight':
      return { min: 0, max: 800000 };
    case 'balanced':
      return { min: 800000, max: 1400000 };
    case 'premium':
      return { min: 1400000, max: 2000000 };
    default:
      return { min: 800000, max: 1400000 };
  }
}

function scoreCar(car, answers) {
  let score = 0;
  const reasons = [];

  const budgetRange = getBudgetRange(answers.budget);
  const price = car.price;

  if (answers.budget === 'tight') {
    if (price <= budgetRange.max) {
      score += 35;
      reasons.push('fits your budget comfortably');
    } else {
      score -= 20;
      reasons.push('moves past your budget target');
    }
  } else if (answers.budget === 'balanced') {
    if (price >= budgetRange.min && price <= budgetRange.max) {
      score += 35;
      reasons.push('falls in your target budget range');
    } else if (price < budgetRange.min) {
      score += 8;
      reasons.push('below your target budget range');
    } else if (price <= budgetRange.max + 200000) {
      score += 18;
      reasons.push('slightly above your target range');
    } else {
      score -= 20;
      reasons.push('moves past your budget target');
    }
  } else {
    if (price >= budgetRange.min && price <= budgetRange.max) {
      score += 35;
      reasons.push('matches your premium budget range');
    } else if (price < budgetRange.min) {
      score += 8;
      reasons.push('below your premium target');
    } else if (price <= budgetRange.max + 400000) {
      score += 18;
      reasons.push('slightly above your premium target');
    } else {
      score -= 20;
      reasons.push('moves past your budget target');
    }
  }

  if (answers.size === car.size) {
    score += 25;
    reasons.push('matches your preferred body style');
  } else if (answers.size === 'family' && car.size === 'midsize') {
    score += 15;
    reasons.push('space is still good for family use');
  } else if (answers.size === 'city' && car.size === 'compact') {
    score += 15;
    reasons.push('easy to park and manoeuvre');
  }

  if (answers.route === car.bestFor || answers.route === 'mixed') {
    score += 15;
    reasons.push('works well for your driving mix');
  }

  const safetyBonus = answers.safety === 'priority' ? 10 : 5;
  if (car.safety >= 4.5) {
    score += safetyBonus;
    reasons.push('strong safety credentials');
  } else if (car.safety >= 4.2) {
    score += safetyBonus - 2;
    reasons.push('decent safety package');
  }

  if (answers.fuel === 'important' && car.mileage.includes('km/l')) {
    score += 10;
    reasons.push('good fuel efficiency');
  }

  if (answers.fuel === 'important' && car.name.includes('EV')) {
    score += 5;
    reasons.push('low running cost');
  }

  return { score, reasons };
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const answers = req.body;
  const budgetRange = getBudgetRange(answers.budget);
  const preferredCars = cars.filter((car) => car.price >= budgetRange.min && car.price <= budgetRange.max);
  const eligibleCars = preferredCars.length > 0 ? preferredCars : cars.filter((car) => car.price <= budgetRange.max);
  const candidateCars = eligibleCars.length > 0 ? eligibleCars : cars;

  const ranked = candidateCars
    .map((car) => ({
      ...car,
      ...scoreCar(car, answers),
      priceLabel: `₹${car.price.toLocaleString('en-IN')}`
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const bestPick = ranked[0];
  const scoreGap = bestPick ? Math.max(0, bestPick.score - (ranked[1]?.score || 0)) : 0;
  const confidence = scoreGap >= 12 ? 'High' : scoreGap >= 6 ? 'Medium' : 'Moderate';
  const primaryReasons = bestPick ? Array.from(new Set(bestPick.reasons.slice(0, 3))) : [];
  const decisionSummary = bestPick
    ? `${bestPick.name} is the strongest fit because it ${primaryReasons.join(', ')}.`
    : 'We do not have a clear top match yet for these settings.';

  res.status(200).json({
    summary: preferredCars.length > 0
      ? `We found ${ranked.length} strong fits in your preferred budget range.`
      : `We found ${ranked.length} close matches, since nothing fit your budget range exactly.`,
    ranked,
    bestPick: bestPick ? {
      id: bestPick.id,
      name: bestPick.name,
      variant: bestPick.variant,
      priceLabel: bestPick.priceLabel,
      mileage: bestPick.mileage,
      safety: bestPick.safety,
      confidence,
      decisionSummary
    } : null
  });
}
