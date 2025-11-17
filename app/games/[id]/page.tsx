"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Game } from "@/.next/types";

export default function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [game, setGame] = useState<Game | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchGame = async () => {
        try {
            const res = await fetch(`/api/games/${id}`);
            if (res.ok) {
                const data = await res.json();
                setGame(data);
            } else {
                router.push("/404"); 
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    fetchGame();
  }, [id, router]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!game) return null;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow-lg border-0">
            <div className="card-header d-flex justify-content-between align-items-center bg-dark text-white">
              <span className="fw-bold">Game Details</span>
              <Link href="/games" className="btn btn-light btn-sm">
                &larr; Back to List
              </Link>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-4 mb-md-0">
                  {game.coverImageUrl ? (
                    <img 
                      src={game.coverImageUrl} 
                      className="detail-cover-img" 
                      alt={game.title}
                    />
                  ) : (
                    <div className="d-flex justify-content-center align-items-center detail-cover-img text-muted">
                        No Cover Image
                    </div>
                  )}
                </div>
                <div className="col-md-8">
                  <h1 className="display-5 fw-bold mb-3">{game.title}</h1>
                  <div className="mb-4">
                    <span className="badge bg-primary fs-6 me-2">{game.platform}</span>
                    <span className="badge bg-secondary fs-6">{game.genre}</span>
                  </div>
                  
                  <hr className="my-4" />
                  
                  <h4 className="mb-3">Description</h4>
                  <p className="lead text-pre-wrap">
                    {game.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}