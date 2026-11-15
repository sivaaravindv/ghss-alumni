import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="card center" style={{ marginTop: 32 }}>
      <p>பக்கம் கிடைக்கவில்லை · Page not found</p>
      <Link className="btn" href="/">முன்னாள் மாணவர் படிவம் · Alumni form</Link>
    </div>
  );
}
