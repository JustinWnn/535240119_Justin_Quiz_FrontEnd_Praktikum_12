import Link from 'next/link';

export default function NotFound() {
  return (
    <div 
      className="d-flex flex-column align-items-center justify-content-center vh-100 text-center p-4"
      style={{
        backgroundImage: "url('/images/speed.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backgroundBlendMode: 'darken',
        minHeight: '100vh',
        width: '100%'
      }}
    >
      <h1 className="fw-bold text-danger" style={{ fontSize: '10rem', textShadow: '4px 4px 0px #000' }}>
        404
      </h1>

      <p className="display-6 fw-bold text-white mb-5" style={{ maxWidth: '800px', lineHeight: '1.4', textShadow: '2px 2px 4px #000' }}>
        OOPS! nothing here 
      </p>
      
      <Link href="/" className="btn btn-danger btn-lg px-5 py-3 fw-bold rounded-pill shadow-lg border-0">
        Back
      </Link>
    </div>
  );
}