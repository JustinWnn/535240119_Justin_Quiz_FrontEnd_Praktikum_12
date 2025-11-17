import Link from 'next/link';

export default function Home() {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="card text-center shadow card-login-width">
        <div className="card-body">
          <h1 className="card-title mb-4">Quiz React</h1>
          <div className="mb-3">
            <h5 className="fw-bold">Nama</h5>
            <p className="card-text">Justin Wintersen Nawi Ngan</p>
          </div>
          <div className="mb-3">
            <h5 className="fw-bold">NIM</h5>
            <p className="card-text">535240119</p>
          </div>
          <div className="mb-4">
            <h5 className="fw-bold">Topik Project</h5>
            <p className="card-text">My Game Collection List</p>
          </div>
          <Link href="/games" className="btn btn-primary w-100">
            Masuk ke Daftar Game
          </Link>
        </div>
      </div>
    </div>
  );
}