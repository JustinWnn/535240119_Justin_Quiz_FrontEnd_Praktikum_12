"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_KEY = "b27fdc1dc8d440e19083d744c0d40972"; 

interface RawgGame {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  released: string;
}

export default function ExplorePage() {
  const [games, setGames] = useState<RawgGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularGames = async () => {
      try {
        const res = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&dates=2023-01-01,2024-12-31&ordering=-added&page_size=12`);
        const data = await res.json();
        setGames(data.results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularGames();
  }, []);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Explore Popular Games</h2>
        <Link href="/games" className="btn btn-secondary">
          Back to My Collection
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
            <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
      ) : (
        <div className="row">
          {games.map((game) => (
            <div key={game.id} className="col-md-3 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={game.background_image}
                  className="card-img-top"
                  alt={game.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h6 className="card-title fw-bold text-truncate">{game.name}</h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">{game.released}</small>
                    <span className="badge bg-warning text-dark">★ {game.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}