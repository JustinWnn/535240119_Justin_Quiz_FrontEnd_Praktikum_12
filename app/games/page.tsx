"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Game } from "@/.next/types";

const API_KEY = "b27fdc1dc8d440e19083d744c0d40972"; 

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("PC");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const fetchGames = async () => {
    const res = await fetch("/api/games");
    if (res.ok) {
      const data = await res.json();
      setGames(data);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchGames();
  }, []);

  const handleSearchAPI = async () => {
    if (!title) return alert("Please enter a game title to search");
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&search=${title}&page_size=1`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const gameData = data.results[0];
        setTitle(gameData.name);
        setGenre(gameData.genres.map((g: any) => g.name).join(", "));
        setCoverImageUrl(gameData.background_image);
        
        const descResponse = await fetch(`https://api.rawg.io/api/games/${gameData.id}?key=${API_KEY}`);
        const descData = await descResponse.json();
        setDescription(descData.description_raw || "No description available.");
        
        const parentPlatforms = gameData.parent_platforms.map((p: any) => p.platform.name);
        if(parentPlatforms.includes("PC")) setPlatform("PC");
        else if(parentPlatforms.includes("PlayStation")) setPlatform("PlayStation");
        else if(parentPlatforms.includes("Xbox")) setPlatform("Xbox");
        else if(parentPlatforms.includes("Nintendo")) setPlatform("Nintendo Switch");
        else if(parentPlatforms.includes("iOS") || parentPlatforms.includes("Android")) setPlatform("Mobile");
      } else {
        alert("Game not found in database");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data. Check your API Key or connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setCoverImageUrl("");
    const fileInput = document.getElementById('inputCover') as HTMLInputElement;
    if(fileInput) fileInput.value = "";
  };

  const handleEdit = (game: Game) => {
    setEditId(game.id);
    setTitle(game.title);
    setGenre(game.genre);
    setPlatform(game.platform);
    setDescription(game.description);
    setCoverImageUrl(game.coverImageUrl || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setTitle("");
    setGenre("");
    setPlatform("PC");
    setDescription("");
    setCoverImageUrl("");
    const fileInput = document.getElementById('inputCover') as HTMLInputElement;
    if(fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !genre || !description) return;

    const gameData = {
      title,
      genre,
      platform,
      description,
      coverImageUrl,
    };

    try {
      if (editId) {
        const res = await fetch(`/api/games/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(gameData),
        });
        if (!res.ok) throw new Error("Failed to update");
      } else {
        const res = await fetch("/api/games", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(gameData),
        });
        if (!res.ok) throw new Error("Failed to create");
      }

      fetchGames();
      handleCancelEdit();
    } catch (error) {
      alert("Error saving game");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this game?")) {
      try {
        await fetch(`/api/games/${id}`, { method: "DELETE" });
        fetchGames();
      } catch (error) {
        alert("Error deleting game");
      }
    }
  };

  if (!isMounted) return null;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Game Collection</h2>
        <div>
          <Link href="/explore" className="btn btn-outline-dark me-2">
             Explore Popular Games
          </Link>
          <Link href="/" className="btn btn-dark">
            Back to Home
          </Link>
        </div>
      </div>

      <div className="card mb-5 shadow-sm border-0">
        <div className={`card-header text-white ${editId ? 'bg-warning' : 'bg-primary'}`}>
          {editId ? 'Edit Game' : 'Add New Game'}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="inputTitle" className="form-label">Game Title</label>
                <div className="input-group">
                  <input
                    id="inputTitle"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Genshin Impact"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    aria-label="Game Title"
                  />
                  <button 
                    type="button" 
                    className="btn btn-info text-white" 
                    onClick={handleSearchAPI}
                    disabled={isLoading}
                  >
                    {isLoading ? "Searching..." : "Auto-Fill"}
                  </button>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="inputGenre" className="form-label">Genre</label>
                <input
                  id="inputGenre"
                  type="text"
                  className="form-control"
                  placeholder="e.g. RPG"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  required
                  aria-label="Genre"
                />
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="selectPlatform" className="form-label">Platform</label>
                <select 
                  id="selectPlatform"
                  className="form-select" 
                  value={platform} 
                  onChange={(e) => setPlatform(e.target.value)}
                  aria-label="Select Platform"
                >
                  <option value="PC">PC</option>
                  <option value="PlayStation">PlayStation</option>
                  <option value="Xbox">Xbox</option>
                  <option value="Nintendo Switch">Nintendo Switch</option>
                  <option value="Mobile">Mobile</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="inputCover" className="form-label">Cover Image (Local or URL)</label>
              <div className="input-group">
                <input
                  id="inputCover"
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageUpload}
                  aria-label="Upload Cover Image"
                />
                <button 
                  type="button" 
                  className="btn btn-outline-secondary" 
                  onClick={handleClearImage}
                >
                  Clear
                </button>
              </div>
              {coverImageUrl && (
                <div className="mt-2">
                  <small className="text-muted">Preview:</small>
                  <br />
                  <div style={{ width: '150px', height: '150px', border: '1px solid #ccc', overflow: 'hidden', borderRadius: '4px' }}>
                    <img src={coverImageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="inputDesc" className="form-label">Description</label>
              <textarea
                id="inputDesc"
                className="form-control"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                aria-label="Description"
              />
            </div>
            <div className="d-flex gap-2">
                <button type="submit" className={`btn w-100 ${editId ? 'btn-warning' : 'btn-success'}`}>
                {editId ? 'Update Game' : 'Add Game'}
                </button>
                {editId && (
                    <button type="button" onClick={handleCancelEdit} className="btn btn-secondary w-100">
                        Cancel
                    </button>
                )}
            </div>
          </form>
        </div>
      </div>

      <div className="row">
        {games.length === 0 ? (
          <div className="col-12 text-center text-dark py-5">
            <h4>No games in database.</h4>
          </div>
        ) : (
          games.map((game) => (
            <div key={game.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm border-0">
                 {game.coverImageUrl ? (
                  <img 
                    src={game.coverImageUrl} 
                    className="card-img-top game-cover-img" 
                    alt={game.title}
                  />
                ) : (
                   <div className="d-flex justify-content-center align-items-center bg-light text-muted game-cover-img">
                     No Image
                   </div>
                )}
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title fw-bold text-truncate w-75">{game.title}</h5>
                    <span className="badge bg-info text-dark">{game.platform}</span>
                  </div>
                  <h6 className="card-subtitle mb-3 text-muted">{game.genre}</h6>
                  <p className="card-text text-truncate flex-grow-1">
                    {game.description}
                  </p>
                  
                  <div className="d-flex justify-content-between mt-3 pt-3 border-top gap-2">
                    <Link href={`/games/${game.id}`} className="btn btn-outline-primary btn-sm flex-fill">
                      View
                    </Link>
                    <button
                      onClick={() => handleEdit(game)}
                      className="btn btn-outline-warning btn-sm flex-fill"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(game.id)}
                      className="btn btn-danger btn-sm flex-fill"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}