import "../styles/cards.css";

function Cards() {
  // Example card data
  const cardData = [
    { title: "Fast Analytics", description: "Get insights in seconds" },
    { title: "AI Powered", description: "Smart Optimization" },
    { title: "Tracks Progress", description: "Rates progress made" },
  ];

  return (
    <div className="cards-container">
      {cardData.map((card, index) => (
        <div key={index} className="card">
          <h2 className="card-title">{card.title}</h2>
          <p className="card-description">{card.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Cards;
