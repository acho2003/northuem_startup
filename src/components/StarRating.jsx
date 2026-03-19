import './StarRating.css';

export default function StarRating({ rating, size = 'md', interactive = false, onRate }) {
    const stars = [1, 2, 3, 4, 5];
    return (
        <div className={`star-rating star-${size}`}>
            {stars.map(s => (
                <span
                    key={s}
                    className={`star ${s <= Math.round(rating) ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
                    onClick={() => interactive && onRate && onRate(s)}
                >
                    ★
                </span>
            ))}
            {size !== 'sm' && <span className="rating-value">{Number(rating).toFixed(1)}</span>}
        </div>
    );
}
