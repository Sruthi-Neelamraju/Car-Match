import { useState } from 'react';

const initialState = {
  budget: 'balanced',
  size: 'compact',
  route: 'mixed',
  safety: 'priority',
  fuel: 'important'
};

export default function App() {
  const [answers, setAnswers] = useState(initialState);
  const [recommendations, setRecommendations] = useState([]);
  const [summary, setSummary] = useState('');
  const [bestPick, setBestPick] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      });
      const data = await response.json();
      setRecommendations(data.ranked);
      setSummary(data.summary);
      setBestPick(data.bestPick);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setSummary('Error fetching recommendations. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">Car Match</p>
        <h1>From confused to confident in minutes.</h1>
        <p className="subtitle">
          Answer a few simple questions and get a shortlist of cars that fit your lifestyle.
        </p>
      </header>

      <main className="content-grid">
        <form className="panel" onSubmit={handleSubmit}>
          <h2>Tell us what matters</h2>

          <label>
            Budget
            <select name="budget" value={answers.budget} onChange={handleChange}>
              <option value="tight">Under ₹8 lakh</option>
              <option value="balanced">₹8–14 lakh</option>
              <option value="premium">Above ₹14 lakh</option>
            </select>
          </label>

          <label>
            Preferred body style
            <select name="size" value={answers.size} onChange={handleChange}>
              <option value="compact">Compact</option>
              <option value="midsize">Midsize</option>
              <option value="suv">SUV</option>
              <option value="family">Family-friendly</option>
            </select>
          </label>

          <label>
            Typical usage
            <select name="route" value={answers.route} onChange={handleChange}>
              <option value="city">Mostly city</option>
              <option value="mixed">Mixed city + highway</option>
              <option value="highway">Mostly highway</option>
            </select>
          </label>

          <label>
            Safety priority
            <select name="safety" value={answers.safety} onChange={handleChange}>
              <option value="priority">Very important</option>
              <option value="balanced">Moderately important</option>
            </select>
          </label>

          <label>
            Fuel efficiency
            <select name="fuel" value={answers.fuel} onChange={handleChange}>
              <option value="important">Important</option>
              <option value="neutral">Not a priority</option>
            </select>
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Finding matches…' : 'Find my shortlist'}
          </button>
        </form>

        <section className="panel results">
          <h2>Your shortlist</h2>
          {summary ? <p className="summary">{summary}</p> : <p className="placeholder">Your best-fit cars will appear here.</p>}

          {bestPick ? (
            <div className="best-pick-card">
              <div className="best-pick-header">
                <span className="pill">Best fit</span>
                <span className="confidence">{bestPick.confidence} confidence</span>
              </div>
              <h3>{bestPick.name} {bestPick.variant}</h3>
              <p>{bestPick.priceLabel}</p>
              <p>{bestPick.mileage} • Safety {bestPick.safety}/5</p>
              <p className="decision-summary">{bestPick.decisionSummary}</p>
            </div>
          ) : null}

          <div className="cards">
            {recommendations.map((car) => (
              <article key={car.id} className="card">
                <div className="card-top">
                  <span className="emoji">{car.image}</span>
                  <div>
                    <h3>{car.name}</h3>
                    <p>{car.variant}</p>
                  </div>
                </div>
                <ul>
                  <li>Price: {car.priceLabel}</li>
                  <li>Mileage: {car.mileage}</li>
                  <li>Safety: {car.safety}/5</li>
                </ul>
                <p className="review">“{car.review}”</p>
                <p className="reasons">Why it fits: {car.reasons.slice(0, 2).join(', ')}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
